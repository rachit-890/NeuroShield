package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsSummaryResponse {
    private long totalRequests;
    private long successRequests;
    private long failedRequests;
    private double errorRate;
}
