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
            .securityMatcher("/api/**")  // Ensure this filter chain applies only to API routes
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(requests -> requests
            .requestMatchers(mvcMatcherBuilder.pattern("/")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/login")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/register")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/admin/evenement")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/admin/evenement/")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/admin/user/")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/admin/caummunaute")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/admin/caummunaute/")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/communities")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/communities/")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/events")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/events/")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/messages/")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/etudiant/demander-mentorat")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/postes")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/create-poste")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/like")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/poste/{id}")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/unlike")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/save-picture")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/profile-picture/{id}")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/check-likes")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/profile/{id}")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/except-admins")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/profile")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/laureat/accept")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/laureat/reject")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/laureat/status")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/delete-poste/{id}")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/update-poste")).permitAll()
            .requestMatchers(mvcMatcherBuilder.pattern("/api/laureat/demandes-pending/{id}")).permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(JwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    
}

