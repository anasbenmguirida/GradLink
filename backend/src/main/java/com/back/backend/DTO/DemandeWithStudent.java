package com.back.backend.dto;

import com.back.backend.Entities.DemandeMentorat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@Data
@NoArgsConstructor
public class DemandeWithStudent {
private DemandeMentorat demande ;
private String prenomEtudiant;
private String nomEtudiant; 
private String photoProfile ; 
}