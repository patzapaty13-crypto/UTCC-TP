package org.example.utcctp.api.dto;

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
        Instant createdAt
) {
}
