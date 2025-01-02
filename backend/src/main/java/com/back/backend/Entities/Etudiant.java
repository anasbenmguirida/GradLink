package com.back.backend.Entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data

public class Etudiant extends User {
private String filiere ; 
@OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL)
// un etudiant peut avoir demander plusieurs mentorats 
@JsonManagedReference(value = "etu-demande")
private List<DemandeMentorat> demandes;

@OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Message> sentMessages = new ArrayList<>();

@OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Message> receivedMessages = new ArrayList<>();
}
