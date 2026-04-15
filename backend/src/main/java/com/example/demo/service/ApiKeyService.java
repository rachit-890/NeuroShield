package com.example.demo.service;

import com.example.demo.dto.ApiKeyResponse;
import com.example.demo.model.ApiKey;
import com.example.demo.model.User;
import com.example.demo.repository.ApiKeyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${jwt.secret:defaultSecretForHmacShouldBeLong123456789}")
    private String hmacSecret;

    @Transactional
    public ApiKeyResponse generateApiKey(User user, LocalDateTime expiresAt) {
        if (apiKeyRepository.countByUserAndRevokedFalse(user) >= 5) {
            throw new RuntimeException("Maximum number of active API keys (5) reached.");
        }

        // Generate secure 32-byte raw key
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        String rawKey = "sk_" + Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        // Hash the key using HMAC-SHA256 for storage
        String keyHash = hashKey(rawKey);

        ApiKey apiKey = ApiKey.builder()
                .user(user)
                .keyHash(keyHash)
                .expiresAt(expiresAt)
                .revoked(false)
                .build();

        apiKey = apiKeyRepository.save(apiKey);

        // Return the DTO containing the raw key ONCE
        return ApiKeyResponse.builder()
                .id(apiKey.getId())
                .rawKey(rawKey)
                .createdAt(apiKey.getCreatedAt())
                .expiresAt(apiKey.getExpiresAt())
                .revoked(apiKey.isRevoked())
                .build();
    }

    @Transactional(readOnly = true)
    public List<ApiKeyResponse> getUserApiKeys(User user) {
        return apiKeyRepository.findAllByUser(user).stream()
                .map(key -> ApiKeyResponse.builder()
                        .id(key.getId())
                        .createdAt(key.getCreatedAt())
                        .expiresAt(key.getExpiresAt())
                        .revoked(key.isRevoked())
                        // We intentionally leave rawKey null
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(value = "apiKeys", allEntries = true)
    public void revokeApiKey(UUID keyId, User user) {
        ApiKey apiKey = apiKeyRepository.findById(keyId)
                .orElseThrow(() -> new RuntimeException("API Key not found"));

        if (!apiKey.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to revoke this API key");
        }

        apiKey.setRevoked(true);
        apiKeyRepository.save(apiKey);
    }

    @Transactional
    @Cacheable(value = "apiKeys", key = "#rawKey")
    public ApiKey validateKey(String rawKey) {
        String hash = hashKey(rawKey);
        ApiKey apiKey = apiKeyRepository.findByKeyHash(hash)
                .orElseThrow(() -> new RuntimeException("Invalid API Key"));

        if (apiKey.isRevoked()) {
            throw new RuntimeException("API Key is revoked");
        }
        
        if (apiKey.getExpiresAt() != null && apiKey.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("API Key has expired");
        }

        // We update lastUsedAt here. Because of Caffeine, this triggers once every 5 mins per active key.
        // This is a common performance tradeoff vs updating on every single request.
        apiKey.setLastUsedAt(LocalDateTime.now());
        apiKeyRepository.save(apiKey);

        return apiKey;
    }

    public String hashKey(String rawKey) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(hmacSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hmacBytes = mac.doFinal(rawKey.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hmacBytes);
        } catch (Exception e) {
            throw new RuntimeException("Error hashing API Key", e);
        }
    }
}
