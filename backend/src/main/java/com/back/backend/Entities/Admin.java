package com.back.backend.Entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity

public class Admin extends User{

    private String anneeExeprience ;
    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
// un amin peut creer plusieurs evenement
    private List<Evenement> listeEvenements ;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
// un amin peut creer plusieurs evenement
    private List<Caummunaute> listCaummunautes ;

}