package org.example.utcctp.api;

import org.example.utcctp.api.dto.DashboardResponse;
import org.example.utcctp.dashboard.DashboardService;
import org.example.utcctp.user.CurrentUserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;
    private final CurrentUserService currentUserService;

    public DashboardController(DashboardService dashboardService, CurrentUserService currentUserService) {
        this.dashboardService = dashboardService;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/summary")
    public DashboardResponse summary() {
        return dashboardService.summary(currentUserService.requireUser());
    }

    @GetMapping("/advisor-stats")
    public Map<String, Object> advisorStats() {
        return dashboardService.getAdvisorStats(currentUserService.requireUser());
    }
}
