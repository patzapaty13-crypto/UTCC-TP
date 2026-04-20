package org.example.utcctp.analytics;

import org.example.utcctp.api.dto.AnalyticsDashboardResponse;
import org.example.utcctp.api.dto.AnalyticsOverviewResponse;
import org.example.utcctp.model.ApplicationStatus;
import org.example.utcctp.repository.ApplicationRepository;
import org.example.utcctp.repository.InternshipPositionRepository;
import org.example.utcctp.repository.ReportRepository;
import org.example.utcctp.repository.TripRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {
    private final TripRepository tripRepository;
    private final InternshipPositionRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final ReportRepository reportRepository;
    private final String activeProfiles;

    public AnalyticsService(
            TripRepository tripRepository,
            InternshipPositionRepository internshipRepository,
            ApplicationRepository applicationRepository,
            ReportRepository reportRepository,
            @Value("${spring.profiles.active:dev}") String activeProfiles
    ) {
        this.tripRepository = tripRepository;
        this.internshipRepository = internshipRepository;
        this.applicationRepository = applicationRepository;
        this.reportRepository = reportRepository;
        this.activeProfiles = activeProfiles;
    }

    public AnalyticsOverviewResponse overview() {
        return new AnalyticsOverviewResponse(
                tripRepository.count(),
                internshipRepository.count(),
                applicationRepository.count(),
                reportRepository.count()
        );
    }

    public AnalyticsDashboardResponse dashboard() {
        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (ApplicationStatus s : ApplicationStatus.values()) {
            byStatus.put(s.name(), 0L);
        }
        for (Object[] row : applicationRepository.countGroupByStatus()) {
            ApplicationStatus status = (ApplicationStatus) row[0];
            byStatus.put(status.name(), ((Number) row[1]).longValue());
        }

        List<Map<String, Object>> byMajor = new ArrayList<>();
        for (Object[] row : applicationRepository.countGroupByMajor()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("major", row[0]);
            m.put("count", ((Number) row[1]).longValue());
            byMajor.add(m);
        }

        List<Map<String, Object>> placement = new ArrayList<>();
        for (Object[] row : applicationRepository.placementRateByMajor()) {
            long placed = row[1] == null ? 0 : ((Number) row[1]).longValue();
            long total = row[2] == null ? 0 : ((Number) row[2]).longValue();
            double rate = total == 0 ? 0.0 : Math.round((placed * 1000.0) / total) / 10.0;
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("major", row[0]);
            m.put("placed", placed);
            m.put("total", total);
            m.put("rate", rate);
            placement.add(m);
        }

        List<Map<String, Object>> monthly = new ArrayList<>();
        boolean isPostgres = activeProfiles != null
                && (activeProfiles.contains("postgres") || activeProfiles.contains("supabase"));
        List<Object[]> rows;
        try {
            rows = isPostgres ? applicationRepository.countMonthlyPg() : applicationRepository.countMonthlyH2();
        } catch (Exception ex) {
            rows = List.of();
        }
        for (Object[] row : rows) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("month", row[0]);
            m.put("count", ((Number) row[1]).longValue());
            monthly.add(m);
        }

        return new AnalyticsDashboardResponse(
                tripRepository.count(),
                internshipRepository.count(),
                applicationRepository.count(),
                reportRepository.count(),
                byStatus,
                byMajor,
                placement,
                monthly
        );
    }
}
