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

// status mentorat est de type enum 
// pending (0)   , accepted (1) , makaynach ou rejete(2)
@Query(value = "select status_mentorat from demande_mentorat where laureat_id=:idLaureat and etudiant_id=:idEtudiant", nativeQuery = true)
int getStatusMentorat(@Param("idLaureat") int idLaureat, @Param("idEtudiant") int idEtudiant);



@Query("SELECT d FROM DemandeMentorat d WHERE d.laureatId = :laureatId AND d.statusMentorat = :statusMentorat")
List<DemandeMentorat> findMentoredStudentsByLaureatIdAndStatusMentorat(@Param("laureatId") int laureatId, @Param("statusMentorat") StatusMentorat statusMentorat);


}
