package com.back.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.back.backend.Entities.Laureat;
import com.back.backend.enums.Role;

@Repository
public interface LaureatRepository extends JpaRepository<Laureat , Integer>{
 @Query("SELECT l FROM Laureat l WHERE l.role = :role")
    List<Laureat> findAllByRole(@Param("role") Role role);
}
