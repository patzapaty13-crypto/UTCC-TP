package org.example.utcctp.repository;

import org.example.utcctp.model.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    
    List<Bookmark> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Optional<Bookmark> findByUserIdAndInternshipId(Long userId, Long internshipId);
    
    boolean existsByUserIdAndInternshipId(Long userId, Long internshipId);
    
    void deleteByUserIdAndInternshipId(Long userId, Long internshipId);
}
