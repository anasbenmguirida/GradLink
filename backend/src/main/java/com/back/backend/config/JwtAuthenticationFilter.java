package com.back.backend.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtservice;
    private final UserDetailsService userDetailsSercice;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        final String AuthenticationHeader = request.getHeader("Authorization");
        final String JWTtoken;
        final String email;
        System.out.println("authenticaion header :   " + AuthenticationHeader);
        if (AuthenticationHeader == null || !AuthenticationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        // extracting the JWT from the request
        JWTtoken = AuthenticationHeader.substring(7); // eveen(s)
        System.out.println("The jwt token extracted :  " + JWTtoken);
        // extract the email from the JWT token
        System.out.println(JWTtoken);
        email = jwtservice.extractEmail(JWTtoken);
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsSercice.loadUserByUsername(email);
            if (jwtservice.isTokenValid(JWTtoken, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
                        null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
}
}