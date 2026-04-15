package com.example.demo.repository;

import com.example.demo.model.SuspiciousActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SuspiciousActivityRepository extends JpaRepository<SuspiciousActivity, UUID> {
}
