package org.example.utcctp.api.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ApplicationDetailResponse(
        UUID id,
        UUID studentId,
        String studentName,
        String studentMajor,
        String type,
        String status,
        String tripTitle,
        String internshipTitle,
        String reason,
        String applicantStudentId,
        String applicantFaculty,
        String applicantMajor,
        Instant createdAt,
        List<ApplicationStatusLogResponse> statusHistory
) {
}
