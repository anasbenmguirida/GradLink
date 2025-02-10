package com.back.backend.repositories;

import com.back.backend.Entities.DemandeMentorat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DemandeMentoratRepository extends JpaRepository<DemandeMentorat, Integer> {
}