package org.example.utcctp.api;

import org.example.utcctp.api.dto.InterviewRequest;
import org.example.utcctp.api.dto.InterviewResponse;
import org.example.utcctp.interview.InterviewService;
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
@RequestMapping("/api/v1/interviews")
public class InterviewController {
    private final InterviewService interviewService;
    private final CurrentUserService currentUserService;

    public InterviewController(InterviewService interviewService, CurrentUserService currentUserService) {
        this.interviewService = interviewService;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/application/{applicationId}")
    public List<InterviewResponse> listByApplication(@PathVariable UUID applicationId) {
        return interviewService.listByApplication(applicationId);
    }

    @PostMapping
    @PreAuthorize("hasRole('COMPANY') or hasRole('STAFF') or hasRole('ADMIN')")
    public InterviewResponse create(@RequestBody InterviewRequest request) {
        return interviewService.create(request, currentUserService.requireUser());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY') or hasRole('STAFF') or hasRole('ADMIN')")
    public InterviewResponse update(@PathVariable UUID id, @RequestBody InterviewRequest request) {
        return interviewService.update(id, request, currentUserService.requireUser());
    }
}
