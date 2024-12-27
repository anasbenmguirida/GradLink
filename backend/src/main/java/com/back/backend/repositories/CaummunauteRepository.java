package com.back.backend.repositories;

import com.back.backend.Entities.Caummunaute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CaummunauteRepository extends JpaRepository<Caummunaute, Integer> {
}