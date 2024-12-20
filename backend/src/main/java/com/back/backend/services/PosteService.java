package com.back.backend.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;


import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import com.back.backend.Entities.Poste;
import com.back.backend.repositories.PosteRepository;


import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PosteService {
    private final PosteRepository posteRepository ; 
    
    // creation de postes par un laureat => 2 type de possible NORMAL ET CAUMMUNAUTE
    public ResponseEntity<String> createPoste(@RequestBody Poste poste) {
        this.posteRepository.save(poste) ; 
        return ResponseEntity.ok("Poste cree avec succes") ;
    }


    public List<Poste> getAllPoste() {
        return this.posteRepository.findAll() ; 
    }
}
