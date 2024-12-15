package com.back.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.back.backend.Entities.DemandeMentorat;

@Repository
public interface DemandeRepository extends JpaRepository<DemandeMentorat , Integer>{

}
