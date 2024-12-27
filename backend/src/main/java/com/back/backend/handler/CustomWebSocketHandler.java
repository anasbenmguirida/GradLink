package com.back.backend.handler;


import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashSet;
import java.util.Set;

@Component
public class CustomWebSocketHandler extends TextWebSocketHandler {

   private final Set<WebSocketSession> sessions = new HashSet<>();

   @Override
   public void afterConnectionEstablished(WebSocketSession session) {
       sessions.add(session);
   }

   @Override
   public void handleTextMessage(WebSocketSession session, TextMessage message) {
       sessions.forEach(webSocketSession -> {
           try {
               if (webSocketSession.isOpen()) {
                   webSocketSession.sendMessage(message);
               }
           } catch (Exception e) {
               e.printStackTrace();
           }
       });
   }

   @Override
   public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
       sessions.remove(session);
   }
}
