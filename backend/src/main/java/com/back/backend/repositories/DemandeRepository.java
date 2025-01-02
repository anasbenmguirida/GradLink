package com.back.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.back.backend.Entities.DemandeMentorat;
import com.back.backend.enums.StatusMentorat;

@Repository
public interface DemandeRepository extends JpaRepository<DemandeMentorat , Integer>{
@Query(value = "select *FROM demande_mentorat WHERE laureat_id=:id" , nativeQuery = true)
List<DemandeMentorat> getAllDemandeLaureat(@Param("id") int id) ;

@Query("SELECT d FROM DemandeMentorat d WHERE d.laureatId = :laureatId AND d.statusMentorat = :statusMentorat")
List<DemandeMentorat> findMentoredStudentsByLaureatIdAndStatusMentorat(@Param("laureatId") int laureatId, @Param("statusMentorat") StatusMentorat statusMentorat);

}
