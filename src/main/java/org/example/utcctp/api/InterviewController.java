package org.example.utcctp.api;

import org.example.utcctp.auth.JwtPrincipal;
import org.example.utcctp.auth.JwtService;
import org.example.utcctp.interview.InterviewService;
import org.example.utcctp.model.InternshipPosition;
import org.example.utcctp.model.Interview;
import org.example.utcctp.model.Notification;
import org.example.utcctp.model.User;
import org.example.utcctp.notification.NotificationService;
import org.example.utcctp.repository.InternshipPositionRepository;
import org.example.utcctp.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/interviews")
public class InterviewController {
    private final InterviewService interviewService;
    private final JwtService jwtService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final InternshipPositionRepository internshipPositionRepository;

    public InterviewController(
            InterviewService interviewService,
            JwtService jwtService,
            NotificationService notificationService,
            UserRepository userRepository,
            InternshipPositionRepository internshipPositionRepository
    ) {
        this.interviewService = interviewService;
        this.jwtService = jwtService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.internshipPositionRepository = internshipPositionRepository;
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
        
        // Create notification for student
        if (interview.getStudentId() != null) {
            User student = userRepository.findById(interview.getStudentId()).orElse(null);
            if (student != null) {
                InternshipPosition position = null;
                if (interview.getPositionId() != null) {
                    position = internshipPositionRepository.findById(interview.getPositionId()).orElse(null);
                }
                
                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
                DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
                
                StringBuilder message = new StringBuilder();
                message.append("คุณได้รับการนัดสัมภาษณ์\n\n");
                
                if (position != null) {
                    message.append("ตำแหน่ง: ").append(position.getTitle()).append("\n");
                }
                
                if (interview.getInterviewDate() != null) {
                    LocalDateTime localDateTime = LocalDateTime.ofInstant(interview.getInterviewDate(), ZoneId.systemDefault());
                    message.append("วันที่: ").append(localDateTime.format(dateFormatter)).append("\n");
                    message.append("เวลา: ").append(localDateTime.format(timeFormatter)).append("\n");
                    if (interview.getInterviewDuration() != null) {
                        message.append("ระยะเวลา: ").append(interview.getInterviewDuration()).append(" นาที\n");
                    }
                }
                
                if (interview.getInterviewType() != null) {
                    String typeLabel = switch (interview.getInterviewType()) {
                        case "IN_PERSON" -> "สัมภาษณ์ที่บริษัท";
                        case "VIDEO" -> "สัมภาษณ์ออนไลน์";
                        case "PHONE" -> "สัมภาษณ์ทางโทรศัพท์";
                        default -> interview.getInterviewType();
                    };
                    message.append("รูปแบบ: ").append(typeLabel).append("\n");
                }
                
                if ("IN_PERSON".equals(interview.getInterviewType()) && interview.getLocation() != null) {
                    message.append("สถานที่: ").append(interview.getLocation()).append("\n");
                }
                
                if ("VIDEO".equals(interview.getInterviewType()) && interview.getVideoLink() != null) {
                    message.append("ลิงก์: ").append(interview.getVideoLink()).append("\n");
                }
                
                if (interview.getInterviewerName() != null) {
                    message.append("ผู้สัมภาษณ์: ").append(interview.getInterviewerName()).append("\n");
                }
                
                if (interview.getInstructions() != null && !interview.getInstructions().isBlank()) {
                    message.append("\nคำแนะนำ:\n").append(interview.getInstructions()).append("\n");
                }
                
                if (interview.getPreparationNotes() != null && !interview.getPreparationNotes().isBlank()) {
                    message.append("\nการเตรียมตัว:\n").append(interview.getPreparationNotes()).append("\n");
                }
                
                notificationService.createNotification(
                        student,
                        Notification.NotificationType.INTERVIEW_SCHEDULED,
                        "นัดสัมภาษณ์ใหม่",
                        message.toString(),
                        "/student/interviews"
                );
            }
        }
        
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
