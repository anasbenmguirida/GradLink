package com.back.backend.Entities;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
public class Laureat extends User {

@OneToMany(mappedBy = "laureat", cascade = CascadeType.ALL)
private List<DemandeMentorat> demandes;

@OneToMany(mappedBy = "laureat", cascade = CascadeType.ALL)
private List<Message> messages ; 

private String promotion ; 
private String specialite ;

}
