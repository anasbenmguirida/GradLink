package com.back.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.back.backend.Entities.PosteFiles;

@Repository
public interface PosteFilesRepository extends JpaRepository<PosteFiles , Integer>{
// finding postefiles by poste id
@Query(value = "SELECT * FROM poste_files WHERE poste_id = :posteId", nativeQuery = true)
   List< PosteFiles> findPosteFilesByPosteId(int posteId);
}