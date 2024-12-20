package com.back.backend.Entities;
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

private List<DemandeMentorat> demandes;

@OneToMany(mappedBy = "laureat", cascade = CascadeType.ALL)

private List<Message> messages ; 

private long promotion ; 
private String specialite ;

}
