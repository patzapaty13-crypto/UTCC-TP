package org.example.utcctp.report;

import org.example.utcctp.api.dto.ReportGradeRequest;
import org.example.utcctp.api.dto.ReportRequest;
import org.example.utcctp.api.dto.ReportResponse;
import org.example.utcctp.model.FileAsset;
import org.example.utcctp.model.NotificationType;
import org.example.utcctp.model.Report;
import org.example.utcctp.model.ReportGrade;
import org.example.utcctp.model.ReportStatus;
import org.example.utcctp.model.Trip;
import org.example.utcctp.model.User;
import org.example.utcctp.notification.NotificationService;
import org.example.utcctp.repository.FileAssetRepository;
import org.example.utcctp.repository.ReportGradeRepository;
import org.example.utcctp.repository.ReportRepository;
import org.example.utcctp.repository.TripRepository;
import org.example.utcctp.repository.InternshipPositionRepository;
import org.example.utcctp.model.InternshipPosition;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ReportService {
    private final ReportRepository reportRepository;
    private final ReportGradeRepository reportGradeRepository;
    private final FileAssetRepository fileAssetRepository;
    private final TripRepository tripRepository;
    private final InternshipPositionRepository internshipRepository;
    private final NotificationService notificationService;

    public ReportService(
            ReportRepository reportRepository,
            ReportGradeRepository reportGradeRepository,
            FileAssetRepository fileAssetRepository,
            TripRepository tripRepository,
            InternshipPositionRepository internshipRepository,
            NotificationService notificationService
    ) {
        this.reportRepository = reportRepository;
        this.reportGradeRepository = reportGradeRepository;
        this.fileAssetRepository = fileAssetRepository;
        this.tripRepository = tripRepository;
        this.internshipRepository = internshipRepository;
        this.notificationService = notificationService;
    }

    public ReportResponse createReport(ReportRequest request, User student) {
        Report report = new Report();
        report.setStudent(student);
        report.setStatus(ReportStatus.AWAITING_REVIEW);

        // Set title and content from the request
        if (request.title() != null && !request.title().isBlank()) {
            report.setTitle(request.title());
        }
        if (request.content() != null) {
            report.setContent(request.content());
        }

        if (request.tripId() != null) {
            Trip trip = tripRepository.findById(request.tripId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));
            report.setTrip(trip);
        }
        if (request.internshipPositionId() != null) {
            InternshipPosition position = internshipRepository.findById(request.internshipPositionId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Position not found"));
            report.setInternshipPosition(position);
        }
        if (request.fileId() != null) {
            FileAsset file = fileAssetRepository.findById(request.fileId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found"));
            report.setFile(file);
        }
        reportRepository.save(report);
        notificationService.notifyUser(student, "Report submitted", "Your report was submitted successfully.", NotificationType.REPORT);
        return mapReport(report);
    }

    public List<ReportResponse> listReports(User user) {
        boolean isStudent = user.getRoles().stream().anyMatch(role -> role.name().equals("STUDENT"));
        List<Report> reports = isStudent ? reportRepository.findByStudentId(user.getId()) : reportRepository.findAll();
        return reports.stream().map(this::mapReport).toList();
    }

    public ReportResponse gradeReport(UUID id, ReportGradeRequest request, User grader) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));
        ReportGrade grade = new ReportGrade();
        grade.setReport(report);
        grade.setGrader(grader);
        grade.setScore(request.score());
        grade.setComment(request.comment());
        reportGradeRepository.save(grade);
        report.setStatus(ReportStatus.GRADED);
        reportRepository.save(report);
        notificationService.notifyUser(report.getStudent(), "Report graded", "Your report has been graded.", NotificationType.REPORT);
        return mapReport(report);
    }

    private ReportResponse mapReport(Report report) {
        // Title priority: explicit title > trip title > position title > fallback
        String title = report.getTitle();
        if (title == null || title.isBlank()) {
            title = report.getTrip() != null
                    ? report.getTrip().getTitle()
                    : report.getInternshipPosition() != null
                    ? report.getInternshipPosition().getTitle()
                    : "Report";
        }
        return new ReportResponse(
                report.getId(),
                title,
                report.getContent(),
                report.getStatus().name(),
                report.getSubmittedAt(),
                report.getFile() == null ? null : report.getFile().getId()
        );
    }
}
