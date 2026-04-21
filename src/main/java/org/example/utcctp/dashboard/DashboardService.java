package org.example.utcctp.dashboard;

import org.example.utcctp.api.dto.DashboardResponse;
import org.example.utcctp.model.ApplicationStatus;
import org.example.utcctp.model.ApplicationType;
import org.example.utcctp.model.RoleType;
import org.example.utcctp.model.TripStatus;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.ApplicationRepository;
import org.example.utcctp.repository.InternshipPositionRepository;
import org.example.utcctp.repository.ReportRepository;
import org.example.utcctp.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DashboardService {
    private final TripRepository tripRepository;
    private final ApplicationRepository applicationRepository;
    private final InternshipPositionRepository internshipRepository;
    private final ReportRepository reportRepository;

    public DashboardService(
            TripRepository tripRepository,
            ApplicationRepository applicationRepository,
            InternshipPositionRepository internshipRepository,
            ReportRepository reportRepository
    ) {
        this.tripRepository = tripRepository;
        this.applicationRepository = applicationRepository;
        this.internshipRepository = internshipRepository;
        this.reportRepository = reportRepository;
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
}
