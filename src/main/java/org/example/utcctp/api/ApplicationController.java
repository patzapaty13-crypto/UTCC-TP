package org.example.utcctp.api;

import org.example.utcctp.api.dto.ApplicationRequest;
import org.example.utcctp.api.dto.ApplicationResponse;
import org.example.utcctp.api.dto.DecisionRequest;
import org.example.utcctp.application.ApplicationService;
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
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationController {
    private final ApplicationService applicationService;
    private final CurrentUserService currentUserService;

    public ApplicationController(ApplicationService applicationService, CurrentUserService currentUserService) {
        this.applicationService = applicationService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<ApplicationResponse> listApplications() {
        return applicationService.list(currentUserService.requireUser());
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ApplicationResponse createApplication(@RequestBody ApplicationRequest request) {
        return applicationService.create(request, currentUserService.requireUser());
    }

    @PutMapping("/{id}/decision")
    @PreAuthorize("hasRole('ADVISOR') or hasRole('STAFF') or hasRole('ADMIN')")
    public ApplicationResponse decide(@PathVariable UUID id, @RequestBody DecisionRequest request) {
        return applicationService.decide(id, request, currentUserService.requireUser());
    }

    @PutMapping("/bulk-decision")
    @PreAuthorize("hasRole('ADVISOR') or hasRole('STAFF') or hasRole('ADMIN')")
    public List<ApplicationResponse> bulkDecide(@RequestBody java.util.Map<String, Object> payload) {
        List<String> idStrings = (List<String>) payload.get("ids");
        List<UUID> ids = idStrings.stream().map(UUID::fromString).toList();
        DecisionRequest request = new DecisionRequest(
                (String) payload.get("decision"),
                (String) payload.get("note")
        );
        return applicationService.bulkDecide(ids, request, currentUserService.requireUser());
    }

    @GetMapping("/{id}/download-letter")
    public org.springframework.http.ResponseEntity<byte[]> downloadLetter(@PathVariable UUID id) {
        byte[] pdf = applicationService.generateLetter(id, currentUserService.requireUser());
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "internship-letter-" + id + ".pdf");
        return new org.springframework.http.ResponseEntity<>(pdf, headers, org.springframework.http.HttpStatus.OK);
    }
}
