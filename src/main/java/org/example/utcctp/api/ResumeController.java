package org.example.utcctp.api;

import org.example.utcctp.api.dto.ResumeResponse;
import org.example.utcctp.resume.ResumeService;
import org.example.utcctp.user.CurrentUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resumes")
public class ResumeController {
    private final ResumeService resumeService;
    private final CurrentUserService currentUserService;

    public ResumeController(ResumeService resumeService, CurrentUserService currentUserService) {
        this.resumeService = resumeService;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('STUDENT')")
    public ResumeResponse getMyResume() {
        return resumeService.getResumeByUserId(currentUserService.requireUser().getId());
    }

    @PutMapping("/mine")
    @PreAuthorize("hasRole('STUDENT')")
    public ResumeResponse updateMyResume(@RequestBody Map<String, String> data) {
        return resumeService.updateResume(currentUserService.requireUser().getId(), data);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'ADVISOR')")
    public ResumeResponse getUserResume(@PathVariable UUID userId) {
        return resumeService.getResumeByUserId(userId);
    }
}
