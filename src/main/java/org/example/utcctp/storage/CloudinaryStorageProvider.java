package org.example.utcctp.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.security.MessageDigest;
import java.util.Map;

/**
 * Unsigned upload to Cloudinary (configure an upload preset).
 * Docs: https://cloudinary.com/documentation/upload_images#unsigned_upload
 *
 * Env vars:
 *   CLOUDINARY_CLOUD_NAME      e.g. "my-cloud"
 *   CLOUDINARY_UPLOAD_PRESET   e.g. "utcctp_unsigned"
 *   CLOUDINARY_API_KEY         (optional, only required if you prefer signed uploads)
 *   CLOUDINARY_API_SECRET      (optional, only required for signed uploads)
 *
 * For production we recommend signed uploads (set the two secrets above).
 */
@Component
public class CloudinaryStorageProvider implements StorageProvider {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String cloudName;
    private final String uploadPreset;
    private final String apiKey;
    private final String apiSecret;

    public CloudinaryStorageProvider(
            @Value("${app.cloudinary.cloudName:${CLOUDINARY_CLOUD_NAME:}}") String cloudName,
            @Value("${app.cloudinary.uploadPreset:${CLOUDINARY_UPLOAD_PRESET:}}") String uploadPreset,
            @Value("${app.cloudinary.apiKey:${CLOUDINARY_API_KEY:}}") String apiKey,
            @Value("${app.cloudinary.apiSecret:${CLOUDINARY_API_SECRET:}}") String apiSecret
    ) {
        this.cloudName = cloudName;
        this.uploadPreset = uploadPreset;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }

    @Override
    public String name() {
        return "CLOUDINARY";
    }

    public boolean isConfigured() {
        return cloudName != null && !cloudName.isBlank()
                && ((uploadPreset != null && !uploadPreset.isBlank())
                    || (apiKey != null && !apiKey.isBlank() && apiSecret != null && !apiSecret.isBlank()));
    }

    @Override
    public StoredObject store(MultipartFile file, String storedName) {
        if (!isConfigured()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Cloudinary not configured");
        }
        String url = "https://api.cloudinary.com/v1_1/" + cloudName + "/auto/upload";

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", toResource(file, storedName));
        body.add("public_id", stripExtension(storedName));

        if (uploadPreset != null && !uploadPreset.isBlank()) {
            body.add("upload_preset", uploadPreset);
        } else {
            long timestamp = System.currentTimeMillis() / 1000L;
            String signature = signUpload(Map.of(
                    "public_id", stripExtension(storedName),
                    "timestamp", String.valueOf(timestamp)
            ), apiSecret);
            body.add("api_key", apiKey);
            body.add("timestamp", String.valueOf(timestamp));
            body.add("signature", signature);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        try {
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(url, new HttpEntity<>(body, headers), Map.class);
            Map<?, ?> payload = response.getBody();
            if (payload == null) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Empty response from Cloudinary");
            }
            String secureUrl = (String) payload.get("secure_url");
            String publicId = (String) payload.get("public_id");
            return new StoredObject("CLOUDINARY", secureUrl, secureUrl, publicId);
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Cloudinary upload failed: " + ex.getMessage());
        }
    }

    @Override
    public Resource load(String storagePath) {
        // Cloudinary files are served directly via public_url; backend does not proxy.
        return null;
    }

    private static ByteArrayResource toResource(MultipartFile file, String storedName) {
        try {
            byte[] bytes = file.getBytes();
            return new ByteArrayResource(bytes) {
                @Override
                public String getFilename() {
                    return storedName;
                }

                @Override
                public long contentLength() {
                    return bytes.length;
                }
            };
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to read upload stream");
        }
    }

    private static String stripExtension(String name) {
        int idx = name.lastIndexOf('.');
        return idx >= 0 ? name.substring(0, idx) : name;
    }

    private static String signUpload(Map<String, String> params, String secret) {
        String toSign = params.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> e.getKey() + "=" + e.getValue())
                .reduce((a, b) -> a + "&" + b)
                .orElse("") + secret;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] digest = md.digest(toSign.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}
