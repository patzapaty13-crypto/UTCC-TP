package org.example.utcctp.repository;

import org.example.utcctp.model.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, UUID> {
    List<Bookmark> findByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<Bookmark> findByUserIdAndInternshipId(UUID userId, UUID internshipId);
    boolean existsByUserIdAndInternshipId(UUID userId, UUID internshipId);
    void deleteByUserIdAndInternshipId(UUID userId, UUID internshipId);
}
