package com.example.demo.service;

import com.example.demo.model.ApiLog;
import com.example.demo.repository.ApiLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApiLoggingService {

    private final ApiLogRepository apiLogRepository;
    private final com.example.demo.service.SuspiciousActivityService suspiciousActivityService;

    @Async("logExecutor")
    public void saveLogAsync(UUID userId, UUID apiKeyId, String endpoint, String method, 
                             int status, long responseTime, String ipAddress, 
                             String userAgent, String requestId, String errorMessage) {
        try {
            String level = "INFO";
            if (status >= 500) level = "ERROR";
            else if (status >= 400) level = "WARN";

            ApiLog apiLog = ApiLog.builder()
                    .userId(userId)
                    .apiKeyId(apiKeyId)
                    .endpoint(endpoint)
                    .method(method)
                    .status(status)
                    .responseTime(responseTime)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .requestId(requestId)
                    .errorMessage(errorMessage)
                    .logLevel(level)
                    .build();

            apiLogRepository.save(apiLog);
            
            // Trigger anomaly detection after saving the log
            suspiciousActivityService.detectAnomalies(userId, ipAddress);
        } catch (Exception e) {
            // CRITICAL: Logging failure should NEVER break API flow. We trap it here.
            log.error("Failed to save API log asynchronously: {}", e.getMessage());
        }
    }
}
