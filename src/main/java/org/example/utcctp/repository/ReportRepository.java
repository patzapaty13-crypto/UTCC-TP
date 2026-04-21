package org.example.utcctp.repository;

import org.example.utcctp.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReportRepository extends JpaRepository<Report, UUID> {
    List<Report> findByStudentId(UUID studentId);
}
