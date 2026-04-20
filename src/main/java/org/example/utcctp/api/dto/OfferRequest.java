package org.example.utcctp.api.dto;

import java.util.UUID;

public record OfferRequest(
        UUID applicationId,
        String title,
        Double allowanceAmount,
        String allowanceCurrency,
        String startsOn,
        String endsOn,
        String termsText,
        String responseDeadline,
        String status
) {
}
