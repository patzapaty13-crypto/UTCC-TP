package org.example.utcctp.api.dto;

import java.util.UUID;

public record CompanyResponse(
        UUID id,
        String name,
        String industry,
        String location,
        String status,
        String contactName,
        String contactEmail,
        String logoUrl
) {
}
