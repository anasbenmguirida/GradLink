package com.back.backend.Entities;

import java.util.Collection;
import java.util.List;

import com.back.backend.DTO.CaummunauteDTO;
import com.fasterxml.jackson.annotation.JsonBackReference;



import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Caummunaute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String titre;

    private String description;

    // admin can create multiple communities
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    @JsonBackReference(value = "admin-caum")
    private Admin admin;
    // it can have mu
    // One-to-many relationship with Poste
    @OneToMany(mappedBy = "caummunaute", fetch = FetchType.LAZY)
    private List<Poste> postes;

}
