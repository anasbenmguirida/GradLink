package com.back.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.back.backend.Entities.DemandeMentorat;

@Repository
public interface DemandeRepository extends JpaRepository<DemandeMentorat , Integer>{
@Query(value = "select *FROM demande_mentorat WHERE laureat_id=:id" , nativeQuery = true)
List<DemandeMentorat> getAllDemandeLaureat(@Param("id") int id) ; 
}
