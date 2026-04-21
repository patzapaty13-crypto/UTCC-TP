package org.example.utcctp.auth;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthService authService, PasswordResetService passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {
        return authService.login(request);
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordResetService.requestReset(request);
        return Map.of("status", "sent", "message", "OTP sent to " + request.email());
    }

    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@Valid @RequestBody PasswordResetConfirmRequest request) {
        passwordResetService.confirmReset(request);
        return Map.of("status", "success", "message", "Password has been reset successfully");
    }

    @GetMapping("/me")
    public UserProfile me(Principal principal) {
        return authService.me(principal.getName());
    }

    @PutMapping("/me")
    public UserProfile updateProfile(Principal principal, @RequestBody UserProfileUpdateRequest request) {
        return authService.updateProfile(principal.getName(), request);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(Principal principal) {
        return authService.refreshToken(principal.getName());
    }

    @PostMapping("/logout")
    public Map<String, String> logout() {
        authService.logout();
        return Map.of("status", "logged_out");
    }

    @PostMapping("/change-password")
    public Map<String, String> changePassword(Principal principal, @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(principal.getName(), request);
        return Map.of("status", "success", "message", "Password changed successfully");
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }
}
