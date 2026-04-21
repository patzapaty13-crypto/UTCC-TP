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
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    public AuthService(UserRepository userRepository, JwtService jwtService, PasswordEncoder passwordEncoder, com.fasterxml.jackson.databind.ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
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
        
        if (request.displayName() != null) user.setDisplayName(request.displayName());
        if (request.email() != null) user.setEmail(request.email());
        if (request.major() != null) user.setMajor(request.major());
        if (request.academicYear() != null) user.setAcademicYear(request.academicYear());
        if (request.profilePictureUrl() != null) {
            user.setProfilePictureUrl(request.profilePictureUrl());
        }
        
        try {
            if (request.skills() != null) {
                user.setSkills(objectMapper.writeValueAsString(request.skills()));
            }
            if (request.experiences() != null) {
                user.setExperiences(objectMapper.writeValueAsString(request.experiences()));
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid format for skills or experiences");
        }
        
        if (request.linkedin() != null) user.setLinkedin(request.linkedin());
        if (request.github() != null) user.setGithub(request.github());
        if (request.portfolio() != null) user.setPortfolio(request.portfolio());
        if (request.website() != null) user.setWebsite(request.website());

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

    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!passwordEncoder.matches(request.oldPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "รหัสผ่านเดิมไม่ถูกต้อง");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
}
