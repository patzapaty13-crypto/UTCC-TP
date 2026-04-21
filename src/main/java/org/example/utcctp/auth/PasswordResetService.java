package org.example.utcctp.auth;

import org.example.utcctp.audit.AuditService;
import org.example.utcctp.model.OtpCode;
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

@Service
@Transactional
public class PasswordResetService {
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 15;
    private static final String PURPOSE = "PASSWORD_RESET";

    private final SecureRandom random = new SecureRandom();
    private final UserRepository userRepository;
    private final OtpCodeRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final AuditService auditService;
    private final WebhookService webhookService;

    public PasswordResetService(
            UserRepository userRepository,
            OtpCodeRepository otpRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            AuditService auditService,
            WebhookService webhookService
    ) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.auditService = auditService;
        this.webhookService = webhookService;
    }

    public void requestReset(ForgotPasswordRequest request) {
        String email = request.email().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ไม่พบผู้ใช้ที่ใช้อีเมลนี้"));

        String code = generateCode();
        OtpCode otp = new OtpCode();
        otp.setEmail(email);
        otp.setPurpose(PURPOSE);
        otp.setCodeHash(passwordEncoder.encode(code));
        otp.setExpiresAt(Instant.now().plus(OTP_EXPIRY_MINUTES, ChronoUnit.MINUTES));
        otpRepository.save(otp);

        emailService.sendAsync(email,
                "[UTCC-TP] คำขอกู้คืนรหัสผ่าน",
                EmailTemplates.passwordReset(code, OTP_EXPIRY_MINUTES));

        webhookService.sendOtp(email, code);

        auditService.record(user, "PASSWORD_RESET_REQUEST", "User", user.getId().toString(), Map.of("email", email));
    }

    public void confirmReset(PasswordResetConfirmRequest request) {
        String email = request.email().toLowerCase().trim();
        OtpCode otp = otpRepository.findFirstByEmailAndPurposeAndConsumedFalseOrderByCreatedAtDesc(email, PURPOSE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ไม่พบรหัสยืนยันหรือรหัสหมดอายุแล้ว"));

        if (otp.getExpiresAt().isBefore(Instant.now())) {
            otp.setConsumed(true);
            otpRepository.save(otp);
            throw new ResponseStatusException(HttpStatus.GONE, "รหัสยืนยันหมดอายุแล้ว");
        }

        if (!passwordEncoder.matches(request.code(), otp.getCodeHash())) {
            otp.setAttempts(otp.getAttempts() + 1);
            if (otp.getAttempts() >= 5) otp.setConsumed(true);
            otpRepository.save(otp);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "รหัสยืนยันไม่ถูกต้อง");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ไม่พบผู้ใช้"));

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        otp.setConsumed(true);
        otpRepository.save(otp);

        auditService.record(user, "PASSWORD_RESET_COMPLETE", "User", user.getId().toString(), Map.of("email", email));
    }

    private String generateCode() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}
