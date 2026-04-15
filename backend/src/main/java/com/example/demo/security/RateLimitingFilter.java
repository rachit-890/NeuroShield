package com.example.demo.security;

import com.example.demo.service.RateLimiterService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 5) // Run after Logging (1) and Security Filters 
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RateLimiterService rateLimiterService;
    private final com.example.demo.service.SuspiciousActivityService suspiciousActivityService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // IP Rate Limit (Global protection)
        String ip = request.getRemoteAddr();
        if (!rateLimiterService.isAllowed("ip:" + ip, 100, 60)) {
            suspiciousActivityService.logSuspiciousEvent(null, ip, "Global IP rate limit exceeded", 20.0);
            handleLimitExceeded(response, "IP rate limit exceeded");
            return;
        }

        // Context-based Rate Limit (User or API Key)
        UUID userId = (UUID) request.getAttribute("AUTHENTICATED_USER_ID");
        UUID apiKeyId = (UUID) request.getAttribute("USED_API_KEY_ID");

        if (userId != null) {
            if (!rateLimiterService.isAllowed("user:" + userId, 100, 60)) {
                suspiciousActivityService.logSuspiciousEvent(userId, ip, "User rate limit exceeded", 30.0);
                handleLimitExceeded(response, "User rate limit exceeded");
                return;
            }
        } else if (apiKeyId != null) {
            if (!rateLimiterService.isAllowed("apk:" + apiKeyId, 100, 60)) {
                suspiciousActivityService.logSuspiciousEvent(userId, ip, "API Key rate limit exceeded", 30.0);
                handleLimitExceeded(response, "API Key rate limit exceeded");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private void handleLimitExceeded(HttpServletResponse response, String message) throws IOException {
        response.setStatus(429); // Too Many Requests
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }
}
