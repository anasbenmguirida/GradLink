package com.back.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import com.back.backend.Entities.PosteLikes;

@Repository
public interface PosteLikesRepository extends JpaRepository<PosteLikes , Integer>{
@Query(value = "select *FROM poste_likes where user_id=:idUser and poste_id =:idPoste" , nativeQuery = true)
PosteLikes checklikes(@Param("idUser") int idUser , @Param("idPoste") int idPoste) ; 
    
} 
