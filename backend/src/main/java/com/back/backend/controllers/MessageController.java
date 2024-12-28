package com.back.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.back.backend.Entities.Message;
import com.back.backend.Entities.User;
import com.back.backend.services.MessageService;

@RestController
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/contacts/{userId}")
    public List<User> getAllContacts(@PathVariable int userId) {
        return messageService.getAllContacts(userId);
    }

    @GetMapping("/messages")
    public List<Message> getMessagesWithUser(
        @RequestParam int userId, 
        @RequestParam int contactId
    ) {
        return messageService.getMessagesWithUser(userId, contactId);
    }
}
