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
@JoinColumn(name = "etudiant_id", nullable = false)
 @JsonBackReference(value = "etu-msg")
private Etudiant etudiant;

@ManyToOne
@JoinColumn(name = "laureat_id", nullable = false)
@JsonBackReference(value = "lau-msg")
private Laureat laureat ; 

private String contenue ; 
private Date dateEnvoie ; 
}
