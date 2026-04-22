package org.example.utcctp.api;

import jakarta.validation.Valid;
import org.example.utcctp.api.dto.OfferRequest;
import org.example.utcctp.api.dto.OfferResponse;
import org.example.utcctp.offer.OfferService;
import org.example.utcctp.user.CurrentUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/offers")
public class OfferController {
    private final OfferService offerService;
    private final CurrentUserService currentUserService;

    public OfferController(OfferService offerService, CurrentUserService currentUserService) {
        this.offerService = offerService;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/application/{applicationId}")
    public List<OfferResponse> listByApplication(@PathVariable UUID applicationId) {
        return offerService.listByApplication(applicationId);
    }

    @PostMapping
    @PreAuthorize("hasRole('COMPANY') or hasRole('STAFF') or hasRole('ADMIN')")
    public OfferResponse create(@Valid @RequestBody OfferRequest request) {
        return offerService.create(request, currentUserService.requireUser());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY') or hasRole('STAFF') or hasRole('ADMIN')")
    public OfferResponse update(@PathVariable UUID id, @Valid @RequestBody OfferRequest request) {
        return offerService.update(id, request, currentUserService.requireUser());
    }

    @PostMapping("/{id}/respond")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public OfferResponse respond(@PathVariable UUID id, @RequestBody Map<String, String> payload) {
        return offerService.respond(id, payload.getOrDefault("status", "ACCEPTED"), currentUserService.requireUser());
    }
}
