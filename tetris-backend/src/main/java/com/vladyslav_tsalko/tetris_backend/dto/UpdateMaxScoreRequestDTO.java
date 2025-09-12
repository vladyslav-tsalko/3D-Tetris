package com.vladyslav_tsalko.tetris_backend.dto;

public class UpdateMaxScoreRequestDTO {
    private int newMaxScore;

    public int getNewMaxScore() {
        return newMaxScore;
    }

    public void setNewMaxScore(int newMaxScore) {
        this.newMaxScore = newMaxScore;
    }
}
