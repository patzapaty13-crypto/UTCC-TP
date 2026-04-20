package org.example.utcctp.api.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record InternshipResponse(
        UUID id,
        String company,
        String title,
        String description,
        String requirements,
        String location,
        String mode,
        int slots,
        String status,
        // Phase 1 Enhancement Fields
        BigDecimal salaryMin,
        BigDecimal salaryMax,
        LocalDate startDate,
        LocalDate endDate,
        LocalDate applicationDeadline,
        String benefits,
        String internshipType,
        String contactEmail,
        String contactPhone,
        String contactLine,
        Instant createdAt
) {
}
