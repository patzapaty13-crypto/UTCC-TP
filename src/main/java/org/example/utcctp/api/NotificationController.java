package org.example.utcctp.api;

import lombok.RequiredArgsConstructor;
import org.example.utcctp.model.Notification;
import org.example.utcctp.model.User;
import org.example.utcctp.notification.NotificationService;
import org.example.utcctp.security.CurrentUser;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {
    
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@CurrentUser User user) {
        List<Notification> notifications = notificationService.getUserNotifications(user.getId());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@CurrentUser User user) {
        List<Notification> notifications = notificationService.getUnreadNotifications(user.getId());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@CurrentUser User user) {
        Long count = notificationService.getUnreadCount(user.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id, @CurrentUser User user) {
        Notification notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(notification);
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@CurrentUser User user) {
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id, @CurrentUser User user) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllNotifications(@CurrentUser User user) {
        notificationService.deleteAllUserNotifications(user.getId());
        return ResponseEntity.noContent().build();
    }
}
