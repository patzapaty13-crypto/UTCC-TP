package org.example.utcctp.dashboard;

import org.example.utcctp.api.dto.DashboardResponse;
import org.example.utcctp.model.ApplicationStatus;
import org.example.utcctp.model.ApplicationType;
import org.example.utcctp.model.Report;
import org.example.utcctp.model.RoleType;
import org.example.utcctp.model.TripStatus;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.ApplicationRepository;
import org.example.utcctp.repository.InternshipPositionRepository;
import org.example.utcctp.repository.ReportRepository;
import org.example.utcctp.repository.TripRepository;
import org.example.utcctp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
    private final TripRepository tripRepository;
    private final ApplicationRepository applicationRepository;
    private final InternshipPositionRepository internshipRepository;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public DashboardService(
            TripRepository tripRepository,
            ApplicationRepository applicationRepository,
            InternshipPositionRepository internshipRepository,
            ReportRepository reportRepository,
            UserRepository userRepository
    ) {
        this.tripRepository = tripRepository;
        this.applicationRepository = applicationRepository;
        this.internshipRepository = internshipRepository;
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
    }

    public DashboardResponse summary(User user) {
        long activeTrips = tripRepository.findAll().stream()
                .filter(trip -> trip.getStatus() != TripStatus.COMPLETED)
                .count();
        long pendingApps = applicationRepository.findAll().stream()
                .filter(app -> app.getStatus() == ApplicationStatus.PENDING)
                .count();
        long reportsDue = reportRepository.findAll().stream()
                .filter(report -> report.getStatus() == org.example.utcctp.model.Report.ReportStatus.SUBMITTED)
                .count();
        int internshipSlots = internshipRepository.findAll().stream()
                .mapToInt(position -> position.getSlots())
                .sum();
        long approvedInternshipApps = applicationRepository.findAll().stream()
                .filter(app -> app.getType() == ApplicationType.INTERNSHIP)
                .filter(app -> app.getStatus() == ApplicationStatus.ACCEPTED)
                .count();
        int unmatchedSlots = Math.max(0, internshipSlots - (int) approvedInternshipApps);

        // New fields for frontend dashboard
        long totalApplications = applicationRepository.count();
        long pendingInterviews = applicationRepository.findAll().stream()
                .filter(app -> app.getStatus() == ApplicationStatus.INTERVIEW_SCHEDULED)
                .count();
        long activeJobs = internshipRepository.count();
        long offersAccepted = approvedInternshipApps;

        String role = user.getRoles().stream().findFirst().map(RoleType::name).orElse("GUEST");
        return new DashboardResponse(
                Math.toIntExact(activeTrips),
                Math.toIntExact(pendingApps),
                Math.toIntExact(reportsDue),
                internshipSlots,
                unmatchedSlots,
                role,
                Math.toIntExact(totalApplications),
                Math.toIntExact(pendingInterviews),
                Math.toIntExact(activeJobs),
                Math.toIntExact(offersAccepted)
        );
    }

    public Map<String, Object> getAdvisorStats(User advisor) {
        // Get advisor's students
        List<User> students = userRepository.findByAdvisorId(advisor.getId());

        // Get reports from these students
        List<Report> studentReports = reportRepository.findAll().stream()
                .filter(report -> students.contains(report.getStudent()))
                .filter(report -> report.getScore() != null)
                .toList();

        // Calculate average GPA
        double averageGpa = 0.0;
        if (!studentReports.isEmpty()) {
            averageGpa = studentReports.stream()
                    .mapToDouble(Report::getScore)
                    .average()
                    .orElse(0.0);
        }

        // Count pending reports (submitted but not graded)
        long pendingReports = reportRepository.findAll().stream()
                .filter(report -> students.contains(report.getStudent()))
                .filter(report -> report.getStatus() == Report.ReportStatus.SUBMITTED)
                .count();

        // Count pending approvals (applications in PENDING status)
        long pendingApprovals = applicationRepository.findAll().stream()
                .filter(app -> students.contains(app.getStudent()))
                .filter(app -> app.getStatus() == ApplicationStatus.PENDING)
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", students.size());
        stats.put("pendingReports", pendingReports);
        stats.put("pendingApprovals", pendingApprovals);
        stats.put("averageGpa", averageGpa);
        stats.put("unreadNotifications", 0); // TODO: implement notification count
        stats.put("recentActivities", List.of()); // TODO: implement recent activities

        return stats;
    }
}
