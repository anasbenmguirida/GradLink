package com.back.backend.Entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Admin extends User{
    
private long anneeExeprience ; 
@OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
// un amin peut creer plusieurs evenement 
@JsonManagedReference
private List<Evenement> listeEvenements ; 

@OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
// un amin peut creer plusieurs evenement 
@JsonManagedReference
private List<Caummunaute> listCaummunautes ; 
 
}
