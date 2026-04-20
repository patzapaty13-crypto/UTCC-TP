package org.example.utcctp.application;

import org.example.utcctp.api.dto.ApplicationRequest;
import org.example.utcctp.api.dto.ApplicationResponse;
import org.example.utcctp.api.dto.DecisionRequest;
import org.example.utcctp.model.Application;
import org.example.utcctp.model.ApplicationStatus;
import org.example.utcctp.model.ApplicationType;
import org.example.utcctp.model.ApprovalHistory;
import org.example.utcctp.model.DecisionType;
import org.example.utcctp.model.InternshipPosition;
import org.example.utcctp.model.NotificationType;
import org.example.utcctp.model.Trip;
import org.example.utcctp.model.User;
import org.example.utcctp.audit.AuditService;
import org.example.utcctp.notification.EmailService;
import org.example.utcctp.notification.EmailTemplates;
import org.example.utcctp.notification.NotificationService;
import org.example.utcctp.model.ApplicationStatusLog;
import org.example.utcctp.notification.WebhookService;
import org.example.utcctp.repository.ApplicationRepository;
import org.example.utcctp.repository.ApplicationStatusLogRepository;
import org.example.utcctp.repository.ApprovalHistoryRepository;
import org.example.utcctp.repository.InternshipPositionRepository;
import org.example.utcctp.repository.TripRepository;
import org.example.utcctp.repository.UserRepository;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final TripRepository tripRepository;
    private final InternshipPositionRepository internshipRepository;
    private final ApprovalHistoryRepository approvalHistoryRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final WebhookService webhookService;
    private final ApplicationStatusLogRepository statusLogRepository;
    private final EmailService emailService;
    private final AuditService auditService;
    private final org.example.utcctp.report.PdfService pdfService;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            TripRepository tripRepository,
            InternshipPositionRepository internshipRepository,
            ApprovalHistoryRepository approvalHistoryRepository,
            NotificationService notificationService,
            UserRepository userRepository,
            WebhookService webhookService,
            ApplicationStatusLogRepository statusLogRepository,
            EmailService emailService,
            AuditService auditService,
            org.example.utcctp.report.PdfService pdfService
    ) {
        this.applicationRepository = applicationRepository;
        this.tripRepository = tripRepository;
        this.internshipRepository = internshipRepository;
        this.approvalHistoryRepository = approvalHistoryRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.webhookService = webhookService;
        this.statusLogRepository = statusLogRepository;
        this.emailService = emailService;
        this.auditService = auditService;
        this.pdfService = pdfService;
    }

    public byte[] generateLetter(UUID id, User user) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Application not found"));
        
        // Permission check
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.name().equals("ADMIN"));
        boolean isOwner = application.getStudent().getId().equals(user.getId());
        if (!isAdmin && !isOwner) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Not authorized");
        }

        return pdfService.generateInternshipLetter(application);
    }

    public ApplicationResponse create(ApplicationRequest request, User student) {
        Application application = new Application();
        ApplicationType type = ApplicationType.valueOf(request.type());
        application.setType(type);
        application.setStatus(ApplicationStatus.PENDING);
        application.setStudent(student);
        application.setReason(request.reason());
        
        String firstName = request.firstName() != null ? request.firstName() : "";
        String lastName = request.lastName() != null ? request.lastName() : "";
        application.setApplicantName((firstName + " " + lastName).trim());
        
        application.setApplicantStudentId(request.studentId());
        application.setApplicantFaculty(request.faculty());
        application.setApplicantMajor(request.major());

        if (type == ApplicationType.TRIP) {
            Trip trip = tripRepository.findById(request.tripId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));
            application.setTrip(trip);
        } else {
            InternshipPosition position = internshipRepository.findById(request.internshipPositionId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Position not found"));
            application.setInternshipPosition(position);
        }
        applicationRepository.save(application);
        return mapApplication(application);
    }

    public List<ApplicationResponse> list(User user) {
        boolean isStudent = user.getRoles().stream().anyMatch(role -> role.name().equals("STUDENT"));
        List<Application> applications = isStudent
                ? applicationRepository.findByStudentId(user.getId())
                : applicationRepository.findAll();
        return applications.stream().map(this::mapApplication).toList();
    }

    public ApplicationResponse decide(UUID id, DecisionRequest request, User approver) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
        
        ApplicationStatus oldStatus = application.getStatus();
        DecisionType decision = DecisionType.valueOf(request.decision());
        ApplicationStatus newStatus = decision == DecisionType.APPROVE
                ? ApplicationStatus.ACCEPTED // Updated to use new ATS status
                : ApplicationStatus.REJECTED;
        
        application.setStatus(newStatus);
        applicationRepository.save(application);

        // 1. Log Status Change History
        ApplicationStatusLog log = new ApplicationStatusLog();
        log.setApplication(application);
        log.setOldStatus(oldStatus);
        log.setNewStatus(newStatus);
        log.setChangedBy(approver);
        log.setNote(request.note());
        statusLogRepository.save(log);

        // 2. n8n Flow 1: Hook Status Changed
        webhookService.sendStatusChange(Map.of(
            "applicationId", application.getId().toString(),
            "studentName", application.getStudent().getDisplayName(),
            "oldStatus", oldStatus.name(),
            "newStatus", newStatus.name(),
            "positionTitle", application.getInternshipPosition() != null ? application.getInternshipPosition().getTitle() : "Trip",
            "changedBy", approver.getDisplayName()
        ));

        // 3. Keep existing Approval History and Notification
        ApprovalHistory history = new ApprovalHistory();
        history.setApplication(application);
        history.setApprover(approver);
        history.setDecision(decision);
        history.setNote(request.note());
        approvalHistoryRepository.save(history);

        User student = application.getStudent();
        String title = "Application Updated: " + newStatus.name().toLowerCase();
        String message = "Your application status has been changed to " + newStatus.name().toLowerCase() + ".";
        notificationService.notifyUser(student, title, message, NotificationType.APPLICATION);

        // 4. Email notification via Resend
        String positionTitle = application.getInternshipPosition() != null
                ? application.getInternshipPosition().getTitle()
                : (application.getTrip() != null ? application.getTrip().getTitle() : "Application");
        if (student.getEmail() != null && !student.getEmail().isBlank()) {
            emailService.sendAsync(
                    student.getEmail(),
                    "[UTCC-TP] อัปเดตสถานะใบสมัคร: " + newStatus.name(),
                    EmailTemplates.statusChange(
                            student.getDisplayName(),
                            oldStatus.name(),
                            newStatus.name(),
                            positionTitle,
                            request.note()
                    )
            );
        }

        // 5. Audit trail
        auditService.record(
                approver,
                "APPLICATION_DECIDE",
                "Application",
                application.getId().toString(),
                Map.of(
                        "oldStatus", oldStatus.name(),
                        "newStatus", newStatus.name(),
                        "decision", decision.name(),
                        "studentId", student.getId().toString()
                )
        );

        return mapApplication(application);
    }

    public List<ApplicationResponse> bulkDecide(List<UUID> ids, DecisionRequest request, User approver) {
        return ids.stream()
                .map(id -> decide(id, request, approver))
                .toList();
    }

    private ApplicationResponse mapApplication(Application application) {
        String tripTitle = application.getTrip() != null ? application.getTrip().getTitle() : null;
        String internshipTitle = application.getInternshipPosition() != null
                ? application.getInternshipPosition().getTitle()
                : null;
        
        String studentName = application.getStudent() != null ? application.getStudent().getDisplayName() : application.getApplicantName();
        String studentMajor = application.getStudent() != null ? application.getStudent().getMajor() : application.getApplicantMajor();

        return new ApplicationResponse(
                application.getId(),
                studentName != null ? studentName : "Unknown Applicant",
                studentMajor != null ? studentMajor : "-",
                application.getType().name(),
                application.getStatus().name(),
                tripTitle,
                internshipTitle,
                application.getCreatedAt()
        );
    }
}
