package org.example.utcctp.api;

import jakarta.validation.Valid;
import org.example.utcctp.api.dto.InternshipRequest;
import org.example.utcctp.api.dto.InternshipResponse;
import org.example.utcctp.internship.InternshipService;
import org.example.utcctp.user.CurrentUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("/api/v1/internships")
public class InternshipController {
    private final InternshipService internshipService;
    private final CurrentUserService currentUserService;

    public InternshipController(InternshipService internshipService, CurrentUserService currentUserService) {
        this.internshipService = internshipService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<InternshipResponse> listInternships() {
        return internshipService.listPositions();
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('COMPANY')")
    public List<InternshipResponse> listMyInternships() {
        return internshipService.listPositionsByCompany(currentUserService.requireUser().getCompanyId());
    }

    @GetMapping("/{id}")
    public InternshipResponse getInternship(@PathVariable UUID id) {
        return internshipService.getPosition(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN') or hasRole('COMPANY')")
    public InternshipResponse createInternship(@Valid @RequestBody InternshipRequest request) {
        return internshipService.createPosition(request, currentUserService.requireUser());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN') or hasRole('COMPANY')")
    public InternshipResponse updateInternship(@PathVariable UUID id, @Valid @RequestBody InternshipRequest request) {
        return internshipService.updatePosition(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN') or hasRole('COMPANY')")
    public void deleteInternship(@PathVariable UUID id) {
        internshipService.deletePosition(id);
    }
}
