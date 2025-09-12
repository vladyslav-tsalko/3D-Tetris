package com.vladyslav_tsalko.tetris_backend.controller;

import com.vladyslav_tsalko.tetris_backend.entity.PlayerData;
import com.vladyslav_tsalko.tetris_backend.entity.PlayerStats;
import com.vladyslav_tsalko.tetris_backend.repository.PlayerDataRepository;
import com.vladyslav_tsalko.tetris_backend.repository.PlayerStatsRepository;
import com.vladyslav_tsalko.tetris_backend.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class PlayerDataController {

    private final PlayerDataRepository playerDataRepository;
    private final PlayerStatsRepository playerStatsRepository;
    private final JwtService jwtService;

    public PlayerDataController(PlayerDataRepository playerDataRepository, PlayerStatsRepository playerStatsRepository, JwtService jwtService) {
        this.playerDataRepository = playerDataRepository;
        this.playerStatsRepository = playerStatsRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> addPlayer(@RequestBody PlayerData playerData) {
        if(playerDataRepository.findByUsername(playerData.getUsername()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT) // 409
                    .body(Map.of("error", "Username already exists"));
        }
        // Сохраняем аккаунт
        PlayerData savedPlayer = playerDataRepository.save(playerData);

        // Автоматически создаём статистику для нового игрока
        PlayerStats stats = new PlayerStats(savedPlayer);
        stats.setMaxScore(0);
        playerStatsRepository.save(stats);

        // Генерация JWT
        String token = jwtService.generateToken(savedPlayer.getUsername());

        return ResponseEntity.ok(Map.of(
                "token", token
        ));

    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody PlayerData loginRequest) {
        Optional<PlayerData> playerOpt = playerDataRepository.findByUsername(loginRequest.getUsername());

        if(playerOpt.isEmpty() || !playerOpt.get().getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        }

        PlayerData player = playerOpt.get();
        String token = jwtService.generateToken(player.getUsername());

        return ResponseEntity.ok(Map.of(
                "token", token
        ));
    }
}