package org.example.utcctp.auth;

import org.example.utcctp.model.User;
import org.example.utcctp.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByUsername(request.username())
                .filter(User::isActive)
                .filter(found -> passwordEncoder.matches(request.password(), found.getPasswordHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        String token = jwtService.generateToken(user);
        return AuthResponse.from(user, token);
    }

    public UserProfile me(String username) {
        return userRepository.findByUsername(username)
                .map(UserProfile::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public UserProfile updateProfile(String username, UserProfileUpdateRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setDisplayName(request.displayName());
        user.setEmail(request.email());
        user.setMajor(request.major());
        user.setAcademicYear(request.academicYear());
        if (request.profilePictureUrl() != null) {
            user.setProfilePictureUrl(request.profilePictureUrl());
        }
        userRepository.save(user);
        return UserProfile.from(user);
    }

    public AuthResponse refreshToken(String username) {
        User user = userRepository.findByUsername(username)
                .filter(User::isActive)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid session"));
        String token = jwtService.generateToken(user);
        return AuthResponse.from(user, token);
    }

    public void logout() {
        // Stateless JWT — no server-side invalidation needed.
        // Client should discard the token.
    }
}
