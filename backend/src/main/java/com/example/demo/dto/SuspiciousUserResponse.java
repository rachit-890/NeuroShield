package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class SuspiciousUserResponse {
    private UUID userId;
    private double riskScore;
    private String reason;
}
