package com.example.demo.controller;

import com.example.demo.dto.ApiKeyResponse;
import com.example.demo.model.User;
import com.example.demo.service.ApiKeyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/keys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    @PostMapping
    public ResponseEntity<ApiKeyResponse> generateKey(@AuthenticationPrincipal User user) {
        // For now, no expiration set. Could be parameterized.
        return ResponseEntity.ok(apiKeyService.generateApiKey(user, null));
    }

    @GetMapping
    public ResponseEntity<List<ApiKeyResponse>> getKeys(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(apiKeyService.getUserApiKeys(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> revokeKey(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        apiKeyService.revokeApiKey(id, user);
        return ResponseEntity.noContent().build();
    }
}
