package com.back.backend.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.back.backend.Entities.Message;
import com.back.backend.Entities.User;
import com.back.backend.repositories.MessageRepository;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public List<User> getAllContacts(int userId) {
        return messageRepository.findAllContactsByUserId(userId);
    }

    public List<Message> getMessagesWithUser(int userId, int contactId) {
        List<Message> sentMessages = messageRepository.findBySenderIdAndRecipientId(userId, contactId);
        List<Message> receivedMessages = messageRepository.findByRecipientIdAndSenderId(userId, contactId);
        
        // Combine sent and received messages
        List<Message> allMessages = new ArrayList<>();
        allMessages.addAll(sentMessages);
        allMessages.addAll(receivedMessages);

        // Sort messages by date
        allMessages.sort((m1, m2) -> m1.getDateEnvoie().compareTo(m2.getDateEnvoie()));

        return allMessages;
    }
}
