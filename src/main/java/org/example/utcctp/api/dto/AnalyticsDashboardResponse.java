package org.example.utcctp.api.dto;

import java.util.List;
import java.util.Map;

public record AnalyticsDashboardResponse(
        long totalTrips,
        long totalInternships,
        long totalApplications,
        long totalReports,
        Map<String, Long> applicationsByStatus,
        List<Map<String, Object>> applicationsByMajor,
        List<Map<String, Object>> placementRateByMajor,
        List<Map<String, Object>> monthlyApplications
) {
}
