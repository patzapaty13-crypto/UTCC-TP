package org.example.utcctp.api.dto;

import java.util.UUID;

public record FileResponse(
        UUID id,
        String originalName,
        String contentType,
        long sizeBytes,
        String url
) {
    public FileResponse(UUID id, String originalName, String contentType, long sizeBytes, String url) {
        this.id = id;
        this.originalName = originalName;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
        this.url = url != null ? url : "/api/v1/files/" + id;
    }
}
