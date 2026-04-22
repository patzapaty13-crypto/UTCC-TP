package org.example.utcctp.api;

import jakarta.validation.Valid;
import org.example.utcctp.api.dto.ReportGradeRequest;
import org.example.utcctp.api.dto.ReportRequest;
import org.example.utcctp.api.dto.ReportResponse;
import org.example.utcctp.report.ReportService;
import org.example.utcctp.user.CurrentUserService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public ReportResponse createReport(@Valid @RequestBody ReportRequest request) {
        return reportService.createReport(request, currentUserService.requireUser());
    }

    @PutMapping("/{id}/grade")
    @PreAuthorize("hasRole('ADVISOR') or hasRole('STAFF') or hasRole('ADMIN')")
    public ReportResponse gradeReport(@PathVariable UUID id, @Valid @RequestBody ReportGradeRequest request) {
        return reportService.gradeReport(id, request, currentUserService.requireUser());
    }

    @PostMapping("/{id}/upload")
    @PreAuthorize("hasRole('STUDENT')")
    public ReportResponse uploadReportFile(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        return reportService.uploadReportFile(id, file, currentUserService.requireUser());
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADVISOR') or hasRole('STAFF') or hasRole('ADMIN') or hasRole('COMPANY')")
    public ResponseEntity<Resource> downloadReportFile(@PathVariable UUID id) {
        Resource file = reportService.downloadReportFile(id, currentUserService.requireUser());
        String filename = reportService.getReportFileName(id);
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(file);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADVISOR') or hasRole('STAFF') or hasRole('ADMIN')")
    public ReportResponse getReport(@PathVariable UUID id) {
        return reportService.getReport(id, currentUserService.requireUser());
    }
}
