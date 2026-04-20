package org.example.utcctp.auth;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/signup")
public class SignupController {
    private final SignupService signupService;

    public SignupController(SignupService signupService) {
        this.signupService = signupService;
    }

    @PostMapping("/request-otp")
    public Map<String, Object> requestOtp(@Valid @RequestBody SignupRequest request) {
        return signupService.requestOtp(request);
    }

    @PostMapping("/verify")
    public AuthResponse verify(@Valid @RequestBody OtpVerifyRequest request) {
        return signupService.verifyOtp(request);
    }
}
