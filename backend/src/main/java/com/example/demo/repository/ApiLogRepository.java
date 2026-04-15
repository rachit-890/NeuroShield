package com.example.demo.repository;

import com.example.demo.dto.AnalyticsSummaryResponse;
import com.example.demo.dto.SuspiciousUserProjection;
import com.example.demo.dto.TopUserProjection;
import com.example.demo.model.ApiLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.UUID;

public interface ApiLogRepository extends JpaRepository<ApiLog, UUID> {

    @Query("SELECT new com.example.demo.dto.AnalyticsSummaryResponse(" +
           "COUNT(l), " +
           "SUM(CASE WHEN l.status >= 200 AND l.status < 300 THEN 1L ELSE 0L END), " +
           "SUM(CASE WHEN l.status >= 400 THEN 1L ELSE 0L END), " +
           "0.0) " +
           "FROM ApiLog l WHERE l.timestamp BETWEEN :fromDate AND :toDate")
    AnalyticsSummaryResponse getAnalyticsSummary(@Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);

    @Query("SELECT l.userId as userId, COUNT(l) as requestCount " +
           "FROM ApiLog l " +
           "WHERE l.timestamp BETWEEN :fromDate AND :toDate AND l.userId IS NOT NULL " +
           "GROUP BY l.userId " +
           "ORDER BY COUNT(l) DESC")
    Page<TopUserProjection> getTopUsers(@Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate, Pageable pageable);

    @Query("SELECT l.userId as userId, COUNT(l) as totalRequests, " +
           "SUM(CASE WHEN l.status >= 400 THEN 1L ELSE 0L END) as failedRequests " +
           "FROM ApiLog l " +
           "WHERE l.timestamp BETWEEN :fromDate AND :toDate AND l.userId IS NOT NULL " +
           "GROUP BY l.userId " +
           "HAVING COUNT(l) >= :minRequests OR " +
           "(SUM(CASE WHEN l.status >= 400 THEN 1.0 ELSE 0.0 END) / COUNT(l)) >= :errorThreshold")
    Page<SuspiciousUserProjection> getSuspiciousUsers(
            @Param("fromDate") LocalDateTime fromDate, 
            @Param("toDate") LocalDateTime toDate, 
            @Param("minRequests") long minRequests, 
            @Param("errorThreshold") double errorThreshold, 
            Pageable pageable);

    @Query("SELECT COUNT(l) FROM ApiLog l WHERE l.userId = :userId AND l.timestamp >= :since")
    long countByUserIdAndTimestampAfter(@Param("userId") UUID userId, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(l) FROM ApiLog l WHERE l.userId = :userId AND l.status >= 400 AND l.timestamp >= :since")
    long countErrorsByUserIdAndTimestampAfter(@Param("userId") UUID userId, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(DISTINCT l.ipAddress) FROM ApiLog l WHERE l.userId = :userId AND l.timestamp >= :since")
    long countIpDiversityByUserIdAndTimestampAfter(@Param("userId") UUID userId, @Param("since") LocalDateTime since);
}
