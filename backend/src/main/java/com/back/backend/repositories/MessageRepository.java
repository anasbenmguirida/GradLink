package com.back.backend.repositories;

import com.back.backend.Entities.Message;
import com.back.backend.Entities.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {
        @Query("SELECT DISTINCT m.recipient FROM Message m WHERE m.sender.id = :userId " +
           "UNION SELECT DISTINCT m.sender FROM Message m WHERE m.recipient.id = :userId")
    List<User> findAllContactsByUserId(int userId);

    List<Message> findBySenderIdAndRecipientId(int senderId, int recipientId);

    List<Message> findByRecipientIdAndSenderId(int recipientId, int senderId);
}
