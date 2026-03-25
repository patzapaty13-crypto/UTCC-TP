package org.example.utcctp.auth;

import org.example.utcctp.model.User;

import java.util.List;
import java.util.UUID;

public record UserProfile(
        UUID id,
        String username,
        String displayName,
        String email,
        String major,
        Integer academicYear,
        String profilePictureUrl,
        List<String> roles
) {
    public static UserProfile from(User user) {
        List<String> roles = user.getRoles().stream().map(Enum::name).toList();
        return new UserProfile(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                user.getEmail(),
                user.getMajor(),
                user.getAcademicYear(),
                user.getProfilePictureUrl(),
                roles
        );
    }
}
