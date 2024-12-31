package com.back.backend.config.WebSocket;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.back.backend.handler.CustomWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
   private final CustomWebSocketHandler customWebSocketHandler;

   public WebSocketConfig(CustomWebSocketHandler customWebSocketHandler) {
       this.customWebSocketHandler = customWebSocketHandler;
   }

   @Override
   public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
       // Allowing all origins for testing, but consider restricting in production
       registry.addHandler(customWebSocketHandler, "/ws")
               .setAllowedOrigins("*"); // Allow all origins, change for production

   }
}