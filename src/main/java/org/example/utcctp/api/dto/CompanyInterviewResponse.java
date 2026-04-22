package org.example.utcctp.api.dto;

import java.util.UUID;

public record CompanyInterviewResponse(
    UUID id,
    String studentName,
    String interviewDate,
    String scheduledTime,
    String interviewType,
    String location,
    String status,
    String result
) {}
