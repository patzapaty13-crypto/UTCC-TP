package org.example.utcctp.config;

import org.example.utcctp.model.SystemSetting;
import org.example.utcctp.repository.SystemSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Transactional
public class SystemConfigService {

    private final SystemSettingRepository repository;
    private final Map<String, String> cache = new ConcurrentHashMap<>();

    public SystemConfigService(SystemSettingRepository repository) {
        this.repository = repository;
    }

    public String get(String key, String defaultValue) {
        return cache.computeIfAbsent(key, k -> 
            repository.findById(k)
                .map(SystemSetting::getValue)
                .orElse(defaultValue)
        );
    }

    public boolean isMaintenanceMode() {
        return "true".equalsIgnoreCase(get("maintenance_mode", "false"));
    }

    public void set(String key, String value, String description) {
        SystemSetting setting = repository.findById(key)
            .orElse(new SystemSetting(key, value, description));
        setting.setValue(value);
        if (description != null) {
            setting.setDescription(description);
        }
        repository.save(setting);
        cache.put(key, value);
    }

    public void toggleMaintenanceMode(boolean active) {
        set("maintenance_mode", String.valueOf(active), "System-wide lockdown/maintenance mode");
    }

    public Map<String, String> getAllSettings() {
        Map<String, String> settings = new HashMap<>();
        repository.findAll().forEach(s -> settings.put(s.getKey(), s.getValue()));
        return settings;
    }
}
