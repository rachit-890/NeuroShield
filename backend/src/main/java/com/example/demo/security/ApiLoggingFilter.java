package com.example.demo.security;

import com.example.demo.service.ApiLoggingService;
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
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class ApiLoggingFilter extends OncePerRequestFilter {

    private final ApiLoggingService apiLoggingService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        long startTime = System.currentTimeMillis();

        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;

            // IP Extraction
            String ipAddress = request.getHeader("X-Forwarded-For");
            if (ipAddress == null || ipAddress.isEmpty()) {
                ipAddress = request.getRemoteAddr();
            }

            // Extract Tracing & Agent Info
            String requestId = request.getHeader("X-Request-Id");
            if (requestId == null || requestId.isEmpty()) {
                requestId = UUID.randomUUID().toString();
            }
            // Put it down the response if possible (though the response might be flushed)
            if (!response.isCommitted()) response.setHeader("X-Request-Id", requestId);
            
            String userAgent = request.getHeader("User-Agent");
            String errorMessage = (String) request.getAttribute("ERROR_MESSAGE");

            // User / API Key Context extraction (populated by security filters down the chain)
            UUID userId = null;
            UUID apiKeyId = null;

            if (request.getAttribute("AUTHENTICATED_USER_ID") != null) {
                userId = (UUID) request.getAttribute("AUTHENTICATED_USER_ID");
            }
            if (request.getAttribute("USED_API_KEY_ID") != null) {
                apiKeyId = (UUID) request.getAttribute("USED_API_KEY_ID");
            }

            apiLoggingService.saveLogAsync(
                    userId,
                    apiKeyId,
                    request.getRequestURI(),
                    request.getMethod(),
                    response.getStatus(),
                    duration,
                    ipAddress,
                    userAgent,
                    requestId,
                    errorMessage
            );
        }
    }
}
