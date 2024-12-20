package com.back.backend.Entities;



import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class PosteFiles {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id  ; 
    private String fileName ;
    
    @ManyToOne
    @JoinColumn(name = "poste_id", nullable = false)
    @JsonBackReference("poste-files")
    private Poste poste ;

}
