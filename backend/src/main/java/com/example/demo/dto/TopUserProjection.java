package com.example.demo.dto;

import java.util.UUID;

public interface TopUserProjection {
    UUID getUserId();
    long getRequestCount();
}
