package com.back.backend.repositories;

import com.back.backend.Entities.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EtudiantRepository extends JpaRepository<Etudiant, Integer> {
    List<Etudiant> findByFirstName(String firstName); 
    List<Etudiant> findByLastName(String lastName);  
    List<Etudiant> findByEmail(String email);
    List<Etudiant> findByFiliere(String filiere);
    List<Etudiant> findByFirstNameAndLastNameAndEmail(String firstName, String lastName, String email);
    List<Etudiant> findByFirstNameAndLastName(String firstName, String lastName);
    List<Etudiant> findByFirstNameAndLastNameAndFiliereAndEmail(String firstName, String lastName, String filiere,String email);
}
