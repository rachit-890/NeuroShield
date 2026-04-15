package com.example.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RateLimiterService {

    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * Sliding Window Rate Limiter using Redis ZSET
     * @param key Redis key for identifying the client/endpoint
     * @param limit Max requests allowed in the window
     * @param windowSeconds Window size in seconds
     * @return true if request is allowed, false otherwise
     */
    public boolean isAllowed(String key, int limit, int windowSeconds) {
        long now = Instant.now().toEpochMilli();
        long windowStart = now - (windowSeconds * 1000L);
        
        String fullKey = "rate_limit:" + key;

        // Atomic operation using Lua script would be better for high concurrency, 
        // but for this phase we'll use standard operations.
        
        // 1. Remove old timestamps outside the window
        redisTemplate.opsForZSet().removeRangeByScore(fullKey, 0, windowStart);
        
        // 2. Count current timestamps in the window
        Long currentCount = redisTemplate.opsForZSet().zCard(fullKey);
        
        if (currentCount != null && currentCount >= limit) {
            return false;
        }

        // 3. Add current timestamp
        redisTemplate.opsForZSet().add(fullKey, String.valueOf(now), now);
        
        // 4. Set expiration to clean up unused keys
        redisTemplate.expire(fullKey, windowSeconds, TimeUnit.SECONDS);
        
        return true;
    }
}
