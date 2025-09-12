package com.vladyslav_tsalko.tetris_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "player_stats")
public class PlayerStats {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private PlayerData playerData;

    private int maxScore = 0;

    public PlayerStats() {}

    public PlayerStats(PlayerData playerData) {
        this.playerData = playerData;
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getMaxScore() { return maxScore; }
    public void setMaxScore(int maxScore) { if(this.maxScore < maxScore) this.maxScore = maxScore; }

    public PlayerData getPlayerData() { return playerData; }
    public void setPlayerData(PlayerData playerData) { this.playerData = playerData; }
}
