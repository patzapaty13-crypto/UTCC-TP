package org.example.utcctp.api.dto;

import java.time.Instant;
import java.util.UUID;

public record PostResponse(
    UUID id,
    String authorName,
    String authorAvatar,
    String authorMajor,
    String content,
    String imageUrl,
    Instant createdAt
) {}
