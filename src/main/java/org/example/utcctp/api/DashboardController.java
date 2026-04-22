package org.example.utcctp.api;

import org.example.utcctp.api.dto.DashboardResponse;
import org.example.utcctp.dashboard.DashboardService;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.UserRepository;
import org.example.utcctp.user.CurrentUserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;
    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;

    public DashboardController(DashboardService dashboardService, CurrentUserService currentUserService, UserRepository userRepository) {
        this.dashboardService = dashboardService;
        this.currentUserService = currentUserService;
        this.userRepository = userRepository;
    }

    @GetMapping("/summary")
    public DashboardResponse summary() {
        return dashboardService.summary(currentUserService.requireUser());
    }

    @GetMapping("/advisor-stats")
    public Map<String, Object> advisorStats() {
        return dashboardService.getAdvisorStats(currentUserService.requireUser());
    }

    @GetMapping("/advisor/students")
    public List<User> getAdvisorStudents() {
        return userRepository.findByAdvisorId(currentUserService.requireUser().getId());
    }
}
