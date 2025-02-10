package com.back.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.back.backend.Entities.Message;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {

    // Get messages exchanged between a sender and recipient
    @Query("SELECT m FROM Message m WHERE (m.sender.id = :senderId AND m.recipient.id = :recipientId) OR (m.sender.id = :recipientId AND m.recipient.id = :senderId)")
    List<Message> findBySenderIdAndRecipientId(@Param("senderId") int senderId, @Param("recipientId") int recipientId);

    // Get all contact IDs (either sender or recipient) for a given user
    @Query("SELECT DISTINCT CASE WHEN m.sender.id = :userId THEN m.recipient.id ELSE m.sender.id END FROM Message m WHERE m.sender.id = :userId OR m.recipient.id = :userId")
    List<Integer> findContactIdsByUserId(@Param("userId") int userId);

    @Query("SELECT m FROM Message m WHERE " +
    "(m.sender.id = :userId AND m.recipient.id = :contactId) OR " +
    "(m.sender.id = :contactId AND m.recipient.id = :userId) " +
    "ORDER BY m.dateEnvoie ASC")
   List<Message> findDiscussion(@Param("userId") int userId, @Param("contactId") int contactId);
}