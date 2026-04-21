package org.example.utcctp.notification;

import org.example.utcctp.api.dto.NotificationResponse;
import org.example.utcctp.model.Notification;
import org.example.utcctp.model.NotificationStatus;
import org.example.utcctp.model.NotificationType;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.NotificationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final Map<UUID, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public NotificationResponse notifyUser(User user, String title, String message, NotificationType type) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        Notification saved = notificationRepository.save(notification);
        sendToEmitters(user.getId(), saved);
        return mapNotification(saved);
    }

    public List<NotificationResponse> listForUser(User user) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapNotification)
                .toList();
    }

    public NotificationResponse markRead(UUID id, User user) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
        notification.setStatus(NotificationStatus.READ);
        notification.setReadAt(Instant.now());
        return mapNotification(notificationRepository.save(notification));
    }

    public SseEmitter subscribe(User user) {
        SseEmitter emitter = new SseEmitter(0L);
        emitters.computeIfAbsent(user.getId(), key -> new ArrayList<>()).add(emitter);
        emitter.onCompletion(() -> removeEmitter(user.getId(), emitter));
        emitter.onTimeout(() -> removeEmitter(user.getId(), emitter));
        return emitter;
    }

    private void sendToEmitters(UUID userId, Notification notification) {
        List<SseEmitter> list = emitters.get(userId);
        if (list == null) {
            return;
        }
        List<SseEmitter> dead = new ArrayList<>();
        for (SseEmitter emitter : list) {
            try {
                emitter.send(SseEmitter.event().name("notification").data(mapNotification(notification)));
            } catch (IOException ex) {
                dead.add(emitter);
            }
        }
        dead.forEach(item -> removeEmitter(userId, item));
    }

    private void removeEmitter(UUID userId, SseEmitter emitter) {
        List<SseEmitter> list = emitters.get(userId);
        if (list != null) {
            list.remove(emitter);
        }
    }

    private NotificationResponse mapNotification(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType().name(),
                notification.getStatus().name(),
                notification.getCreatedAt()
        );
    }
}
