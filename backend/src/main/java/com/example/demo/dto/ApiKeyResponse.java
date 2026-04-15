package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ApiKeyResponse {
    private UUID id;
    private String rawKey; // Will only be populated ONCE during creation
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private boolean revoked;
}
