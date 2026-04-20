package org.example.utcctp.notification;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class WebhookService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final ExecutorService executorService = Executors.newCachedThreadPool();

    @Value("${app.webhook.n8n-url:}")
    private String n8nWebhookUrl;

    public void sendStatusChange(Map<String, Object> payload) {
        if (n8nWebhookUrl == null || n8nWebhookUrl.isEmpty()) {
            System.out.println("Webhook URL not configured, skipping status change event.");
            return;
        }

        // Send asynchronously to not block the main transaction
        executorService.submit(() -> {
            try {
                restTemplate.postForEntity(n8nWebhookUrl, payload, String.class);
            } catch (Exception e) {
                System.err.println("Failed to send webhook to n8n: " + e.getMessage());
            }
        });
    }
}
