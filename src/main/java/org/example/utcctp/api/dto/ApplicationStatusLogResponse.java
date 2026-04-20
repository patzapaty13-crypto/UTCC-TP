package org.example.utcctp.api.dto;

import java.time.Instant;
import java.util.UUID;

public record ApplicationStatusLogResponse(
        UUID id,
        UUID applicationId,
        String oldStatus,
        String newStatus,
        String changedBy,
        String note,
        Instant createdAt
) {
}
