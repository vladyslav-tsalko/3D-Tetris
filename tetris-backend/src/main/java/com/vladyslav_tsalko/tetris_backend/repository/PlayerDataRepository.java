package com.vladyslav_tsalko.tetris_backend.repository;

import com.vladyslav_tsalko.tetris_backend.entity.PlayerData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerDataRepository extends JpaRepository<PlayerData, Long> {
    Optional<PlayerData> findByUsername(String username);
}