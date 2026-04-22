package org.example.utcctp.notification;

import org.example.utcctp.api.dto.NotificationResponse;
import org.example.utcctp.model.Notification;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationService {
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final NotificationRepository notificationRepository;
    private final Map<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> listForUser(User user) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return notifications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public NotificationResponse markRead(UUID notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));
        
        if (!notification.getUser().getId().equals(user.getId())) {
            log.warn("Unauthorized access: User {} tried to mark notification {} as read", 
                user.getId(), notificationId);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized");
        }
        
        notification.setIsRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    public SseEmitter subscribe(UUID userId) {
        SseEmitter emitter = new SseEmitter(0L);
        emitters.put(userId, emitter);
        
        emitter.onCompletion(() -> {
            emitters.remove(userId);
            log.info("SSE emitter completed for user {}", userId);
        });
        
        emitter.onTimeout(() -> {
            emitters.remove(userId);
            log.info("SSE emitter timed out for user {}", userId);
        });
        
        emitter.onError((e) -> {
            emitters.remove(userId);
            log.error("SSE emitter error for user {}", userId, e);
        });
        
        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("subscribed"));
        } catch (Exception e) {
            log.warn("Failed to send initial SSE event to user {}", userId, e);
        }
        return emitter;
    }

    @Transactional(readOnly = true)
    public List<Notification> getUserNotifications(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotifications(UUID userId) {
        return notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
    }

    @Transactional(readOnly = true)
    public Long getUnreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndIsRead(userId, false);
    }

    public void markAllAsRead(UUID userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
        log.info("Marked {} notifications as read for user {}", notifications.size(), userId);
    }

    public void deleteNotification(UUID notificationId) {
        notificationRepository.deleteById(notificationId);
        log.info("Deleted notification {}", notificationId);
    }

    public void deleteAllUserNotifications(UUID userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notificationRepository.deleteAll(notifications);
        log.info("Deleted {} notifications for user {}", notifications.size(), userId);
    }

    public void createNotification(User user, Notification.NotificationType type, String title, String message, String link) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setLink(link);
        notificationRepository.save(notification);
        log.info("Created notification for user {}: {} - {}", user.getId(), title, type);
        
        // Send SSE event to user
        SseEmitter emitter = emitters.get(user.getId());
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("notification")
                        .data(Map.of(
                                "type", "notification",
                                "id", notification.getId().toString(),
                                "title", title,
                                "message", message
                        )));
            } catch (IOException e) {
                log.error("Failed to send SSE event to user {}", user.getId(), e);
                emitters.remove(user.getId());
            }
        }
    }

    private NotificationResponse toResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setType(notification.getType().name());
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setLink(notification.getLink());
        response.setRead(notification.getIsRead());
        response.setCreatedAt(notification.getCreatedAt());
        return response;
    }
}
