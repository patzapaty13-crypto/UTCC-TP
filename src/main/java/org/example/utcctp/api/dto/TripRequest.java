package org.example.utcctp.api.dto;

import java.time.LocalDate;

public record TripRequest(
        String title,
        String objective,
        String location,
        LocalDate startDate,
        LocalDate endDate,
        Integer capacity,
        Integer budgetTotal,
        String mapUrl
) {
}
