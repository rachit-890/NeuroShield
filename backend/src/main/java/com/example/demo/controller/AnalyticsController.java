package com.example.demo.controller;

import com.example.demo.dto.AnalyticsSummaryResponse;
import com.example.demo.dto.SuspiciousUserResponse;
import com.example.demo.dto.TopUserProjection;
import com.example.demo.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // Analytics restricted to Admin
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryResponse> getSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        
        LocalDateTime fromDate = (from != null) ? from : LocalDateTime.now().minusDays(1);
        LocalDateTime toDate = (to != null) ? to : LocalDateTime.now();
        
        return ResponseEntity.ok(analyticsService.getSummary(fromDate, toDate));
    }

    @GetMapping("/top-users")
    public ResponseEntity<Page<TopUserProjection>> getTopUsers(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        LocalDateTime fromDate = (from != null) ? from : LocalDateTime.now().minusDays(7);
        LocalDateTime toDate = (to != null) ? to : LocalDateTime.now();

        return ResponseEntity.ok(analyticsService.getTopUsers(fromDate, toDate, page, size));
    }

    @GetMapping("/suspicious")
    public ResponseEntity<List<SuspiciousUserResponse>> getSuspicious(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        LocalDateTime fromDate = (from != null) ? from : LocalDateTime.now().minusDays(1);
        LocalDateTime toDate = (to != null) ? to : LocalDateTime.now();

        return ResponseEntity.ok(analyticsService.getSuspiciousUsers(fromDate, toDate, page, size));
    }
}
