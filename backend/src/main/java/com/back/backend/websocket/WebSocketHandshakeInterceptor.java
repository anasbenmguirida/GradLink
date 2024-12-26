package com.back.backend.websocket;

import org.springframework.web.socket.server.HandshakeInterceptor;

import jakarta.websocket.server.HandshakeRequest;
import jakarta.websocket.server.*;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.lang.Nullable;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import java.util.Map;

public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(HandshakeRequest request, HandshakeResponse response, WebSocketSession session) throws Exception {
        // Extract JWT token from the URL parameter
        String token = ((WebSocketSession) request).getUri().getQuery(); // Get query parameters
        if (token != null && token.contains("token=")) {
            String jwtToken = token.split("token=")[1];  // Extract the token value
            // Optionally, store the token in session attributes for later use
            session.getAttributes().put("JWT_TOKEN", jwtToken);
            System.out.println("Extracted JWT Token: " + jwtToken);
        }
        return true;  // Proceed with the handshake
    }

    @Override
    public void afterHandshake(HandshakeRequest request, HandshakeResponse response, WebSocketSession session) {
        // Additional logic if necessary after the handshake
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
            Map<String, Object> attributes) throws Exception {
        throw new UnsupportedOperationException("Unimplemented method 'beforeHandshake'");
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
            @Nullable Exception exception){
        throw new UnsupportedOperationException("Unimplemented method 'afterHandshake'");
    }
}
