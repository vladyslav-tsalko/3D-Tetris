package com.vladyslav_tsalko.tetris_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "player_data")
public class PlayerData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String username;
    private String password;

    public PlayerData() {
        // JPA требует пустой конструктор
    }

    public PlayerData(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // геттеры и сеттеры
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
