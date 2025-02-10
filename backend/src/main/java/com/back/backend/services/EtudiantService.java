package com.back.backend.services;

import com.back.backend.Entities.DemandeMentorat;
import com.back.backend.Entities.Etudiant;
import com.back.backend.enums.StatusMentorat;
import com.back.backend.repositories.DemandeRepository;
import com.back.backend.repositories.EtudiantRepository;

import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class EtudiantService {

    
    private final EtudiantRepository etudiantRepository;
    private final DemandeRepository demandeRepository;

    public List<Etudiant> searchEtudiants(String firstName, String lastName, String filiere, String email) {
        if (firstName != null && lastName != null && filiere != null && email != null) {
            return etudiantRepository.findByFirstNameAndLastNameAndFiliereAndEmail(firstName, lastName, filiere, email);
        } else if (firstName != null && lastName != null) {
            return etudiantRepository.findByFirstNameAndLastName(firstName, lastName);
        } else if (firstName != null) {
            return etudiantRepository.findByFirstName(firstName);
        } else if (lastName != null) {
            return etudiantRepository.findByLastName(lastName);
        } else if (filiere != null) {
            return etudiantRepository.findByFiliere(filiere);
        } else if (email != null) {
            return etudiantRepository.findByEmail(email);
        } else {
            return etudiantRepository.findAll();
        }
    }

    public ResponseEntity<String> demanderMentorat(DemandeMentorat demandeMentorat) {
    demandeMentorat.setDateDemande(LocalDate.now());
    demandeMentorat.setStatusMentorat(StatusMentorat.PENDING);
    demandeMentorat.setEtudiantId(demandeMentorat.getEtudiantId());
    demandeMentorat.setLaureatId(demandeMentorat.getLaureatId());
    this.demandeRepository.save(demandeMentorat) ; 
    return ResponseEntity.ok("Demande de mentorat envoyée");
    }

}