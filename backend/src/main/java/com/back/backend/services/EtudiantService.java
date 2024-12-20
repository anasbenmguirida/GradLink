package com.back.backend.services;

import com.back.backend.Entities.Etudiant;
import com.back.backend.repositories.EtudiantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EtudiantService {

    @Autowired
    private EtudiantRepository etudiantRepository;

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
}
