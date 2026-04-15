package com.example.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        try {
            username = jwtUtil.extractUsername(jwt);
            
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Determine roles directly from JWT to skip unnecessary database round trips for roles
                java.util.List<String> roles = jwtUtil.extractClaim(jwt, claims -> claims.get("roles", java.util.List.class));
                Integer tokenVersion = jwtUtil.extractClaim(jwt, claims -> claims.get("tokenVersion", Integer.class));
                
                if (roles != null && tokenVersion != null && !jwtUtil.extractExpiration(jwt).before(new java.util.Date())) {
                    
                    // To instantly invalidate tokens, we must check the current version in the database.
                    // (This adds a DB hit, but preserves immediate revocation. In production, cache this in Redis)
                    com.example.demo.model.User dbUser = userDetailsService.loadUserByUsername(username) instanceof com.example.demo.model.User ? (com.example.demo.model.User) userDetailsService.loadUserByUsername(username) : null;
                    if(dbUser == null || !dbUser.getTokenVersion().equals(tokenVersion)){
                         filterChain.doFilter(request, response);
                         return;
                    }

                    java.util.List<org.springframework.security.core.authority.SimpleGrantedAuthority> authorities = 
                        roles.stream().map(org.springframework.security.core.authority.SimpleGrantedAuthority::new).toList();
                        
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            dbUser, null, authorities);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    
                    request.setAttribute("AUTHENTICATED_USER_ID", dbUser.getId());
                }
            }
        } catch (Exception e) {
            // Log security exceptions appropriately
        }
        
        filterChain.doFilter(request, response);
    }
}
