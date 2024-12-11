package com.back.backend.Entities;

import jakarta.annotation.Generated;
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
public class EventParticipants {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id ; 
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user  ; 

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Evenement evenement  ; 

}
