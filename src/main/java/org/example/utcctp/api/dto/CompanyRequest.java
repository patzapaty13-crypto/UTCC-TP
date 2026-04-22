package org.example.utcctp.api.dto;

public record CompanyRequest(
        String name,
        String industry,
        String location,
        String contactName,
        String contactEmail,
        String logoUrl
) {
}
