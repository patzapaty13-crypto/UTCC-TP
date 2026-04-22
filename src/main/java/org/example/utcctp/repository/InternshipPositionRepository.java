package org.example.utcctp.repository;

import org.example.utcctp.model.InternshipPosition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InternshipPositionRepository extends JpaRepository<InternshipPosition, UUID> {
    List<InternshipPosition> findByCompanyId(UUID companyId);
    List<InternshipPosition> findByCompanyIdOrderByCreatedAtDesc(UUID companyId);
}
