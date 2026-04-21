package org.example.utcctp.api;

import lombok.RequiredArgsConstructor;
import org.example.utcctp.model.Report;
import org.example.utcctp.model.User;
import org.example.utcctp.report.ReportService;
import org.example.utcctp.security.CurrentUser;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {
    
    private final ReportService reportService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Report> createReport(@CurrentUser User user, @RequestBody Report report) {
        Report created = reportService.createReport(user.getId(), report);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Report> updateReport(
            @PathVariable Long id,
            @CurrentUser User user,
            @RequestBody Report report) {
        Report updated = reportService.updateReport(id, report);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Report> submitReport(@PathVariable Long id, @CurrentUser User user) {
        Report submitted = reportService.submitReport(id);
        return ResponseEntity.ok(submitted);
    }

    @PostMapping("/{id}/grade")
    @PreAuthorize("hasRole('ADVISOR')")
    public ResponseEntity<Report> gradeReport(
            @PathVariable Long id,
            @CurrentUser User user,
            @RequestBody Map<String, Object> gradeData) {
        
        Integer score = (Integer) gradeData.get("score");
        String feedback = (String) gradeData.get("feedback");
        
        Report graded = reportService.gradeReport(id, score, feedback, user.getId());
        return ResponseEntity.ok(graded);
    }

    @GetMapping
    public ResponseEntity<List<Report>> getReports(@CurrentUser User user) {
        List<Report> reports;
        
        if (user.getRoles().contains("STUDENT")) {
            reports = reportService.getStudentReports(user.getId());
        } else if (user.getRoles().contains("ADVISOR")) {
            reports = reportService.getAdvisorReports(user.getId());
        } else if (user.getRoles().contains("STAFF") || user.getRoles().contains("ADMIN")) {
            reports = reportService.getAllReports();
        } else {
            return ResponseEntity.forbidden().build();
        }
        
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getReport(@PathVariable Long id, @CurrentUser User user) {
        Report report = reportService.getReport(id);
        
        // Check access permissions
        boolean hasAccess = user.getRoles().contains("ADMIN") ||
                           user.getRoles().contains("STAFF") ||
                           (user.getRoles().contains("STUDENT") && report.getStudent().getId().equals(user.getId())) ||
                           (user.getRoles().contains("ADVISOR") && report.getStudent().getAdvisorId() != null && 
                            report.getStudent().getAdvisorId().equals(user.getId()));
        
        if (!hasAccess) {
            return ResponseEntity.forbidden().build();
        }
        
        return ResponseEntity.ok(report);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADVISOR', 'STAFF', 'ADMIN')")
    public ResponseEntity<List<Report>> getStudentReports(@PathVariable Long studentId) {
        List<Report> reports = reportService.getStudentReports(studentId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/advisor/pending")
    @PreAuthorize("hasRole('ADVISOR')")
    public ResponseEntity<List<Report>> getAdvisorPendingReports(@CurrentUser User user) {
        List<Report> reports = reportService.getAdvisorPendingReports(user.getId());
        return ResponseEntity.ok(reports);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id, @CurrentUser User user) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
}
