package com.back.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.back.backend.services.MessageService;
import com.back.backend.dto.ContactMessagesDTO;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // Endpoint to get messages with all contacts
    @GetMapping("/messages/{userId}")
    public List<ContactMessagesDTO> getMessagesWithAllContacts(@PathVariable int userId) {
        return messageService.getMessagesWithAllContacts(userId);
    }
}