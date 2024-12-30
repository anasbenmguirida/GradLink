package com.back.backend.controllers;


import com.back.backend.dto.ContactMessagesDTO;
import com.back.backend.services.MessageService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
@CrossOrigin(origins = "http://localhost:4200")
public class MessagingController {

    @Autowired
    private MessageService messageService;

    // Endpoint to get messages with all contacts
    @GetMapping("/messages/{userId}")
    public List<ContactMessagesDTO> getMessagesWithAllContacts(@PathVariable int userId) {
        return messageService.getMessagesWithAllContacts(userId);
    }
}
