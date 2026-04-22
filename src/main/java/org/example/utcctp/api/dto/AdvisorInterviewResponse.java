package org.example.utcctp.api.dto;

import java.time.Instant;
import java.util.UUID;

public record AdvisorInterviewResponse(
    UUID id,
    UUID studentId,
    String studentName,
    UUID positionId,
    String positionTitle,
    Instant interviewDate,
    String interviewType,
    String location,
    String instructions,
    Boolean studentConfirmed,
    Boolean companyConfirmed,
    String status,
    String rescheduleReason,
    String videoLink,
    String interviewerName,
    Integer interviewDuration
) {}
