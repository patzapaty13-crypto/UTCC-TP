package org.example.utcctp.api;

import org.example.utcctp.model.AuditLog;
import org.example.utcctp.repository.AuditLogRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/audit")
@PreAuthorize("hasRole('ADMIN')")
public class AuditController {
    private final AuditLogRepository repository;

    public AuditController(AuditLogRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Map<String, Object>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        int safeSize = Math.min(Math.max(size, 1), 200);
        return repository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, safeSize))
                .map(this::map)
                .getContent();
    }

    @GetMapping("/resource")
    public List<Map<String, Object>> byResource(
            @RequestParam String type,
            @RequestParam String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        int safeSize = Math.min(Math.max(size, 1), 200);
        return repository.findByResourceTypeAndResourceIdOrderByCreatedAtDesc(type, id, PageRequest.of(page, safeSize))
                .map(this::map)
                .getContent();
    }

    private Map<String, Object> map(AuditLog log) {
        java.util.LinkedHashMap<String, Object> m = new java.util.LinkedHashMap<>();
        m.put("id", log.getId());
        m.put("action", log.getAction());
        m.put("resourceType", log.getResourceType());
        m.put("resourceId", log.getResourceId());
        m.put("actorUsername", log.getActorUsername());
        m.put("metadata", log.getMetadataJson());
        m.put("ipAddress", log.getIpAddress());
        m.put("userAgent", log.getUserAgent());
        m.put("createdAt", log.getCreatedAt());
        return m;
    }
}
