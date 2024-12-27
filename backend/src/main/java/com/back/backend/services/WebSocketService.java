package com.back.backend.services;

import com.back.backend.model.Message;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@Service
public class WebSocketService {

   private final ObjectMapper objectMapper = new ObjectMapper();

   public TextMessage createTextMessage(Message message) {
       try {
           return new TextMessage(objectMapper.writeValueAsString(message));
       } catch (Exception e) {
           throw new RuntimeException("Failed to convert message to JSON", e);
       }
   }
}
