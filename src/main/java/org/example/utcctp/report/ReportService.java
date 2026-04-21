package org.example.utcctp.report;

import org.example.utcctp.api.dto.ReportGradeRequest;
import org.example.utcctp.api.dto.ReportRequest;
import org.example.utcctp.api.dto.ReportResponse;
import org.example.utcctp.model.Report;
import org.example.utcctp.model.RoleType;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.ReportRepository;
import org.example.utcctp.repository.InternshipPositionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReportService {
    
    private final ReportRepository reportRepository;
    private final InternshipPositionRepository internshipPositionRepository;

    public ReportService(ReportRepository reportRepository, InternshipPositionRepository internshipPositionRepository) {
        this.reportRepository = reportRepository;
        this.internshipPositionRepository = internshipPositionRepository;
    }

    public List<ReportResponse> listReports(User user) {
        List<Report> reports;
        if (user.getRoles().contains(RoleType.STUDENT)) {
            reports = reportRepository.findByStudentIdOrderByCreatedAtDesc(user.getId());
        } else {
            // For advisors/staff/admin, show all reports
            reports = reportRepository.findAll();
        }
        return reports.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ReportResponse createReport(ReportRequest request, User user) {
        Report report = new Report();
        report.setStudent(user);
        report.setTitle(request.title() != null ? request.title() : "Report");
        report.setContent(request.content());
        report.setType(Report.ReportType.valueOf(request.type() != null ? request.type() : "WEEKLY"));
        report.setWeekNumber(request.weekNumber());
        report.setStatus(Report.ReportStatus.DRAFT);
        
        if (request.internshipPositionId() != null) {
            internshipPositionRepository.findById(request.internshipPositionId())
                    .ifPresent(report::setInternship);
        }
        
        Report saved = reportRepository.save(report);
        
        // Auto-submit if requested
        if (request.submit() != null && request.submit()) {
            saved.setStatus(Report.ReportStatus.SUBMITTED);
            saved.setSubmittedAt(LocalDateTime.now());
            saved = reportRepository.save(saved);
        }
        
        return toResponse(saved);
    }

    public ReportResponse gradeReport(UUID reportId, ReportGradeRequest request, User user) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        
        if (request.score() != null) {
            report.setScore(request.score().intValue());
        }
        report.setFeedback(request.comment());
        report.setStatus(Report.ReportStatus.GRADED);
        report.setGradedAt(LocalDateTime.now());
        report.setGradedBy(user);
        
        return toResponse(reportRepository.save(report));
    }

    public List<Report> getStudentReports(UUID studentId) {
        return reportRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    public List<Report> getReportsByStatus(Report.ReportStatus status) {
        return reportRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public Report getReport(UUID reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    public Report updateReport(UUID reportId, Report updatedReport) {
        Report report = getReport(reportId);
        report.setTitle(updatedReport.getTitle());
        report.setContent(updatedReport.getContent());
        report.setType(updatedReport.getType());
        report.setWeekNumber(updatedReport.getWeekNumber());
        return reportRepository.save(report);
    }

    public Report submitReport(UUID reportId) {
        Report report = getReport(reportId);
        report.setStatus(Report.ReportStatus.SUBMITTED);
        report.setSubmittedAt(LocalDateTime.now());
        return reportRepository.save(report);
    }

    public void deleteReport(UUID reportId) {
        reportRepository.deleteById(reportId);
    }

    private ReportResponse toResponse(Report report) {
        return new ReportResponse(
                report.getId(),
                report.getTitle(),
                report.getContent(),
                report.getStatus().name(),
                report.getSubmittedAt() != null ? 
                    java.time.Instant.from(report.getSubmittedAt().atZone(java.time.ZoneId.systemDefault())) : null,
                null // fileId not implemented yet
        );
    }
}
