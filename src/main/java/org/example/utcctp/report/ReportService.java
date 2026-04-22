package org.example.utcctp.report;

import org.example.utcctp.api.dto.ReportGradeRequest;
import org.example.utcctp.api.dto.ReportRequest;
import org.example.utcctp.api.dto.ReportResponse;
import org.example.utcctp.model.Report;
import org.example.utcctp.model.RoleType;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.ReportRepository;
import org.example.utcctp.repository.InternshipPositionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReportService {
    
    private final ReportRepository reportRepository;
    private final InternshipPositionRepository internshipPositionRepository;
    private final Path fileStoragePath;

    public ReportService(ReportRepository reportRepository, InternshipPositionRepository internshipPositionRepository,
                         @Value("${app.file.storage-path:uploads/reports}") String fileStoragePath) {
        this.reportRepository = reportRepository;
        this.internshipPositionRepository = internshipPositionRepository;
        this.fileStoragePath = Paths.get(fileStoragePath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStoragePath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create file storage directory", e);
        }
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

    public ReportResponse getReport(UUID reportId, User user) {
        return toResponse(findReport(reportId));
    }

    public Report updateReport(UUID reportId, Report updatedReport) {
        Report report = findReport(reportId);
        report.setTitle(updatedReport.getTitle());
        report.setContent(updatedReport.getContent());
        report.setType(updatedReport.getType());
        report.setWeekNumber(updatedReport.getWeekNumber());
        return reportRepository.save(report);
    }

    public Report submitReport(UUID reportId) {
        Report report = findReport(reportId);
        report.setStatus(Report.ReportStatus.SUBMITTED);
        report.setSubmittedAt(LocalDateTime.now());
        return reportRepository.save(report);
    }

    private Report findReport(UUID reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    public void deleteReport(UUID reportId) {
        reportRepository.deleteById(reportId);
    }

    public ReportResponse uploadReportFile(UUID reportId, MultipartFile file, User user) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.lastIndexOf('.') > 0) {
            extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        }
        String storedFilename = reportId + "_" + UUID.randomUUID() + extension;
        Path targetPath = fileStoragePath.resolve(storedFilename);

        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }

        report.setFileName(originalFilename);
        report.setFilePath(targetPath.toString());
        report.setFileSize(file.getSize());
        report.setFileType(file.getContentType());
        report.setUploadedAt(LocalDateTime.now());

        return toResponse(reportRepository.save(report));
    }

    public Resource downloadReportFile(UUID reportId, User user) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        if (report.getFilePath() == null) {
            throw new RuntimeException("No file uploaded for this report");
        }
        Path filePath = Paths.get(report.getFilePath());
        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("File not found or not readable");
            }
            return resource;
        } catch (MalformedURLException e) {
            throw new RuntimeException("Failed to load file", e);
        }
    }

    public String getReportFileName(UUID reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        return report.getFileName() != null ? report.getFileName() : "report.pdf";
    }

    private ReportResponse toResponse(Report report) {
        String company = "ไม่ระบุ";
        String position = "ไม่ระบุ";
        
        if (report.getInternship() != null) {
            position = report.getInternship().getTitle();
            if (report.getInternship().getCompany() != null) {
                company = report.getInternship().getCompany().getName();
            }
        }
        
        // Build attachments list (for now just the PDF file if exists)
        List<String> attachments = new ArrayList<>();
        if (report.getFileName() != null) {
            attachments.add(report.getFileName());
        }
        
        return new ReportResponse(
                report.getId(),
                report.getTitle(),
                report.getContent(),
                report.getType().name(),
                report.getWeekNumber(),
                report.getStatus().name(),
                company,
                position,
                report.getScore(),
                report.getFeedback(),
                report.getSubmittedAt() != null ? 
                    java.time.Instant.from(report.getSubmittedAt().atZone(java.time.ZoneId.systemDefault())) : null,
                report.getGradedAt() != null ?
                    java.time.Instant.from(report.getGradedAt().atZone(java.time.ZoneId.systemDefault())) : null,
                null, // fileId not implemented yet
                report.getFileName(),
                report.getFileSize(),
                report.getUploadedAt() != null ?
                    java.time.Instant.from(report.getUploadedAt().atZone(java.time.ZoneId.systemDefault())) : null,
                attachments
        );
    }
}
