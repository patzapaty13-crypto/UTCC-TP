package org.example.utcctp.api.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ReportResponse(
        UUID id,
        String title,
        String content,
        String type,
        Integer weekNumber,
        String status,
        String company,
        String position,
        Integer score,
        String feedback,
        Instant submittedAt,
        Instant gradedAt,
        UUID fileId,
        String fileName,
        Long fileSize,
        Instant uploadedAt,
        List<String> attachments
) {
}
