package org.example.utcctp.api.dto;

import java.util.List;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String username,
        String displayName,
        String email,
        String major,
        String studentId,
        String faculty,
        Integer academicYear,
        String profilePictureUrl,
        List<String> roles,
        boolean active
) {
}
