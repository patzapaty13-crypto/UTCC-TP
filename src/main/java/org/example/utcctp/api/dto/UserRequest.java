package org.example.utcctp.api.dto;

import java.util.List;

public record UserRequest(
        String username,
        String password,
        String displayName,
        String email,
        String major,
        String studentId,
        String faculty,
        Integer academicYear,
        List<String> roles
) {
}
