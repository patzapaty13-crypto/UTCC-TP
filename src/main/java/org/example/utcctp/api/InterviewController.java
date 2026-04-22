package org.example.utcctp.api;

import org.example.utcctp.auth.JwtPrincipal;
import org.example.utcctp.auth.JwtService;
import org.example.utcctp.interview.InterviewService;
import org.example.utcctp.model.Application;
import org.example.utcctp.model.InternshipPosition;
import org.example.utcctp.model.Interview;
import org.example.utcctp.model.Notification;
import org.example.utcctp.model.User;
import org.example.utcctp.notification.NotificationService;
import org.example.utcctp.repository.ApplicationRepository;
import org.example.utcctp.repository.InternshipPositionRepository;
import org.example.utcctp.repository.InterviewRepository;
import org.example.utcctp.repository.UserRepository;
import org.example.utcctp.api.dto.AdvisorInterviewResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
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
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;

    public InterviewController(
            InterviewService interviewService,
            JwtService jwtService,
            NotificationService notificationService,
            UserRepository userRepository,
            InternshipPositionRepository internshipPositionRepository,
            ApplicationRepository applicationRepository,
            InterviewRepository interviewRepository
    ) {
        this.interviewService = interviewService;
        this.jwtService = jwtService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.internshipPositionRepository = internshipPositionRepository;
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
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

    @GetMapping("/company")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<List<org.example.utcctp.api.dto.CompanyInterviewResponse>> getCompanyInterviews(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7);
        JwtPrincipal principal = jwtService.parseToken(jwt);
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        // Look up the user's companyId — userId ≠ companyId
        User user = userRepository.findById(principal.userId()).orElse(null);
        if (user == null || user.getCompanyId() == null) {
            return ResponseEntity.ok(List.of());
        }
        List<Interview> interviews = interviewService.getCompanyInterviews(user.getCompanyId());
        
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        
        List<org.example.utcctp.api.dto.CompanyInterviewResponse> responses = interviews.stream().map(interview -> {
            User student = userRepository.findById(interview.getStudentId()).orElse(null);
            String studentName = student != null ? student.getDisplayName() : "นักศึกษา";
            
            String dateStr = "";
            String timeStr = "";
            if (interview.getInterviewDate() != null) {
                LocalDateTime localDateTime = LocalDateTime.ofInstant(interview.getInterviewDate(), ZoneId.systemDefault());
                dateStr = localDateTime.format(dateFormatter);
                timeStr = localDateTime.format(timeFormatter);
            }
            
            String typeLabel = interview.getInterviewType();
            if ("IN_PERSON".equals(typeLabel)) typeLabel = "สัมภาษณ์ที่บริษัท";
            else if ("VIDEO".equals(typeLabel)) typeLabel = "ออนไลน์";
            else if ("PHONE".equals(typeLabel)) typeLabel = "โทรศัพท์";
            
            String loc = interview.getLocation();
            if ("VIDEO".equals(interview.getInterviewType()) && interview.getVideoLink() != null) {
                loc = interview.getVideoLink();
            }
            
            return new org.example.utcctp.api.dto.CompanyInterviewResponse(
                interview.getId(),
                studentName,
                dateStr,
                timeStr,
                typeLabel,
                loc,
                interview.getStatus(),
                interview.getResult()
            );
        }).toList();
        
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/advisor")
    public List<AdvisorInterviewResponse> listAdvisorInterviews(@RequestHeader("Authorization") String token) {
        // Get current user
        String jwt = token.substring(7);
        JwtPrincipal principal = jwtService.parseToken(jwt);
        if (principal == null) {
            return List.of();
        }

        // Get advisor's students
        List<User> students = userRepository.findByAdvisorId(principal.userId());
        List<UUID> studentIds = students.stream().map(User::getId).toList();

        // Get interviews for these students
        List<Interview> interviews = interviewRepository.findByStudentIdIn(studentIds);

        // Map to DTO with student name and position title
        return interviews.stream().map(interview -> {
            User student = userRepository.findById(interview.getStudentId()).orElse(null);
            InternshipPosition position = null;
            if (interview.getPositionId() != null) {
                position = internshipPositionRepository.findById(interview.getPositionId()).orElse(null);
            }

            return new AdvisorInterviewResponse(
                interview.getId(),
                interview.getStudentId(),
                student != null ? student.getDisplayName() : null,
                interview.getPositionId(),
                position != null ? position.getTitle() : null,
                interview.getInterviewDate(),
                interview.getInterviewType(),
                interview.getLocation(),
                interview.getInstructions(),
                interview.getStudentConfirmed(),
                interview.getCompanyConfirmed(),
                interview.getStatus(),
                interview.getRescheduleReason(),
                interview.getVideoLink(),
                interview.getInterviewerName(),
                interview.getInterviewDuration()
            );
        }).toList();
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
    public ResponseEntity<Interview> createInterview(@RequestBody Map<String, Object> body) {
        Interview interview = new Interview();
        
        // Handle applicationId - fetch studentId, positionId, and companyId from application
        if (body.containsKey("applicationId")) {
            UUID applicationId = UUID.fromString(body.get("applicationId").toString());
            interview.setApplicationId(applicationId);

            Application application = applicationRepository.findById(applicationId).orElse(null);
            if (application != null) {
                interview.setStudentId(application.getStudent().getId());
                // Only set positionId and companyId if the application has an internshipPosition
                if (application.getInternshipPosition() != null) {
                    interview.setPositionId(application.getInternshipPosition().getId());
                    if (application.getInternshipPosition().getCompany() != null) {
                        interview.setCompanyId(application.getInternshipPosition().getCompany().getId());
                    }
                }
                // If it's a trip application, we might need to handle it differently
                // For now, we'll skip setting positionId for trip applications
            }
        }
        
        // Handle other fields
        if (body.containsKey("scheduledAt")) {
            interview.setInterviewDate(Instant.parse(body.get("scheduledAt").toString()));
        }
        if (body.containsKey("type")) {
            interview.setInterviewType(body.get("type").toString());
        }
        if (body.containsKey("location")) {
            String location = body.get("location").toString();
            interview.setLocation(location);
            // If type is VIDEO, treat location as video link
            if ("VIDEO".equals(interview.getInterviewType())) {
                interview.setVideoLink(location);
            }
        }
        if (body.containsKey("notes")) {
            interview.setInstructions(body.get("notes").toString());
        }
        if (body.containsKey("duration")) {
            interview.setInterviewDuration(Integer.parseInt(body.get("duration").toString()));
        }
        
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

        // Notify advisor when student confirms interview
        if (isStudent) {
            User student = userRepository.findById(confirmed.getStudentId()).orElse(null);
            if (student != null && student.getAdvisorId() != null) {
                User advisor = userRepository.findById(student.getAdvisorId()).orElse(null);
                if (advisor != null) {
                    InternshipPosition position = null;
                    if (confirmed.getPositionId() != null) {
                        position = internshipPositionRepository.findById(confirmed.getPositionId()).orElse(null);
                    }

                    String positionTitle = position != null ? position.getTitle() : "ตำแหน่งฝึกงาน";
                    notificationService.createNotification(
                            advisor,
                            Notification.NotificationType.INTERVIEW_CONFIRMED,
                            "นักศึกษายืนยันนัดสัมภาษณ์",
                            student.getDisplayName() + " ยืนยันนัดสัมภาษณ์สำหรับตำแหน่ง " + positionTitle,
                            "/advisor/interviews?applicationId=" + confirmed.getApplicationId()
                    );
                }
            }

            // Notify company when student confirms interview
            if (confirmed.getPositionId() != null) {
                InternshipPosition position = internshipPositionRepository.findById(confirmed.getPositionId()).orElse(null);
                if (position != null && position.getCompany() != null) {
                    User companyUser = userRepository.findByCompanyId(position.getCompany().getId())
                            .stream()
                            .filter(u -> u.getRoles().stream().anyMatch(r -> r.name().equals("COMPANY")))
                            .findFirst()
                            .orElse(null);
                    if (companyUser != null) {
                        notificationService.createNotification(
                                companyUser,
                                Notification.NotificationType.INTERVIEW_CONFIRMED,
                                "นักศึกษายืนยันนัดสัมภาษณ์",
                                student.getDisplayName() + " ยืนยันนัดสัมภาษณ์สำหรับตำแหน่ง " + position.getTitle(),
                                "/company/interviews?applicationId=" + confirmed.getApplicationId()
                        );
                    }
                }
            }
        }

        return ResponseEntity.ok(confirmed);
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<Interview> rescheduleInterview(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body
    ) {
        String reason = body.get("reason");
        Interview rescheduled = interviewService.rescheduleInterview(id, reason);

        // Notify advisor when student reschedules interview
        User student = userRepository.findById(rescheduled.getStudentId()).orElse(null);
        if (student != null && student.getAdvisorId() != null) {
            User advisor = userRepository.findById(student.getAdvisorId()).orElse(null);
            if (advisor != null) {
                InternshipPosition position = null;
                if (rescheduled.getPositionId() != null) {
                    position = internshipPositionRepository.findById(rescheduled.getPositionId()).orElse(null);
                }

                String positionTitle = position != null ? position.getTitle() : "ตำแหน่งฝึกงาน";
                notificationService.createNotification(
                        advisor,
                        Notification.NotificationType.INTERVIEW_RESCHEDULED,
                        "นักศึกษาขอเลื่อนนัดสัมภาษณ์",
                        student.getDisplayName() + " ขอเลื่อนนัดสัมภาษณ์สำหรับ " + positionTitle + (reason != null ? " เหตุผล: " + reason : ""),
                        "/advisor/interviews"
                );
            }
        }

        // Notify company when student reschedules interview
        if (rescheduled.getPositionId() != null) {
            InternshipPosition position = internshipPositionRepository.findById(rescheduled.getPositionId()).orElse(null);
            if (position != null && position.getCompany() != null) {
                try {
                    User companyUser = userRepository.findByCompanyId(position.getCompany().getId())
                            .stream()
                            .filter(u -> u.getRoles().stream().anyMatch(r -> r.name().equals("COMPANY")))
                            .findFirst()
                            .orElse(null);
                    if (companyUser != null) {
                        String positionTitle = position.getTitle();
                        notificationService.createNotification(
                                companyUser,
                                Notification.NotificationType.INTERVIEW_RESCHEDULED,
                                "นักศึกษาขอเลื่อนนัดสัมภาษณ์",
                                student.getDisplayName() + " ขอเลื่อนนัดสัมภาษณ์สำหรับ " + positionTitle + (reason != null ? " เหตุผล: " + reason : ""),
                                "/company/interviews"
                        );
                    }
                } catch (Exception e) {
                    System.err.println("Failed to notify company: " + e.getMessage());
                }
            }
        }

        return ResponseEntity.ok(rescheduled);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterview(@PathVariable UUID id) {
        interviewService.deleteInterview(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/result")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<Interview> setInterviewResult(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body
    ) {
        String result = body.get("result"); // PASSED or FAILED
        Interview updated = interviewService.setInterviewResult(id, result);
        return ResponseEntity.ok(updated);
    }
}
