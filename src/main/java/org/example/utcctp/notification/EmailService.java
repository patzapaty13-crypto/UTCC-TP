package org.example.utcctp.notification;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Transactional email via Resend (https://resend.com/docs/api-reference/emails/send-email).
 *
 * Required env vars for production:
 *   RESEND_API_KEY      - Secret key, e.g. "re_xxx"
 *   MAIL_FROM           - From address, e.g. "UTCC-TP <noreply@yourdomain.com>"
 *
 * Without RESEND_API_KEY the service becomes a no-op (logs only) — safe for local/dev.
 */
@Service
public class EmailService {
    private static final String RESEND_URL = "https://api.resend.com/emails";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ExecutorService executor = Executors.newCachedThreadPool();

    private final String apiKey;
    private final String from;

    public EmailService(
            @Value("${app.mail.resend.apiKey:${RESEND_API_KEY:}}") String apiKey,
            @Value("${app.mail.from:${MAIL_FROM:UTCC-TP <onboarding@resend.dev>}}") String from
    ) {
        this.apiKey = apiKey;
        this.from = from;
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    public void sendAsync(String toEmail, String subject, String htmlBody) {
        if (toEmail == null || toEmail.isBlank()) {
            return;
        }
        if (!isConfigured()) {
            System.out.println("[EmailService] (dry-run) to=" + toEmail + " subject=" + subject);
            return;
        }
        executor.submit(() -> {
            try {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(apiKey);

                Map<String, Object> body = Map.of(
                        "from", from,
                        "to", List.of(toEmail),
                        "subject", subject,
                        "html", htmlBody
                );
                restTemplate.postForEntity(RESEND_URL, new HttpEntity<>(body, headers), String.class);
            } catch (Exception ex) {
                System.err.println("[EmailService] Failed to send to " + toEmail + ": " + ex.getMessage());
            }
        });
    }
}
