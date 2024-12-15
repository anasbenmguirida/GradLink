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

@Entity
public class Evenement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String designation;

    private String description;

    private Date dateEvenement;

    private int capaciteMaximal;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    @OneToMany(mappedBy = "evenement", cascade = CascadeType.ALL)
    private List<EventParticipants> eventParticipants;

    // Default constructor
    public Evenement() {
    }

    // Constructor with parameters
    public Evenement(int id, String designation, String description, Date dateEvenement, int capaciteMaximal, Admin admin, List<EventParticipants> eventParticipants) {
        this.id = id;
        this.designation = designation;
        this.description = description;
        this.dateEvenement = dateEvenement;
        this.capaciteMaximal = capaciteMaximal;
        this.admin = admin;
        this.eventParticipants = eventParticipants;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDateEvenement() {
        return dateEvenement;
    }

    public void setDateEvenement(Date dateEvenement) {
        this.dateEvenement = dateEvenement;
    }

    public int getCapaciteMaximal() {
        return capaciteMaximal;
    }

    public void setCapaciteMaximal(int capaciteMaximal) {
        this.capaciteMaximal = capaciteMaximal;
    }


    public void setAdmin(Admin admin) {
        this.admin = admin;
    }


    public void setPlaceRestant(int capaciteMaximal) {
        this.capaciteMaximal = capaciteMaximal;
    }

    public int getPlaceRestant() {
        return capaciteMaximal;
    }
}
