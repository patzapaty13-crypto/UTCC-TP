package org.example.utcctp.repository;

import org.example.utcctp.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {
    List<Report> findByStudentIdOrderByCreatedAtDesc(UUID studentId);
    List<Report> findByStatusOrderByCreatedAtDesc(Report.ReportStatus status);
    List<Report> findByInternshipIdOrderByCreatedAtDesc(UUID internshipId);
}
