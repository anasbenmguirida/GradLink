package com.back.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties.Authentication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter JwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;
    private final HandlerMappingIntrospector introspector;

    public SecurityConfig(
            JwtAuthenticationFilter JwtAuthenticationFilter,
            AuthenticationProvider authenticationProvider,
            HandlerMappingIntrospector introspector) {
        this.JwtAuthenticationFilter = JwtAuthenticationFilter;
        this.authenticationProvider = authenticationProvider;
        this.introspector = introspector;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        MvcRequestMatcher.Builder mvcMatcherBuilder = new MvcRequestMatcher.Builder(introspector);
        
        http
            .csrf(csrf -> csrf
            .disable())
            .authorizeHttpRequests(requests -> requests
            .requestMatchers(mvcMatcherBuilder.pattern("/")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/login")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/register")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/admin/evenement/1")).permitAll()
            .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(JwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}