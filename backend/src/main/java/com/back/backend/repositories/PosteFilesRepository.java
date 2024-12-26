package com.back.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.back.backend.Entities.PosteFiles;

@Repository
public interface PosteFilesRepository extends JpaRepository<PosteFiles , Integer>{

}
