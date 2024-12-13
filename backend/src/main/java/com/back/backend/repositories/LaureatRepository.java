package com.back.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.back.backend.Entities.Laureat;

@Repository
public interface LaureatRepository extends JpaRepository<Laureat , Integer>{

}
