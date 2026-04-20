package org.example.utcctp.audit;

import jakarta.servlet.http.HttpServletRequest;
import org.example.utcctp.model.AuditLog;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AuditService {
    private final AuditLogRepository repository;

    public AuditService(AuditLogRepository repository) {
        this.repository = repository;
    }

    public void record(User actor, String action, String resourceType, String resourceId, Map<String, Object> metadata) {
        AuditLog log = new AuditLog();
        if (actor != null) {
            log.setActorId(actor.getId());
            log.setActorUsername(actor.getUsername());
        }
        log.setAction(action);
        log.setResourceType(resourceType);
        log.setResourceId(resourceId);
        if (metadata != null && !metadata.isEmpty()) {
            log.setMetadataJson(toJson(metadata));
        }

        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                log.setIpAddress(clientIp(request));
                String ua = request.getHeader("User-Agent");
                log.setUserAgent(ua == null ? null : (ua.length() > 480 ? ua.substring(0, 480) : ua));
            }
        } catch (Exception ignored) {}

        try {
            repository.save(log);
        } catch (Exception ex) {
            // Never fail the main transaction because of audit logging.
            System.err.println("[AuditService] Failed to save audit log: " + ex.getMessage());
        }
    }

    private static String clientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static String toJson(Map<String, Object> map) {
        return "{" + map.entrySet().stream()
                .map(e -> "\"" + escape(e.getKey()) + "\":" + jsonValue(e.getValue()))
                .collect(Collectors.joining(",")) + "}";
    }

    private static String jsonValue(Object v) {
        if (v == null) return "null";
        if (v instanceof Number || v instanceof Boolean) return v.toString();
        return "\"" + escape(v.toString()) + "\"";
    }

    private static String escape(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
    }
}
