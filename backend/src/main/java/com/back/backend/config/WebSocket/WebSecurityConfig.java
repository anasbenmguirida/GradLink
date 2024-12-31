package com.back.backend.config.WebSocket;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean(name = "webSecurityFilterChain")
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/ws/**")  // Ensure this filter chain applies only to WebSocket routes or others
            .authorizeHttpRequests(authorize -> authorize
                .anyRequest().permitAll() // Allow all requests for WebSocket or other specific paths
            )
            .csrf(csrf -> csrf.disable()); // Optionally disable CSRF protection

        return http.build();
    }
}