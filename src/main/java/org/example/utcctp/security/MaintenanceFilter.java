package org.example.utcctp.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.utcctp.config.SystemConfigService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class MaintenanceFilter extends OncePerRequestFilter {

    private final SystemConfigService systemConfigService;

    public MaintenanceFilter(SystemConfigService systemConfigService) {
        this.systemConfigService = systemConfigService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. If not maintenance mode, proceed
        if (!systemConfigService.isMaintenanceMode()) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Allow public auth/health endpoints
        String path = request.getRequestURI();
        if (path.startsWith("/api/v1/auth/") || path.startsWith("/api/v1/public/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Allow Admin users
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            filterChain.doFilter(request, response);
            return;
        }

        // 4. Block others
        response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"System is currently in maintenance mode. Please try again later.\", \"code\": \"MAINTENANCE\"}");
    }
}
