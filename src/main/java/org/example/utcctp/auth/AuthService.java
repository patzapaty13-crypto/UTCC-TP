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
        
        System.out.println("Updating profile for user: " + username);
        System.out.println("Request: " + request);
        
        if (request.displayName() != null) {
            user.setDisplayName(request.displayName());
            System.out.println("Set displayName to: " + request.displayName());
        }
        if (request.email() != null) {
            user.setEmail(request.email());
            System.out.println("Set email to: " + request.email());
        }
        if (request.major() != null) {
            user.setMajor(request.major());
            System.out.println("Set major to: " + request.major());
        }
        if (request.faculty() != null) {
            user.setFaculty(request.faculty());
            System.out.println("Set faculty to: " + request.faculty());
        }
        if (request.studentId() != null) {
            user.setStudentId(request.studentId());
            System.out.println("Set studentId to: " + request.studentId());
        }
        if (request.academicYear() != null) {
            user.setAcademicYear(request.academicYear());
            System.out.println("Set academicYear to: " + request.academicYear());
        }
        if (request.profilePictureUrl() != null) {
            user.setProfilePictureUrl(request.profilePictureUrl());
            System.out.println("Set profilePictureUrl to: " + request.profilePictureUrl());
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

        User saved = userRepository.save(user);
        System.out.println("Saved user with id: " + saved.getId());
        System.out.println("Saved displayName: " + saved.getDisplayName());
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
