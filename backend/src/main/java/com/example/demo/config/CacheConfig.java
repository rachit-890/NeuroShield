package com.example.demo.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("apiKeys", "analyticsSummary", "topUsers", "suspiciousUsers");
        
        // Define default settings for apiKeys
        cacheManager.registerCustomCache("apiKeys", Caffeine.newBuilder()
                .expireAfterWrite(5, TimeUnit.MINUTES)
                .maximumSize(1000)
                .build());

        // Define short-lived settings for analytics
        Caffeine<Object, Object> analyticsCaffeineBuilder = Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.MINUTES)
                .maximumSize(100);
        
        cacheManager.registerCustomCache("analyticsSummary", analyticsCaffeineBuilder.build());
        cacheManager.registerCustomCache("topUsers", analyticsCaffeineBuilder.build());
        cacheManager.registerCustomCache("suspiciousUsers", analyticsCaffeineBuilder.build());

        return cacheManager;
    }
}
