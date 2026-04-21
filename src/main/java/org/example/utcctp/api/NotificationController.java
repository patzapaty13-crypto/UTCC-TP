package org.example.utcctp.api;

import org.example.utcctp.api.dto.NotificationResponse;
import org.example.utcctp.notification.NotificationService;
import org.example.utcctp.user.CurrentUserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    private final CurrentUserService currentUserService;

    public NotificationController(NotificationService notificationService, CurrentUserService currentUserService) {
        this.notificationService = notificationService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<NotificationResponse> listNotifications() {
        return notificationService.listForUser(currentUserService.requireUser());
    }

    @PutMapping("/{id}/read")
    public NotificationResponse markRead(@PathVariable UUID id) {
        return notificationService.markRead(id, currentUserService.requireUser());
    }

    @GetMapping("/stream")
    public SseEmitter stream() {
        return notificationService.subscribe(currentUserService.requireUser());
    }
}
