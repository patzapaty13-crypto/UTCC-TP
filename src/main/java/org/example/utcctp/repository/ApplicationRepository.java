package org.example.utcctp.repository;

import org.example.utcctp.model.Application;
import org.example.utcctp.model.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    List<Application> findByStudentId(UUID studentId);
    List<Application> findByStatus(ApplicationStatus status);

    @Query("SELECT a FROM Application a WHERE a.status = :status AND a.internshipPosition.company.id = :companyId")
    List<Application> findByStatusAndCompanyId(ApplicationStatus status, UUID companyId);

    @Query("SELECT a.status, COUNT(a) FROM Application a GROUP BY a.status")
    List<Object[]> countGroupByStatus();

    @Query("""
        SELECT COALESCE(a.applicantMajor, s.major, 'Unknown'), COUNT(a)
        FROM Application a LEFT JOIN a.student s
        GROUP BY COALESCE(a.applicantMajor, s.major, 'Unknown')
        ORDER BY COUNT(a) DESC
    """)
    List<Object[]> countGroupByMajor();

    @Query("""
        SELECT COALESCE(a.applicantMajor, s.major, 'Unknown') AS major,
               SUM(CASE WHEN a.status = org.example.utcctp.model.ApplicationStatus.ACCEPTED THEN 1 ELSE 0 END),
               COUNT(a)
        FROM Application a LEFT JOIN a.student s
        GROUP BY COALESCE(a.applicantMajor, s.major, 'Unknown')
        ORDER BY COUNT(a) DESC
    """)
    List<Object[]> placementRateByMajor();

    @Query(value = """
        SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') AS ym, COUNT(*)
        FROM applications
        WHERE created_at >= (NOW() - INTERVAL '6 months')
        GROUP BY ym
        ORDER BY ym
    """, nativeQuery = true)
    List<Object[]> countMonthlyPg();

    @Query(value = """
        SELECT FORMATDATETIME(created_at, 'yyyy-MM') AS ym, COUNT(*)
        FROM applications
        WHERE created_at >= DATEADD('MONTH', -6, CURRENT_TIMESTAMP)
        GROUP BY ym
        ORDER BY ym
    """, nativeQuery = true)
    List<Object[]> countMonthlyH2();
}
