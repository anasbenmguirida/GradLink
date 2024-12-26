package com.back.backend.controllers;

import com.back.backend.Entities.Message;
import com.back.backend.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessagingController {

    @Autowired
    private MessageService messageService;

    @MessageMapping("/send-message") // Maps messages sent to /app/send-message
    @SendTo("/topic/messages") // Broadcast to subscribers of /topic/messages
    public Message sendMessage(Message message) {
        // Save the message to the database
        return messageService.saveMessage(message);
    }
}
