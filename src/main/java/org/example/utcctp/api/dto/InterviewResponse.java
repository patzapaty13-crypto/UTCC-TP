package org.example.utcctp.api.dto;

import java.time.Instant;
import java.util.UUID;

public record InterviewResponse(
        UUID id,
        UUID applicationId,
        String interviewType,
        String meetingUrl,
        String location,
        Instant startsAt,
        Instant endsAt,
        String status,
        String note,
        Instant createdAt
) {
}
