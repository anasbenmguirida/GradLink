package com.back.backend.handler;

import com.back.backend.Entities.Message;
import com.back.backend.dto.MessageDTO;
import com.back.backend.repositories.EtudiantRepository;
import com.back.backend.repositories.LaureatRepository;
import com.back.backend.repositories.MessageRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Date;

@Component
public class CustomWebSocketHandler extends TextWebSocketHandler {

    private final MessageRepository messageRepository;
    private final EtudiantRepository etudiantRepository;
    private final LaureatRepository laureatRepository;

    public CustomWebSocketHandler(MessageRepository messageRepository,
                                  EtudiantRepository etudiantRepository,
                                  LaureatRepository laureatRepository) {
        this.messageRepository = messageRepository;
        this.etudiantRepository = etudiantRepository;
        this.laureatRepository = laureatRepository;
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage textMessage) {
        try {
            // Assuming message payload is in JSON format: {"etudiantId":1,"laureatId":2,"contenue":"Hello"}
            String payload = textMessage.getPayload();
            ObjectMapper objectMapper = new ObjectMapper();
            MessageDTO messageDTO = objectMapper.readValue(payload, MessageDTO.class);

            // Retrieve Etudiant and Laureat by ID
            var etudiant = etudiantRepository.findById(messageDTO.getEtudiantId())
                    .orElseThrow(() -> new RuntimeException("Etudiant not found"));
            var laureat = laureatRepository.findById(messageDTO.getLaureatId())
                    .orElseThrow(() -> new RuntimeException("Laureat not found"));

            // Create and save the message
            Message message = new Message();
            message.setEtudiant(etudiant);
            message.setLaureat(laureat);
            message.setContenue(messageDTO.getContenue());
            message.setDateEnvoie(new Date());
            messageRepository.save(message);

            // Broadcast the message to all connected sessions
            super.handleTextMessage(session, textMessage);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
