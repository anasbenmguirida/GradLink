package com.back.backend.Entities;

import java.sql.Date;
import java.util.List;

import com.back.backend.enums.TypePoste;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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
public class Poste {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id  ; 
    // pdf et les images 
    @Column(name = "fichiers", columnDefinition = "BYTEA")
    private byte[] fichiers; 
    private TypePoste typePoste ; 
    private String textArea ; 
    private Date datePoste ; 
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @OneToMany(mappedBy = "poste", cascade = CascadeType.ALL)
    // un poste peut avoir plusieurs reations(likes mostly)
    private List<PosteLikes> posteLikes ; 

    // plusieurs postes peuvent appartenir a une seul caummunaute 
    @ManyToOne
    @JoinColumn(name = "caummunaute_id", nullable = true)
    private Caummunaute caummunaute;

}
