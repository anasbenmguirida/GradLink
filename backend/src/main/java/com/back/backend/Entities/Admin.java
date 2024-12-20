package com.back.backend.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Getter
@Setter
public class Admin extends User {
    private long anneeExperience;

    // Admin can create multiple events
    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "admin-event")
    private List<Evenement> listeEvenements;

    // Admin can create multiple communities
    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "admin-caum")
    private List<Caummunaute> listCommunautes;
}
