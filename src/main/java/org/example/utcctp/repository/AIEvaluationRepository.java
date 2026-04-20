package org.example.utcctp.repository;

import org.example.utcctp.model.AIEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface AIEvaluationRepository extends JpaRepository<AIEvaluation, UUID> {
    Optional<AIEvaluation> findByApplicationId(UUID applicationId);
}
