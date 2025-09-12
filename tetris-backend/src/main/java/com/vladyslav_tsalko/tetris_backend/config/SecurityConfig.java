package com.vladyslav_tsalko.tetris_backend.config;

import com.vladyslav_tsalko.tetris_backend.filter.JwtAuthenticationEntryPoint;
import com.vladyslav_tsalko.tetris_backend.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationEntryPoint entryPoint) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // отключаем CSRF для REST
                // Включаем CORS — Spring Security будет использовать твой WebMvcConfigurer
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // без сессий
                .authorizeHttpRequests(auth -> auth
                        // Разрешить регистрацию и логин без токена
                        .requestMatchers("/api/auth/**").permitAll()

                        // Всё остальное только с токеном
                        .anyRequest().authenticated()
                );
        http.exceptionHandling(ex -> ex.authenticationEntryPoint(entryPoint)); // <--- тут
        // добавляем наш фильтр до стандартной аутентификации
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}