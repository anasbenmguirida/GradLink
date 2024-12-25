package com.back.backend.services;


import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.back.backend.Entities.Poste;
import com.back.backend.Entities.PosteFiles;
import com.back.backend.Entities.PosteLikes;
import com.back.backend.repositories.PosteFilesRepository;
import com.back.backend.repositories.PosteLikesRepository;
import com.back.backend.repositories.PosteRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PosteService {
    private final PosteRepository posteRepository ; 
    private final PosteLikesRepository posteLikesRepository ; 
    private final PosteFilesRepository posteFilesRepository ;
    
    public List<Poste> findPostesByUserId(int id){
        return this.posteRepository.findPostesByUserId(id) ; 
    }

    public List<Poste> getAllPoste() {
        return this.posteRepository.findAll() ; 
    }

    public boolean checkLikedPoste(PosteLikes posteLikes){
        PosteLikes isLiked = this.posteLikesRepository.checklikes(posteLikes.getPosteId(), posteLikes.getUserId()) ; 
        return isLiked==null ? false : true ;
    }
    public ResponseEntity<String> deletePoste(int idPoste){
        try{
            this.posteRepository.deleteById(idPoste) ;
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la suppression du poste");
        }
        return ResponseEntity.ok().body("Poste supprimé avec succes");
    }
}
