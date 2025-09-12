package com.vladyslav_tsalko.tetris_backend.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.vladyslav_tsalko.tetris_backend")
@EntityScan("com.vladyslav_tsalko.tetris_backend.entity")
@EnableJpaRepositories("com.vladyslav_tsalko.tetris_backend.repository")
public class BackendFor3DTetrisApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendFor3DTetrisApplication.class, args);
	}

}
