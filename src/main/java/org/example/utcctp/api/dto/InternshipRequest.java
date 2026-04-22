package org.example.utcctp.api.dto;

import java.util.UUID;

public record InternshipRequest(
        UUID companyId,
        String title,
        String description,
        String requirements,
        String location,
        String mode,
        int slots,
        String status,
        String internshipType,
        String salaryMin,
        String salaryMax,
        String benefits,
        String applicationDeadline,
        String startDate,
        String endDate,
        String contactEmail,
        String contactPhone,
        String contactLine
) {
}
