package org.example.utcctp.api;

import org.example.utcctp.api.dto.ReportGradeRequest;
import org.example.utcctp.api.dto.ReportRequest;
import org.example.utcctp.api.dto.ReportResponse;
import org.example.utcctp.report.ReportService;
import org.example.utcctp.user.CurrentUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {
    private final ReportService reportService;
    private final CurrentUserService currentUserService;

    public ReportController(ReportService reportService, CurrentUserService currentUserService) {
        this.reportService = reportService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<ReportResponse> listReports() {
        return reportService.listReports(currentUserService.requireUser());
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ReportResponse createReport(@RequestBody ReportRequest request) {
        return reportService.createReport(request, currentUserService.requireUser());
    }

    @PutMapping("/{id}/grade")
    @PreAuthorize("hasRole('ADVISOR') or hasRole('STAFF') or hasRole('ADMIN')")
    public ReportResponse gradeReport(@PathVariable UUID id, @RequestBody ReportGradeRequest request) {
        return reportService.gradeReport(id, request, currentUserService.requireUser());
    }
}
