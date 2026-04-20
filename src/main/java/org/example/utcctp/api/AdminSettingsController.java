package org.example.utcctp.api;

import org.example.utcctp.config.SystemConfigService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/settings")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSettingsController {

    private final SystemConfigService systemConfigService;

    public AdminSettingsController(SystemConfigService systemConfigService) {
        this.systemConfigService = systemConfigService;
    }

    @GetMapping
    public Map<String, String> getSettings() {
        return systemConfigService.getAllSettings();
    }

    @PostMapping("/maintenance")
    public Map<String, Object> toggleMaintenance(@RequestBody Map<String, Boolean> payload) {
        boolean active = payload.getOrDefault("active", false);
        systemConfigService.toggleMaintenanceMode(active);
        return Map.of(
            "maintenanceMode", active,
            "message", active ? "System locked down." : "System back online."
        );
    }

    @PostMapping
    public void updateSetting(@RequestBody Map<String, String> payload) {
        String key = payload.get("key");
        String value = payload.get("value");
        String desc = payload.get("description");
        if (key != null && value != null) {
            systemConfigService.set(key, value, desc);
        }
    }
}
