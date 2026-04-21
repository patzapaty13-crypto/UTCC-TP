package org.example.utcctp.repository;

import org.example.utcctp.model.Report;
import org.example.utcctp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    List<Report> findByStudentOrderByCreatedAtDesc(User student);
    
    List<Report> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    
    @Query("SELECT r FROM Report r WHERE r.student.advisorId = :advisorId ORDER BY r.createdAt DESC")
    List<Report> findByAdvisorId(@Param("advisorId") Long advisorId);
    
    @Query("SELECT r FROM Report r WHERE r.student.advisorId = :advisorId AND r.status = :status ORDER BY r.createdAt DESC")
    List<Report> findByAdvisorIdAndStatus(@Param("advisorId") Long advisorId, @Param("status") Report.ReportStatus status);
    
    List<Report> findByStatusOrderByCreatedAtDesc(Report.ReportStatus status);
    
    @Query("SELECT r FROM Report r WHERE r.student.id = :studentId AND r.internship.id = :internshipId ORDER BY r.createdAt DESC")
    List<Report> findByStudentAndInternship(@Param("studentId") Long studentId, @Param("internshipId") Long internshipId);
}
