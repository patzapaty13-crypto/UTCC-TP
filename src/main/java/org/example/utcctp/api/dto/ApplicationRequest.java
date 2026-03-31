package org.example.utcctp.api.dto;

import java.util.UUID;

public record ApplicationRequest(
        String type,
        UUID tripId,
        UUID internshipPositionId,
        String reason,
        String studentId,
        String firstName,
        String lastName,
        String faculty,
        String major
) {
}
