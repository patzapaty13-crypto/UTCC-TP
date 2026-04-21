package org.example.utcctp.report;

import lombok.RequiredArgsConstructor;
import org.example.utcctp.model.Report;
import org.example.utcctp.model.User;
import org.example.utcctp.model.InternshipPosition;
import org.example.utcctp.repository.ReportRepository;
import org.example.utcctp.repository.UserRepository;
import org.example.utcctp.repository.InternshipRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {
    
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final InternshipRepository internshipRepository;

    @Transactional
    public Report createReport(Long studentId, Report report) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        report.setStudent(student);
        
        if (report.getInternship() != null && report.getInternship().getId() != null) {
            InternshipPosition internship = internshipRepository.findById(report.getInternship().getId())
                    .orElseThrow(() -> new RuntimeException("Internship not found"));
            report.setInternship(internship);
        }
        
        return reportRepository.save(report);
    }

    @Transactional
    public Report submitReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        
        report.setStatus(Report.ReportStatus.SUBMITTED);
        report.setSubmittedAt(LocalDateTime.now());
        
        return reportRepository.save(report);
    }

    @Transactional
    public Report gradeReport(Long reportId, Integer score, String feedback, Long gradedBy) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        
        User grader = userRepository.findById(gradedBy)
                .orElseThrow(() -> new RuntimeException("Grader not found"));
        
        report.setScore(score);
        report.setFeedback(feedback);
        report.setStatus(Report.ReportStatus.GRADED);
        report.setGradedAt(LocalDateTime.now());
        report.setGradedBy(grader);
        
        return reportRepository.save(report);
    }

    @Transactional
    public Report updateReport(Long reportId, Report updatedReport) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        
        // Only allow updates if status is DRAFT or NEEDS_REVISION
        if (report.getStatus() != Report.ReportStatus.DRAFT && 
            report.getStatus() != Report.ReportStatus.NEEDS_REVISION) {
            throw new RuntimeException("Cannot update submitted report");
        }
        
        report.setTitle(updatedReport.getTitle());
        report.setContent(updatedReport.getContent());
        report.setType(updatedReport.getType());
        report.setWeekNumber(updatedReport.getWeekNumber());
        report.setAchievements(updatedReport.getAchievements());
        report.setChallenges(updatedReport.getChallenges());
        report.setLearnings(updatedReport.getLearnings());
        report.setNextWeekPlan(updatedReport.getNextWeekPlan());
        
        return reportRepository.save(report);
    }

    public List<Report> getStudentReports(Long studentId) {
        return reportRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    public List<Report> getAdvisorReports(Long advisorId) {
        return reportRepository.findByAdvisorId(advisorId);
    }

    public List<Report> getAdvisorPendingReports(Long advisorId) {
        return reportRepository.findByAdvisorIdAndStatus(advisorId, Report.ReportStatus.SUBMITTED);
    }

    public Report getReport(Long reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    @Transactional
    public void deleteReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        
        // Only allow deletion if status is DRAFT
        if (report.getStatus() != Report.ReportStatus.DRAFT) {
            throw new RuntimeException("Cannot delete submitted report");
        }
        
        reportRepository.delete(report);
    }
}
