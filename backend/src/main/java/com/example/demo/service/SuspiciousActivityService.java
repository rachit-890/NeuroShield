package com.example.demo.service;

import com.example.demo.dto.AiDetectionRequest;
import com.example.demo.dto.AiDetectionResponse;
import com.example.demo.model.SuspiciousActivity;
import com.example.demo.repository.ApiLogRepository;
import com.example.demo.repository.SuspiciousActivityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SuspiciousActivityService {

    private final SuspiciousActivityRepository suspiciousActivityRepository;
    private final ApiLogRepository apiLogRepository;
    private final RestTemplate restTemplate;

    @Value("${app.ai-service.url}")
    private String aiServiceUrl;

    @Async("logExecutor")
    public void detectAnomalies(UUID userId, String ipAddress) {
        if (userId == null && ipAddress == null) return;

        try {
            // Fetch real stats for the user in the last 10 minutes
            LocalDateTime since = LocalDateTime.now().minusMinutes(10);
            long count = apiLogRepository.countByUserIdAndTimestampAfter(userId, since);
            long errors = apiLogRepository.countErrorsByUserIdAndTimestampAfter(userId, since);
            long ips = apiLogRepository.countIpDiversityByUserIdAndTimestampAfter(userId, since);

            int requestCount = (int) count;
            double errorRate = count > 0 ? (double) errors / count : 0.0;
            int ipDiversity = (int) ips;

            // Call AI Microservice
            AiDetectionRequest aiRequest = AiDetectionRequest.builder()
                    .requestCount(requestCount)
                    .errorRate(errorRate)
                    .ipDiversity(ipDiversity)
                    .build();

            AiDetectionResponse aiResponse = restTemplate.postForObject(
                    aiServiceUrl + "/detect", aiRequest, AiDetectionResponse.class);

            if (aiResponse != null && aiResponse.isSuspicious()) {
                logSuspiciousEvent(
                    userId, 
                    ipAddress, 
                    "AI Detected Anomaly: confidence=" + aiResponse.getConfidence(), 
                    aiResponse.getConfidence() * 100
                );
            }

        } catch (Exception e) {
            log.error("AI Anomaly detection failed for user {}: {}", userId, e.getMessage());
        }
    }

    @Async("logExecutor")
    public void logSuspiciousEvent(UUID userId, String ip, String reason, double score) {
        SuspiciousActivity activity = SuspiciousActivity.builder()
                .userId(userId)
                .ipAddress(ip)
                .reason(reason)
                .riskScore(score)
                .build();
        suspiciousActivityRepository.save(activity);
    }
}
