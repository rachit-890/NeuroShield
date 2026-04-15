package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "api_logs", indexes = {
    @Index(name = "idx_apilog_userid", columnList = "userId"),
    @Index(name = "idx_apilog_timestamp", columnList = "timestamp"),
    @Index(name = "idx_apilog_endpoint", columnList = "endpoint")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID userId; // Nullable if unauthenticated

    private UUID apiKeyId; // Nullable if JWT or unauthenticated

    @Column(nullable = false)
    private String endpoint;

    @Column(nullable = false)
    private String method;

    @Column(nullable = false)
    private int status;

    @Column(nullable = false)
    private long responseTime;

    private String ipAddress;
    
    private String userAgent;
    
    @Column(unique = true)
    private String requestId;
    
    // For storing captured exception messages when HTTP Status is 500+
    @Column(length = 1000)
    private String errorMessage;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    private String logLevel; // "INFO", "WARN", "ERROR"
}
