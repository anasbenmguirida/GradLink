package com.back.backend.Entities;

import java.sql.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Evenement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id ; 
    private String designation ; 
    private String description ;
    private Date dateEvenement ;
    private int capaciteMaximal ; 
    private int placeRestant ; 
    @ManyToOne
    // plusieurs evenements peuvent etre creer par le meme admin 
    @JoinColumn(name = "admin_id", nullable = false)
      @JsonBackReference
    private Admin admin  ; 

    @OneToMany(mappedBy = "evenement", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<EventParticipants> eventParticipants ; 
}
