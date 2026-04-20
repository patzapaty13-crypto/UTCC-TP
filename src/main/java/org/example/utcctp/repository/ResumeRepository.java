package org.example.utcctp.repository;

import org.example.utcctp.model.Resume;
import org.example.utcctp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ResumeRepository extends JpaRepository<Resume, UUID> {
    Optional<Resume> findByUser(User user);
    Optional<Resume> findByUserId(UUID userId);
}
