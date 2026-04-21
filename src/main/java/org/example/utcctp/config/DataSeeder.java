package org.example.utcctp.config;

import org.example.utcctp.model.Application;
import org.example.utcctp.model.ApplicationStatus;
import org.example.utcctp.model.ApplicationType;
import org.example.utcctp.model.Company;
import org.example.utcctp.model.InternshipPosition;
import org.example.utcctp.model.Notification;
import org.example.utcctp.model.RoleType;
import org.example.utcctp.model.Trip;
import org.example.utcctp.model.TripStatus;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.ApplicationRepository;
import org.example.utcctp.repository.CompanyRepository;
import org.example.utcctp.repository.InternshipPositionRepository;
import org.example.utcctp.repository.NotificationRepository;
import org.example.utcctp.repository.TripRepository;
import org.example.utcctp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final CompanyRepository companyRepository;
    private final InternshipPositionRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            UserRepository userRepository,
            TripRepository tripRepository,
            CompanyRepository companyRepository,
            InternshipPositionRepository internshipRepository,
            ApplicationRepository applicationRepository,
            NotificationRepository notificationRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.tripRepository = tripRepository;
        this.companyRepository = companyRepository;
        this.internshipRepository = internshipRepository;
        this.applicationRepository = applicationRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        User student = buildUser("student1", "Natthanon P.", "student@utcctp.local", Set.of(RoleType.STUDENT));
        student.setMajor("Computer Engineering");
        student.setAcademicYear(3);
        User advisor = buildUser("advisor1", "Dr. Suda N.", "advisor@utcctp.local", Set.of(RoleType.ADVISOR));
        User staff = buildUser("staff1", "Faculty Staff", "staff@utcctp.local", Set.of(RoleType.STAFF));
        User admin = buildUser("admin1", "Super Admin", "admin@utcctp.local", Set.of(RoleType.ADMIN));

        userRepository.save(student);
        userRepository.save(advisor);
        userRepository.save(staff);
        userRepository.save(admin);

        // --- COMPANIES ---
        Company company1 = new Company();
        company1.setName("Global Tech Solutions");
        company1.setIndustry("Software Development");
        company1.setLocation("Wireless Road, Bangkok");
        company1.setStatus("ACTIVE");
        company1.setContactName("Sarah Connor");
        company1.setContactEmail("hr@globaltech.local");
        companyRepository.save(company1);

        // Create company user and link to company
        User companyUser = buildUser("company1", "Global Tech HR", "company@globaltech.local", Set.of(RoleType.COMPANY));
        companyUser.setCompanyId(company1.getId());
        userRepository.save(companyUser);

        // --- TRIPS ---
        Trip trip1 = new Trip();
        trip1.setTitle("Industry Visit 2026: EEC Zone");
        trip1.setObjective("Observe large-scale automation and smart factory workflows.");
        trip1.setLocation("Amata City, Rayong");
        trip1.setStatus(TripStatus.PUBLISHED);
        trip1.setStartDate(LocalDate.now().plusDays(30));
        trip1.setEndDate(LocalDate.now().plusDays(31));
        trip1.setCapacity(40);
        trip1.setBudgetTotal(150_000);
        trip1.setCreatedBy(advisor);
        tripRepository.save(trip1);

        Trip trip2 = new Trip();
        trip2.setTitle("Smart Logistics Expo");
        trip2.setObjective("Understand modern supply chain technologies.");
        trip2.setLocation("BITEC Bangna, Bangkok");
        trip2.setStatus(TripStatus.PUBLISHED);
        trip2.setStartDate(LocalDate.now().plusDays(15));
        trip2.setEndDate(LocalDate.now().plusDays(16));
        trip2.setCapacity(60);
        trip2.setBudgetTotal(75_000);
        trip2.setCreatedBy(advisor);
        tripRepository.save(trip2);

        Trip trip3 = new Trip();
        trip3.setTitle("Software House Residency");
        trip3.setObjective("Draft plan for week-long immersion in Agile dev.");
        trip3.setLocation("Lad Phrao, Bangkok");
        trip3.setStatus(TripStatus.DRAFT);
        trip3.setStartDate(LocalDate.now().plusDays(45));
        trip3.setEndDate(LocalDate.now().plusDays(52));
        trip3.setCapacity(15);
        trip3.setBudgetTotal(45_000);
        trip3.setCreatedBy(advisor);
        tripRepository.save(trip3);

        // --- COMPANIES & POSITIONS ---

        InternshipPosition pos1 = new InternshipPosition();
        pos1.setCompany(company1);
        pos1.setTitle("Junior Web Developer");
        pos1.setDescription("Work on Vue 3 and Spring Boot projects for fintech.");
        pos1.setRequirements("JavaScript, Basic SQL, Git knowledge.");
        pos1.setLocation("Bangkok (Hybrid)");
        pos1.setMode("HYBRID");
        pos1.setSlots(5);
        // Phase 1 Enhancement Fields
        pos1.setSalaryMin(new BigDecimal("15000"));
        pos1.setSalaryMax(new BigDecimal("20000"));
        pos1.setStartDate(LocalDate.now().plusDays(30));
        pos1.setEndDate(LocalDate.now().plusDays(150));
        pos1.setApplicationDeadline(LocalDate.now().plusDays(20));
        pos1.setBenefits("ค่าเดินทาง, ประกันอุบัติเหตุ, อาหารกลางวัน");
        pos1.setInternshipType("FULL_TIME");
        pos1.setContactEmail("hr@globaltech.local");
        pos1.setContactPhone("02-123-4567");
        pos1.setContactLine("@globaltech");
        internshipRepository.save(pos1);

        InternshipPosition pos2 = new InternshipPosition();
        pos2.setCompany(company1);
        pos2.setTitle("UX/UI Design Intern");
        pos2.setDescription("Design modern dash systems using Figma.");
        pos2.setRequirements("Figma, Design systems, User flow mapping.");
        pos2.setLocation("Bangkok");
        pos2.setMode("ONSITE");
        pos2.setSlots(2);
        // Phase 1 Enhancement Fields
        pos2.setSalaryMin(new BigDecimal("12000"));
        pos2.setSalaryMax(new BigDecimal("18000"));
        pos2.setStartDate(LocalDate.now().plusDays(45));
        pos2.setEndDate(LocalDate.now().plusDays(165));
        pos2.setApplicationDeadline(LocalDate.now().plusDays(30));
        pos2.setBenefits("ค่าเดินทาง, ประกันอุบัติเหตุ");
        pos2.setInternshipType("FULL_TIME");
        pos2.setContactEmail("design@globaltech.local");
        pos2.setContactPhone("02-123-4568");
        internshipRepository.save(pos2);

        // --- APPLICATIONS ---
        Application trippApp = new Application();
        trippApp.setType(ApplicationType.TRIP);
        trippApp.setStatus(ApplicationStatus.PENDING);
        trippApp.setStudent(student);
        trippApp.setTrip(trip1);
        applicationRepository.save(trippApp);

        // --- NOTIFICATIONS ---
        Notification n = new Notification();
        n.setUser(student);
        n.setTitle("Welcome to UTCC-TP");
        n.setMessage("Your student profile has been successfully integrated into the platform.");
        n.setType(Notification.NotificationType.SYSTEM_ANNOUNCEMENT);
        notificationRepository.save(n);
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
