package com.example.demo.dto;

import java.util.UUID;

public interface SuspiciousUserProjection {
    UUID getUserId();
    long getTotalRequests();
    long getFailedRequests();
}
