package org.example.utcctp.api.dto;

import java.math.BigDecimal;
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
        String major,
        // Phase 1 Enhancement Fields
        String phone,
        String email,
        String address,
        BigDecimal gpa,
        Integer year,
        String coverLetter,
        String portfolioUrl
) {
}
