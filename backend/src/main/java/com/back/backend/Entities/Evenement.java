package com.back.backend.Entities;

import java.sql.Date;
import java.util.List;

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
    private Admin admin  ;

    @OneToMany(mappedBy = "evenement", cascade = CascadeType.ALL)
    private List<EventParticipants> eventParticipants ;

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public int getCapaciteMaximal() {
        return capaciteMaximal;
    }

    public Date getDateEvenement() {
        return dateEvenement;
    }

    public String getDesignation() {
        return designation;
    }

    public String getDescription() {
        return description;
    }

    public int getPlaceRestant() {
        return placeRestant;
    }

    public void setCapaciteMaximal(int capaciteMaximal) {
        this.capaciteMaximal = capaciteMaximal;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDateEvenement(Date dateEvenement) {
        this.dateEvenement = dateEvenement;
    }

    public void setPlaceRestant(int placeRestant) {
        this.placeRestant = placeRestant;
    }
}