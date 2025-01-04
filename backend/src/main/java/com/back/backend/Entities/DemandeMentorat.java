package com.back.backend.Entities;

import java.sql.Date;
import java.time.LocalDate;

import com.back.backend.enums.StatusMentorat;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DemandeMentorat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "etudiant_id", nullable = false, updatable = false, insertable = false)
    @JsonBackReference(value = "etu-demande")
    private Etudiant etudiant;

    @Column(name = "etudiant_id")
    private int etudiantId;

    @ManyToOne
    @JoinColumn(name = "laureat_id", nullable = false, updatable = false, insertable = false)
    @JsonBackReference(value = "lau-demande")
    private Laureat laureat;

    @Column(name = "laureat_id")
    private int laureatId;
   
    private StatusMentorat statusMentorat;
    private LocalDate dateDemande;
    private String reason ; 
}
