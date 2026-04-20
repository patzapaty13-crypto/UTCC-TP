package org.example.utcctp.api.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record OfferResponse(
        UUID id,
        UUID applicationId,
        String title,
        Double allowanceAmount,
        String allowanceCurrency,
        LocalDate startsOn,
        LocalDate endsOn,
        String termsText,
        Instant responseDeadline,
        String status,
        Instant respondedAt,
        Instant createdAt
) {
}
