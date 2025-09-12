package com.vladyslav_tsalko.tetris_backend.dto;

public class PlayerStatsDTO {
    private String nickname;
    private int maxScore;

    public PlayerStatsDTO(String nickname, int maxScore) {
        this.nickname = nickname;
        this.maxScore = maxScore;
    }

    // геттеры
    public String getNickname() { return nickname; }
    public int getMaxScore() { return maxScore; }
}