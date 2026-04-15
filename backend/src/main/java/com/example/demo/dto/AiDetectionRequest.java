package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AiDetectionRequest {
    private int requestCount;
    private double errorRate;
    private int ipDiversity;
}
