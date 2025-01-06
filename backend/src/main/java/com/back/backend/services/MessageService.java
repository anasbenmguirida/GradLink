package com.back.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.back.backend.Entities.Message;
import com.back.backend.Entities.User;
import com.back.backend.DTO.ContactMessagesDTO;
import com.back.backend.repositories.MessageRepository;
import com.back.backend.repositories.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    // Method to get all messages exchanged with contacts of a user
    public List<ContactMessagesDTO> getMessagesWithAllContacts(int userId) {
        // Find all contacts who have communicated with the user
        List<Integer> contactIds = messageRepository.findContactIdsByUserId(userId);
    
        // For each contact, retrieve messages exchanged with the user
        return contactIds.stream().map(contactId -> {
            // Retrieve the contact's messages
            List<Message> messages = getMessagesWithUser(userId, contactId);
    
            // Retrieve the contact's user details
            User contact = userRepository.findById(contactId).orElse(null);
    
            // Get firstName, lastName, and photoProfile
            String firstName = contact != null ? contact.getFirstName() : "Unknown";
            String lastName = contact != null ? contact.getLastName() : "Unknown";
    
            byte[] profilePhoto = contact != null ? contact.getPhotoProfile() : null;
    
            // Return a new ContactMessagesDTO
            return new ContactMessagesDTO(contactId, firstName, lastName, profilePhoto, messages);
        }).collect(Collectors.toList());
    }
    

    // Method to get messages exchanged between two users
    public List<Message> getMessagesWithUser(int userId, int contactId) {
        // Get all messages sent by the user to the contact and vice versa
        List<Message> sentMessages = messageRepository.findBySenderIdAndRecipientId(userId, contactId);
        List<Message> receivedMessages = messageRepository.findBySenderIdAndRecipientId(contactId, userId);

        // Combine both sent and received messages
        sentMessages.addAll(receivedMessages);

        // Sort messages by date (ascending order)
        return sentMessages.stream()
                .sorted((m1, m2) -> m1.getDateEnvoie().compareTo(m2.getDateEnvoie()))
                .collect(Collectors.toList());
    }

    public Message saveMessage(Message message) {
        throw new UnsupportedOperationException("Unimplemented method 'saveMessage'");
    }

    public List<Message> getDiscussionBetweenUsers(int userId, int contactId) {
        return messageRepository.findDiscussion(userId, contactId);
    }
}