package org.example.utcctp.api.dto;

import java.time.LocalDate;
import java.util.UUID;

public record TripResponse(
        UUID id,
        String title,
        String objective,
        String location,
        String status,
        LocalDate startDate,
        LocalDate endDate,
        Integer capacity,
        Integer budgetTotal,
        String mapUrl
) {
}
