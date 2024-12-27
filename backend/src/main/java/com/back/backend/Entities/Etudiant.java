package com.back.backend.Entities;

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

@OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL)
@JsonManagedReference(value = "etu-msg")
private List<Message> messages ; 

}
