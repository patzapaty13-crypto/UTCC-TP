package org.example.utcctp.repository;

import org.example.utcctp.model.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OtpCodeRepository extends JpaRepository<OtpCode, UUID> {
    Optional<OtpCode> findFirstByEmailAndPurposeAndConsumedFalseOrderByCreatedAtDesc(String email, String purpose);
}
