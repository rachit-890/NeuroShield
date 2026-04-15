package com.example.demo.service;

import com.example.demo.dto.AnalyticsSummaryResponse;
import com.example.demo.dto.SuspiciousUserProjection;
import com.example.demo.dto.SuspiciousUserResponse;
import com.example.demo.dto.TopUserProjection;
import com.example.demo.repository.ApiLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ApiLogRepository apiLogRepository;

    @Cacheable(value = "analyticsSummary", key = "{#from, #to}")
    public AnalyticsSummaryResponse getSummary(LocalDateTime from, LocalDateTime to) {
        AnalyticsSummaryResponse summary = apiLogRepository.getAnalyticsSummary(from, to);
        
        if (summary.getTotalRequests() > 0) {
            double errorRate = ((double) summary.getFailedRequests() / summary.getTotalRequests()) * 100;
            summary.setErrorRate(Math.round(errorRate * 100.0) / 100.0);
        }
        
        return summary;
    }

    @Cacheable(value = "topUsers", key = "{#from, #to, #page, #size}")
    public Page<TopUserProjection> getTopUsers(LocalDateTime from, LocalDateTime to, int page, int size) {
        return apiLogRepository.getTopUsers(from, to, PageRequest.of(page, size));
    }

    @Cacheable(value = "suspiciousUsers", key = "{#from, #to, #page, #size}")
    public List<SuspiciousUserResponse> getSuspiciousUsers(LocalDateTime from, LocalDateTime to, int page, int size) {
        // Thresholds: > 1000 requests OR > 20% error rate
        long minRequests = 1000;
        double errorThreshold = 0.20;

        Page<SuspiciousUserProjection> projections = apiLogRepository.getSuspiciousUsers(
                from, to, minRequests, errorThreshold, PageRequest.of(page, size));

        return projections.getContent().stream()
                .map(p -> {
                    double errorRate = (double) p.getFailedRequests() / p.getTotalRequests();
                    double riskScore = calculateRiskScore(p.getTotalRequests(), errorRate, minRequests, errorThreshold);
                    String reason = determineReason(p.getTotalRequests(), errorRate, minRequests, errorThreshold);

                    return SuspiciousUserResponse.builder()
                            .userId(p.getUserId())
                            .riskScore(riskScore)
                            .reason(reason)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private double calculateRiskScore(long total, double errorRate, long minReq, double errThresh) {
        double score = 0;
        if (total > minReq) score += Math.min(50, (double) (total - minReq) / 100);
        if (errorRate > errThresh) score += Math.min(50, (errorRate - errThresh) * 100);
        return Math.round(score * 100.0) / 100.0;
    }

    private String determineReason(long total, double errorRate, long minReq, double errThresh) {
        if (total > minReq && errorRate > errThresh) return "High volume and high error rate";
        if (total > minReq) return "Abnormally high request volume";
        if (errorRate > errThresh) return "Excessive API error rate";
        return "Unknown anomaly";
    }
}
