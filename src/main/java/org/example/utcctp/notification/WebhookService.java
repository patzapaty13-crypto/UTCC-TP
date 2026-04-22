package org.example.utcctp.notification;

import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
public class WebhookService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final ExecutorService executorService = Executors.newCachedThreadPool();

    @Value("${app.webhook.n8n-url:}")
    private String n8nWebhookUrl;

    @Value("${app.webhook.n8n.app-status:}")
    private String appStatusUrl;

    @Value("${app.webhook.n8n.resume-screening:}")
    private String resumeScreeningUrl;

    @Value("${app.webhook.n8n.interview-scheduled:}")
    private String interviewScheduledUrl;

    @Value("${app.webhook.n8n.security-alert:}")
    private String securityAlertUrl;

    @Value("${app.webhook.n8n.forgot-password:}")
    private String forgotPasswordUrl;

    @Value("${app.webhook.n8n.event-router:}")
    private String eventRouterUrl;

    /** Legacy generic status change (kept for backward compatibility). */
    public void sendStatusChange(Map<String, Object> payload) {
        postAsync(n8nWebhookUrl, payload, "status-change");
    }

    /** OTP request (existing flow). */
    public void sendOtp(String email, String code) {
        Map<String, Object> payload = Map.of(
                "type", "OTP_REQUEST",
                "email", email,
                "code", code,
                "timestamp", System.currentTimeMillis()
        );
        postAsync(n8nWebhookUrl, payload, "otp");
    }

    /** Rich application-status event for the Application Status Pipeline workflow. */
    public void sendApplicationStatusChange(Map<String, Object> payload) {
        postAsync(appStatusUrl, payload, "app-status");
    }

    /** Triggers AI resume screening. */
    public void sendResumeForScreening(Map<String, Object> payload) {
        postAsync(resumeScreeningUrl, payload, "resume-screening");
    }

    /** Notifies n8n that an interview was scheduled. */
    public void sendInterviewScheduled(Map<String, Object> payload) {
        postAsync(interviewScheduledUrl, payload, "interview-scheduled");
    }

    /** Sends a security alert event (account locked / password changed / suspicious login). */
    public void sendSecurityAlert(Map<String, Object> payload) {
        postAsync(securityAlertUrl, payload, "security-alert");
    }

    /** Sends forgot-password OTP event. */
    public void sendForgotPassword(Map<String, Object> payload) {
        postAsync(forgotPasswordUrl, payload, "forgot-password");
    }

    /** Sends a generic event to the Event Router workflow. */
    public void sendEvent(Map<String, Object> payload) {
        postAsync(eventRouterUrl, payload, "event-router");
    }

    private void postAsync(String url, Map<String, Object> payload, String tag) {
        if (url == null || url.isEmpty()) {
            System.out.println("[WebhookService] " + tag + ": URL not configured, skipping.");
            return;
        }
        executorService.submit(() -> {
            try {
                restTemplate.postForEntity(url, payload, String.class);
                System.out.println("[WebhookService] " + tag + " event dispatched to " + url);
            } catch (Exception e) {
                System.err.println("[WebhookService] Failed " + tag + " webhook: " + e.getMessage());
            }
        });
    }

    @PreDestroy
    public void shutdown() {
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(5, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}
