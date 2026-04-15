package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "suspicious_activities", indexes = {
    @Index(name = "idx_suspicious_userid", columnList = "userId"),
    @Index(name = "idx_suspicious_timestamp", columnList = "timestamp")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuspiciousActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID userId; // Nullable for IP-only activity

    @Column(nullable = false)
    private String reason;

    @Column(nullable = false)
    private double riskScore;

    private String ipAddress;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;
}
