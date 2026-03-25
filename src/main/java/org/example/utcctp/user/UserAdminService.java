package org.example.utcctp.user;

import org.example.utcctp.api.dto.UserRequest;
import org.example.utcctp.api.dto.UserResponse;
import org.example.utcctp.model.RoleType;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserAdminService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserAdminService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> listUsers() {
        return userRepository.findAll().stream().map(this::mapUser).toList();
    }

    public UserResponse createUser(UserRequest request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
        User user = new User();
        apply(user, request);
        if (request.password() != null && !request.password().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
        } else {
            user.setPasswordHash(passwordEncoder.encode("pass123"));
        }
        userRepository.save(user);
        return mapUser(user);
    }

    public UserResponse updateUser(UUID id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        apply(user, request);
        if (request.password() != null && !request.password().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
        }
        userRepository.save(user);
        return mapUser(user);
    }

    private void apply(User user, UserRequest request) {
        if (request.username() != null) {
            user.setUsername(request.username());
        }
        if (request.displayName() != null) {
            user.setDisplayName(request.displayName());
        }
        if (request.email() != null) {
            user.setEmail(request.email());
        }
        if (request.major() != null) {
            user.setMajor(request.major());
        }
        if (request.academicYear() != null) {
            user.setAcademicYear(request.academicYear());
        }
        if (request.roles() != null && !request.roles().isEmpty()) {
            Set<RoleType> roles = request.roles().stream()
                    .map(RoleType::valueOf)
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }
    }

    private UserResponse mapUser(User user) {
        List<String> roles = user.getRoles().stream().map(Enum::name).toList();
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                user.getEmail(),
                user.getMajor(),
                user.getAcademicYear(),
                user.getProfilePictureUrl(),
                roles,
                user.isActive()
        );
    }
}
