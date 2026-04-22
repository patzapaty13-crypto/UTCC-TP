package org.example.utcctp.auth;

import java.util.List;
import java.util.UUID;

public record JwtPrincipal(UUID userId, String username, List<String> roles, UUID companyId) {
}
