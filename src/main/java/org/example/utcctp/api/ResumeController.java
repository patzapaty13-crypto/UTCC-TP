package org.example.utcctp.api;

import org.example.utcctp.api.dto.ResumeResponse;
import org.example.utcctp.resume.ResumeService;
import org.example.utcctp.security.AuthUser;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resumes")
public class ResumeController {
    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('STUDENT')")
    public ResumeResponse getMyResume(@AuthenticationPrincipal AuthUser user) {
        return resumeService.getResumeByUserId(user.getId());
    }

    @PutMapping("/mine")
    @PreAuthorize("hasRole('STUDENT')")
    public ResumeResponse updateMyResume(@AuthenticationPrincipal AuthUser user, @RequestBody Map<String, String> data) {
        return resumeService.updateResume(user.getId(), data);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'ADVISOR')")
    public ResumeResponse getUserResume(@PathVariable UUID userId) {
        return resumeService.getResumeByUserId(userId);
    }
}
