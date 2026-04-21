package org.example.utcctp.report;

import org.example.utcctp.model.Report;
import org.example.utcctp.repository.ReportRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ReportService {
    
    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
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

    public Report createReport(Report report) {
        return reportRepository.save(report);
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

    public Report gradeReport(UUID reportId, Integer score, String feedback, UUID gradedBy) {
        Report report = getReport(reportId);
        report.setScore(score);
        report.setFeedback(feedback);
        report.setStatus(Report.ReportStatus.GRADED);
        report.setGradedAt(LocalDateTime.now());
        return reportRepository.save(report);
    }

    public void deleteReport(UUID reportId) {
        reportRepository.deleteById(reportId);
    }
}
