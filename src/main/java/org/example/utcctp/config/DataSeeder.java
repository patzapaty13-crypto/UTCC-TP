package org.example.utcctp.config;

import org.example.utcctp.model.Application;
import org.example.utcctp.model.ApplicationStatus;
import org.example.utcctp.model.ApplicationType;
import org.example.utcctp.model.Company;
import org.example.utcctp.model.InternshipPosition;
import org.example.utcctp.model.Notification;
import org.example.utcctp.model.NotificationType;
import org.example.utcctp.model.Report;
import org.example.utcctp.model.ReportStatus;
import org.example.utcctp.model.RoleType;
import org.example.utcctp.model.Trip;
import org.example.utcctp.model.TripBudget;
import org.example.utcctp.model.TripSchedule;
import org.example.utcctp.model.TripStatus;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.ApplicationRepository;
import org.example.utcctp.repository.CompanyRepository;
import org.example.utcctp.repository.InternshipPositionRepository;
import org.example.utcctp.repository.NotificationRepository;
import org.example.utcctp.repository.ReportRepository;
import org.example.utcctp.repository.TripRepository;
import org.example.utcctp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final CompanyRepository companyRepository;
    private final InternshipPositionRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final ReportRepository reportRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            UserRepository userRepository,
            TripRepository tripRepository,
            CompanyRepository companyRepository,
            InternshipPositionRepository internshipRepository,
            ApplicationRepository applicationRepository,
            ReportRepository reportRepository,
            NotificationRepository notificationRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.tripRepository = tripRepository;
        this.companyRepository = companyRepository;
        this.internshipRepository = internshipRepository;
        this.applicationRepository = applicationRepository;
        this.reportRepository = reportRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        User student = buildUser("student1", "Natthanon P.", "student@utcctp.local", Set.of(RoleType.STUDENT));
        student.setMajor("Computer Science");
        student.setAcademicYear(3);
        User advisor = buildUser("advisor1", "Dr. Suda N.", "advisor@utcctp.local", Set.of(RoleType.ADVISOR));
        User staff = buildUser("staff1", "Faculty Staff", "staff@utcctp.local", Set.of(RoleType.STAFF));
        User admin = buildUser("admin1", "System Admin", "admin@utcctp.local", Set.of(RoleType.ADMIN));

        userRepository.save(student);
        userRepository.save(advisor);
        userRepository.save(staff);
        userRepository.save(admin);

        Trip trip1 = new Trip();
        trip1.setTitle("Industry Visit 2026");
        trip1.setObjective("Observe manufacturing processes and link to curriculum.");
        trip1.setLocation("The Mall Lifestore Tha Phra, Bangkok");
        trip1.setStatus(TripStatus.PENDING);
        trip1.setStartDate(LocalDate.of(2026, 3, 1));
        trip1.setEndDate(LocalDate.of(2026, 3, 2));
        trip1.setCapacity(40);
        trip1.setBudgetTotal(150_000);
        trip1.setCreatedBy(advisor);

        TripSchedule schedule1 = new TripSchedule();
        schedule1.setTrip(trip1);
        schedule1.setActivity("Morning factory walkthrough");
        schedule1.setStartTime(Instant.now().plusSeconds(3600));
        schedule1.setEndTime(Instant.now().plusSeconds(7200));
        trip1.getSchedules().add(schedule1);

        TripBudget budget1 = new TripBudget();
        budget1.setTrip(trip1);
        budget1.setCategory("Transport");
        budget1.setAmount(60_000);
        trip1.getBudgets().add(budget1);

        Trip trip2 = new Trip();
        trip2.setTitle("Smart Factory Tour");
        trip2.setObjective("Connect courses with Industry 4.0 practice.");
        trip2.setLocation("Industrial Estate Authority of Thailand, Chonburi");
        trip2.setStatus(TripStatus.PUBLISHED);
        trip2.setStartDate(LocalDate.of(2026, 4, 10));
        trip2.setEndDate(LocalDate.of(2026, 4, 10));
        trip2.setCapacity(35);
        trip2.setBudgetTotal(90_000);
        trip2.setCreatedBy(advisor);

        tripRepository.save(trip1);
        tripRepository.save(trip2);

        Company company1 = new Company();
        company1.setName("TechNova Co.");
        company1.setIndustry("Data & Analytics");
        company1.setLocation("Bangkok");
        company1.setStatus("ACTIVE");
        company1.setContactName("Nongluk R.");
        company1.setContactEmail("hr@technova.local");
        companyRepository.save(company1);

        InternshipPosition position1 = new InternshipPosition();
        position1.setCompany(company1);
        position1.setTitle("Data Analyst");
        position1.setDescription("Analyze production data and generate insights.");
        position1.setRequirements("SQL, Python basics, data visualization.");
        position1.setLocation("Bangkok");
        position1.setMode("Hybrid");
        position1.setSlots(8);
        internshipRepository.save(position1);

        Application tripApplication = new Application();
        tripApplication.setType(ApplicationType.TRIP);
        tripApplication.setStatus(ApplicationStatus.PENDING);
        tripApplication.setStudent(student);
        tripApplication.setTrip(trip1);
        applicationRepository.save(tripApplication);

        Application internshipApplication = new Application();
        internshipApplication.setType(ApplicationType.INTERNSHIP);
        internshipApplication.setStatus(ApplicationStatus.APPROVED);
        internshipApplication.setStudent(student);
        internshipApplication.setInternshipPosition(position1);
        applicationRepository.save(internshipApplication);

        Report report = new Report();
        report.setStudent(student);
        report.setTrip(trip1);
        report.setStatus(ReportStatus.AWAITING_REVIEW);
        reportRepository.save(report);

        Notification notification = new Notification();
        notification.setUser(student);
        notification.setTitle("Trip application received");
        notification.setMessage("Your application for Industry Visit 2026 is pending review.");
        notification.setType(NotificationType.APPLICATION);
        notificationRepository.save(notification);
    }

    private User buildUser(String username, String displayName, String email, Set<RoleType> roles) {
        User user = new User();
        user.setUsername(username);
        user.setDisplayName(displayName);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode("pass123"));
        user.setRoles(roles);
        return user;
    }
}
