package org.example.utcctp.auth;

import org.example.utcctp.audit.AuditService;
import org.example.utcctp.model.OtpCode;
import org.example.utcctp.model.RoleType;
import org.example.utcctp.model.User;
import org.example.utcctp.notification.EmailService;
import org.example.utcctp.notification.EmailTemplates;
import org.example.utcctp.notification.WebhookService;
import org.example.utcctp.repository.OtpCodeRepository;
import org.example.utcctp.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class SignupService {
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 10;
    private static final int MAX_ATTEMPTS = 5;
    private static final String PURPOSE = "SIGNUP";

    private final SecureRandom random = new SecureRandom();

    private final UserRepository userRepository;
    private final OtpCodeRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final AuditService auditService;
    private final WebhookService webhookService;

    public SignupService(
            UserRepository userRepository,
            OtpCodeRepository otpRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            JwtService jwtService,
            AuditService auditService,
            WebhookService webhookService
    ) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.auditService = auditService;
        this.webhookService = webhookService;
    }

    public Map<String, Object> requestOtp(SignupRequest request) {
        String email = request.email().toLowerCase().trim();
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }

        String code = generateCode();
        OtpCode otp = new OtpCode();
        otp.setEmail(email);
        otp.setPurpose(PURPOSE);
        otp.setCodeHash(passwordEncoder.encode(code));
        otp.setPayloadJson(serializeSignup(request));
        otp.setExpiresAt(Instant.now().plus(OTP_EXPIRY_MINUTES, ChronoUnit.MINUTES));
        otpRepository.save(otp);

        emailService.sendAsync(email,
                "[UTCC-TP] รหัสยืนยันการสมัครสมาชิก",
                EmailTemplates.otp(code, OTP_EXPIRY_MINUTES));

        webhookService.sendOtp(email, code);

        auditService.record(null, "SIGNUP_OTP_REQUEST", "User", email, Map.of("username", request.username()));

        return Map.of(
                "status", "sent",
                "expiresInMinutes", OTP_EXPIRY_MINUTES,
                "message", "OTP sent to " + email
        );
    }
    public Map<String, Object> resendOtp(String email) {
        String cleanedEmail = email.toLowerCase().trim();
        
        // Find the latest SIGNUP OTP to get the original payload
        OtpCode lastOtp = otpRepository.findFirstByEmailAndPurposeAndConsumedFalseOrderByCreatedAtDesc(cleanedEmail, PURPOSE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No pending signup found for this email"));

        String code = generateCode();
        OtpCode newOtp = new OtpCode();
        newOtp.setEmail(cleanedEmail);
        newOtp.setPurpose(PURPOSE);
        newOtp.setCodeHash(passwordEncoder.encode(code));
        newOtp.setPayloadJson(lastOtp.getPayloadJson()); // Reuse the same payload (username, password, etc.)
        newOtp.setExpiresAt(Instant.now().plus(OTP_EXPIRY_MINUTES, ChronoUnit.MINUTES));
        otpRepository.save(newOtp);

        emailService.sendAsync(cleanedEmail,
                "[UTCC-TP] รหัสยืนยันการสมัครสมาชิก (ส่งใหม่)",
                EmailTemplates.otp(code, OTP_EXPIRY_MINUTES));

        webhookService.sendOtp(cleanedEmail, code);

        auditService.record(null, "SIGNUP_OTP_RESEND", "User", cleanedEmail, Map.of("resend", "true"));

        return Map.of(
                "status", "sent",
                "expiresInMinutes", OTP_EXPIRY_MINUTES,
                "message", "New OTP sent to " + cleanedEmail
        );
    }

    public AuthResponse verifyOtp(OtpVerifyRequest request) {
        String email = request.email().toLowerCase().trim();
        OtpCode otp = otpRepository.findFirstByEmailAndPurposeAndConsumedFalseOrderByCreatedAtDesc(email, PURPOSE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "OTP not requested or expired"));

        if (otp.getExpiresAt().isBefore(Instant.now())) {
            otp.setConsumed(true);
            otpRepository.save(otp);
            throw new ResponseStatusException(HttpStatus.GONE, "OTP expired");
        }
        if (otp.getAttempts() >= MAX_ATTEMPTS) {
            otp.setConsumed(true);
            otpRepository.save(otp);
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many attempts");
        }

        otp.setAttempts(otp.getAttempts() + 1);
        if (!passwordEncoder.matches(request.code(), otp.getCodeHash())) {
            otpRepository.save(otp);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid OTP code");
        }

        SignupRequest signup = parseSignup(otp.getPayloadJson());
        if (userRepository.findByUsername(signup.username()).isPresent()) {
            otp.setConsumed(true);
            otpRepository.save(otp);
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }

        User user = new User();
        user.setUsername(signup.username());
        user.setPasswordHash(passwordEncoder.encode(signup.password()));
        user.setDisplayName(signup.displayName());
        user.setEmail(email);
        user.setStudentId(signup.studentId());
        user.setFaculty(signup.faculty());
        user.setMajor(signup.major());
        user.setAcademicYear(signup.academicYear());
        user.setRoles(Set.of(RoleType.STUDENT));
        userRepository.save(user);

        user.setEmailVerified(true);
        userRepository.save(user);

        otp.setConsumed(true);
        otpRepository.save(otp);

        auditService.record(user, "SIGNUP_COMPLETE", "User", user.getId().toString(), Map.of("email", email));

        String token = jwtService.generateToken(user);
        return AuthResponse.from(user, token);
    }

    // ---- helpers ----

    private String generateCode() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    private String serializeSignup(SignupRequest r) {
        Map<String, Object> map = new java.util.LinkedHashMap<>();
        map.put("username", r.username());
        map.put("password", r.password());
        map.put("displayName", r.displayName());
        map.put("email", r.email());
        map.put("studentId", r.studentId());
        map.put("faculty", r.faculty());
        map.put("major", r.major());
        map.put("academicYear", r.academicYear());
        return "{" + map.entrySet().stream()
                .map(e -> "\"" + e.getKey() + "\":" + jsonVal(e.getValue()))
                .collect(Collectors.joining(",")) + "}";
    }

    private SignupRequest parseSignup(String json) {
        Map<String, String> map = parseFlatJson(json);
        Integer year = null;
        try { year = map.get("academicYear") == null ? null : Integer.parseInt(map.get("academicYear")); } catch (NumberFormatException ignore) {}
        return new SignupRequest(
                map.get("username"),
                map.get("password"),
                map.get("displayName"),
                map.get("email"),
                map.get("studentId"),
                map.get("faculty"),
                map.get("major"),
                year
        );
    }

    private static String jsonVal(Object v) {
        if (v == null) return "null";
        if (v instanceof Number || v instanceof Boolean) return v.toString();
        String s = v.toString().replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
        return "\"" + s + "\"";
    }

    /** Very small flat JSON parser (only handles flat string/number values emitted by serializeSignup). */
    private static Map<String, String> parseFlatJson(String json) {
        Map<String, String> out = new java.util.HashMap<>();
        if (json == null || json.isBlank()) return out;
        String body = json.trim();
        if (body.startsWith("{")) body = body.substring(1);
        if (body.endsWith("}")) body = body.substring(0, body.length() - 1);
        int i = 0;
        while (i < body.length()) {
            // key
            int kStart = body.indexOf('"', i);
            if (kStart < 0) break;
            int kEnd = body.indexOf('"', kStart + 1);
            if (kEnd < 0) break;
            String key = body.substring(kStart + 1, kEnd);
            int colon = body.indexOf(':', kEnd);
            if (colon < 0) break;
            int v = colon + 1;
            while (v < body.length() && Character.isWhitespace(body.charAt(v))) v++;
            String value;
            if (v < body.length() && body.charAt(v) == '"') {
                int vEnd = v + 1;
                StringBuilder sb = new StringBuilder();
                while (vEnd < body.length()) {
                    char c = body.charAt(vEnd);
                    if (c == '\\' && vEnd + 1 < body.length()) {
                        char n = body.charAt(vEnd + 1);
                        sb.append(n == 'n' ? '\n' : n);
                        vEnd += 2;
                    } else if (c == '"') {
                        break;
                    } else {
                        sb.append(c);
                        vEnd++;
                    }
                }
                value = sb.toString();
                i = vEnd + 1;
            } else {
                int vEnd = v;
                while (vEnd < body.length() && body.charAt(vEnd) != ',' && body.charAt(vEnd) != '}') vEnd++;
                String raw = body.substring(v, vEnd).trim();
                value = raw.equals("null") ? null : raw;
                i = vEnd;
            }
            out.put(key, value);
            int comma = body.indexOf(',', i);
            if (comma < 0) break;
            i = comma + 1;
        }
        return out;
    }
}
