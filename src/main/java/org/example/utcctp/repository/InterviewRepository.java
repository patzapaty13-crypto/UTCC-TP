package org.example.utcctp.repository;

import org.example.utcctp.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InterviewRepository extends JpaRepository<Interview, UUID> {
    List<Interview> findByApplicationIdOrderByStartsAtDesc(UUID applicationId);
}
