package com.back.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.back.backend.Entities.Etudiant;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant , Integer>{

}
