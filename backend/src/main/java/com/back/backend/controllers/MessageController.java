package com.back.backend.controllers;

import com.back.backend.Entities.Message;
import com.back.backend.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/all")
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    @PostMapping("/send")
    public String sendMessage(@RequestBody Message message) {
        try {
            messageRepository.save(message);
            return "Message saved!";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}
