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
import org.example.utcctp.notification.NotificationService;
import org.example.utcctp.repository.ApplicationRepository;
import org.example.utcctp.repository.ApprovalHistoryRepository;
import org.example.utcctp.repository.InternshipPositionRepository;
import org.example.utcctp.repository.TripRepository;
import org.example.utcctp.repository.UserRepository;
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

    public ApplicationService(
            ApplicationRepository applicationRepository,
            TripRepository tripRepository,
            InternshipPositionRepository internshipRepository,
            ApprovalHistoryRepository approvalHistoryRepository,
            NotificationService notificationService,
            UserRepository userRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.tripRepository = tripRepository;
        this.internshipRepository = internshipRepository;
        this.approvalHistoryRepository = approvalHistoryRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
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
        DecisionType decision = DecisionType.valueOf(request.decision());
        ApplicationStatus newStatus = decision == DecisionType.APPROVE
                ? ApplicationStatus.APPROVED
                : ApplicationStatus.REJECTED;
        application.setStatus(newStatus);
        applicationRepository.save(application);

        ApprovalHistory history = new ApprovalHistory();
        history.setApplication(application);
        history.setApprover(approver);
        history.setDecision(decision);
        history.setNote(request.note());
        approvalHistoryRepository.save(history);

        User student = application.getStudent();
        String title = "Application " + newStatus.name().toLowerCase();
        String message = "Your application has been " + newStatus.name().toLowerCase() + ".";
        notificationService.notifyUser(student, title, message, NotificationType.APPLICATION);
        return mapApplication(application);
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
