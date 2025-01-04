package com.back.backend.Entities;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Data
@Entity
public class Laureat extends User {

@OneToMany(mappedBy = "laureat", cascade = CascadeType.ALL)
@JsonManagedReference(value = "lau-demande")
private List<DemandeMentorat> demandes;

@OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Message> sentMessages = new ArrayList<>();

@OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Message> receivedMessages = new ArrayList<>();

private long promotion ; 
private String specialite ;

}
