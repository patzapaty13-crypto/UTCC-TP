package org.example.utcctp.api.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ApplicationResponse(
        UUID id,
        UUID studentId,
        String studentName,
        String studentMajor,
        String type,
        String status,
        String tripTitle,
        String internshipTitle,
        UUID positionId,
        UUID companyId,
        Instant createdAt,
        Instant updatedAt,
        // Application form fields
        String phone,
        String email,
        String address,
        BigDecimal gpa,
        Integer year,
        String coverLetter,
        String portfolioUrl,
        String resume
) {
}
