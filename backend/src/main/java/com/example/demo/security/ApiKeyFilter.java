package com.example.demo.security;

import com.example.demo.model.ApiKey;
import com.example.demo.service.ApiKeyService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ApiKeyFilter extends OncePerRequestFilter {

    private final ApiKeyService apiKeyService;
    private static final String API_KEY_HEADER = "X-API-KEY";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String rawKey = request.getHeader(API_KEY_HEADER);

        if (rawKey != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                ApiKey apiKey = apiKeyService.validateKey(rawKey);
                
                // If valid, explicitly authenticate the user for this request statelessly
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        apiKey.getUser(), null, apiKey.getUser().getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authToken);
                
                request.setAttribute("USED_API_KEY_ID", apiKey.getId());
                request.setAttribute("AUTHENTICATED_USER_ID", apiKey.getUser().getId());
            } catch (Exception e) {
                // Return 401 Unauthorized immediately if API key fails validation
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
                return;
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
