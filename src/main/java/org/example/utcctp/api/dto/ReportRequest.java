package org.example.utcctp.api.dto;

import java.util.UUID;

public record ReportRequest(
        String title,
        String content,
        UUID tripId,
        UUID internshipPositionId,
        UUID fileId
) {
}
