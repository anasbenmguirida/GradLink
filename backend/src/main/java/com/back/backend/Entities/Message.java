package com.back.backend.Entities;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private int id ;  

@ManyToOne
@JoinColumn(name = "sender_id", nullable = false)
 @JsonBackReference(value = "sender-msg")
private User sender;

@ManyToOne
@JoinColumn(name = "recipient_id", nullable = false)
@JsonBackReference(value = "recipient-msg")
private User recipient; 

private String contenue ; 
private Date dateEnvoie ; 
    // Additional method to easily access sender and recipient IDs
public int getSenderId() {
        return sender != null ? sender.getId() : -1;  // or any default value like -1 if sender is null
}

public int getRecipientId() {
        return recipient != null ? recipient.getId() : -1;  // or any default value like -1 if recipient is null
}
}
