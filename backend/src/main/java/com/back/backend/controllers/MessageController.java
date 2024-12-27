package com.back.backend.controllers;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.socket.TextMessage;

import com.back.backend.handler.CustomWebSocketHandler;
import com.back.backend.model.Message;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

   @Autowired
   private CustomWebSocketHandler webSocketHandler;

   @PostMapping("/send")
   public String sendMessage(@RequestBody Message message) {
       try {
           webSocketHandler.handleTextMessage(null, new TextMessage(message.getSender() + ": " + message.getContent()));
           return "Message sent!";
       } catch (Exception e) {
           return "Error: " + e.getMessage();
       }
   }
}

