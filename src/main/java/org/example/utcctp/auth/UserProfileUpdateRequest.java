package org.example.utcctp.auth;

public record UserProfileUpdateRequest(
        String displayName,
        String email,
        String major,
        Integer academicYear,
        String profilePictureUrl
) {
}
