package org.example.utcctp.api;

import org.example.utcctp.auth.JwtPrincipal;
import org.example.utcctp.auth.JwtService;
import org.example.utcctp.interview.InterviewService;
import org.example.utcctp.model.Interview;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/interviews")
public class InterviewController {
    private final InterviewService interviewService;
    private final JwtService jwtService;

    public InterviewController(InterviewService interviewService, JwtService jwtService) {
        this.interviewService = interviewService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<List<Interview>> getMyInterviews(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7);
        JwtPrincipal principal = jwtService.parseToken(jwt);
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Interview> interviews = interviewService.getStudentInterviews(principal.userId());
        return ResponseEntity.ok(interviews);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Interview> getInterview(@PathVariable UUID id) {
        Interview interview = interviewService.getInterview(id);
        if (interview == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(interview);
    }

    @PostMapping
    public ResponseEntity<Interview> createInterview(@RequestBody Interview interview) {
        Interview created = interviewService.createInterview(interview);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Interview> updateInterview(
            @PathVariable UUID id,
            @RequestBody Interview updates
    ) {
        Interview updated = interviewService.updateInterview(id, updates);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<Interview> confirmInterview(
            @PathVariable UUID id,
            @RequestHeader("Authorization") String token
    ) {
        String jwt = token.substring(7);
        JwtPrincipal principal = jwtService.parseToken(jwt);
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        boolean isStudent = principal.roles().contains("STUDENT");
        
        Interview confirmed = interviewService.confirmInterview(id, isStudent);
        return ResponseEntity.ok(confirmed);
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<Interview> rescheduleInterview(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body
    ) {
        String reason = body.get("reason");
        Interview rescheduled = interviewService.rescheduleInterview(id, reason);
        return ResponseEntity.ok(rescheduled);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterview(@PathVariable UUID id) {
        interviewService.deleteInterview(id);
        return ResponseEntity.noContent().build();
    }
}
