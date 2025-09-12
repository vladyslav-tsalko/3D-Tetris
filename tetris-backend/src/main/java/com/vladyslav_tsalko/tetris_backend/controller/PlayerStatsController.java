package com.vladyslav_tsalko.tetris_backend.controller;

import com.vladyslav_tsalko.tetris_backend.dto.UpdateMaxScoreRequestDTO;
import com.vladyslav_tsalko.tetris_backend.dto.PlayerStatsDTO;
import com.vladyslav_tsalko.tetris_backend.entity.PlayerStats;
import com.vladyslav_tsalko.tetris_backend.repository.PlayerStatsRepository;
import com.vladyslav_tsalko.tetris_backend.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/stats")
public class PlayerStatsController {

    private final PlayerStatsRepository playerStatsRepository;
    private final JwtService jwtService; // добавляем сервис для JWT

    public PlayerStatsController(PlayerStatsRepository playerStatsRepository, JwtService jwtService) {
        this.playerStatsRepository = playerStatsRepository;
        this.jwtService = jwtService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyStats(Authentication authentication) {
        String username = authentication.getName(); // username, который был в токене

        Optional<PlayerStats> playerStatsOpt = playerStatsRepository.findByPlayerDataUsername(username);

        if (playerStatsOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Stats not found"));
        }
        PlayerStats stats = playerStatsOpt.get();
        return ResponseEntity.ok(Map.of("score", stats.getMaxScore()));
    }

    @GetMapping("/top")
    public List<PlayerStatsDTO> getTopPlayers() {
        return playerStatsRepository.findTop10ByOrderByMaxScoreDesc()
                .stream()
                .map(stats -> new PlayerStatsDTO(
                        stats.getPlayerData().getUsername(),
                        stats.getMaxScore()
                ))
                .toList();
    }

    // Обновление максимального счета игрока
    @PutMapping("/update")
    public ResponseEntity<?> updateMaxScore(Authentication authentication,  @RequestBody UpdateMaxScoreRequestDTO request) {
        String username = authentication.getName(); // username, который был в токене

        // 3. Находим статистику по userId
        Optional<PlayerStats> playerStatsOpt = playerStatsRepository.findByPlayerDataUsername(username);

        if (playerStatsOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Stats not found"));
        }

        // 4. Обновляем счёт
        PlayerStats stats = playerStatsOpt.get();
        stats.setMaxScore(request.getNewMaxScore());
        playerStatsRepository.save(stats);

        return ResponseEntity.ok().build();
    }
}