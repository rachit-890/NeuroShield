package com.example.demo.repository;

import com.example.demo.model.RefreshToken;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);
    @org.springframework.data.jpa.repository.Query("SELECT r FROM RefreshToken r WHERE r.user.id = :userId")
    Optional<RefreshToken> findByUserId(UUID userId);
    void deleteByUser(User user);
}
