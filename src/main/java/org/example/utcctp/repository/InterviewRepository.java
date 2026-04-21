package org.example.utcctp.repository;

import org.example.utcctp.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, UUID> {
    List<Interview> findByStudentIdOrderByInterviewDateDesc(UUID studentId);
    List<Interview> findByCompanyIdOrderByInterviewDateDesc(UUID companyId);
    List<Interview> findByApplicationId(UUID applicationId);
    List<Interview> findByStatus(String status);
    List<Interview> findByStudentIdAndStatus(UUID studentId, String status);
}
