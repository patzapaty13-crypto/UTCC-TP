package org.example.utcctp.api.dto;

import java.util.UUID;

public record ResumeResponse(
    UUID id,
    String displayName,
    String email,
    String summary,
    String skills,
    String education,
    String experience,
    String portfolioUrl
) {}
