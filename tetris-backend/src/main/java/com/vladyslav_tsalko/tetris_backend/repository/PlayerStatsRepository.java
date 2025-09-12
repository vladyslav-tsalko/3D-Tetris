package com.vladyslav_tsalko.tetris_backend.repository;

import com.vladyslav_tsalko.tetris_backend.entity.PlayerStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerStatsRepository extends JpaRepository<PlayerStats, Long> {
    Optional<PlayerStats> findByPlayerDataUserId(Long playerId);
    Optional<PlayerStats> findByPlayerDataUsername(String username);
}