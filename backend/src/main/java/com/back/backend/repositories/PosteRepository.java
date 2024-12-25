package com.back.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.back.backend.Entities.Poste;
@Repository
public interface PosteRepository extends JpaRepository<Poste , Integer>{
@Query(value = "SELECT * FROM poste WHERE user_id = :userId", nativeQuery = true)
List<Poste> findPostesByUserId(@Param("userId") int userId);
}
