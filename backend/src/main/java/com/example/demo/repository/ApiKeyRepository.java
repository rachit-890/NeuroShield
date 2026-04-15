package com.example.demo.repository;

import com.example.demo.model.ApiKey;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApiKeyRepository extends JpaRepository<ApiKey, UUID> {
    @org.springframework.data.jpa.repository.Query("SELECT a FROM ApiKey a JOIN FETCH a.user u WHERE a.keyHash = :keyHash")
    Optional<ApiKey> findByKeyHash(String keyHash);
    List<ApiKey> findAllByUser(User user);
    long countByUserAndRevokedFalse(User user);
}
