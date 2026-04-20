package org.example.utcctp.api.dto;

import java.util.UUID;

public record InterviewRequest(
        UUID applicationId,
        String interviewType,
        String meetingUrl,
        String location,
        String startsAt,
        String endsAt,
        String status,
        String note
) {
}
