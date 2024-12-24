package com.back.backend.controllers;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.back.backend.Entities.DemandeMentorat;
import com.back.backend.Entities.Laureat;
import com.back.backend.Entities.Poste;
import com.back.backend.Entities.User;
import com.back.backend.enums.TypePoste;
import com.back.backend.services.LaureatService;
import com.back.backend.services.PosteService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import jakarta.servlet.annotation.MultipartConfig;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@RestController
@AllArgsConstructor
@MultipartConfig

public class LaureatController {

    
    private final PosteService posteService ; 
    private final LaureatService laureatService ; 

    @PutMapping("/api/accept/{id}")
    public String acceptDemande(@PathVariable int id) {
        return this.laureatService.accepterDemande(id) ; 
    }

    @PutMapping("/api/reject/{id}")
    public String refuserDemande(@PathVariable int id) {
        return this.laureatService.refuserDemande(id) ; 
    }
    @GetMapping("/api/laureats")
    public List<Laureat> getAllLaureats() {
        return this.laureatService.getAllLaureat() ; 
    }
    @GetMapping("/api/laureat-demandes/{id}")
    public List<DemandeMentorat> getAllLaureatDemandes(@PathVariable int id) {
        return this.laureatService.getAllLaureatDemandes(id) ;
    }
    @PostMapping("/api/create-poste")
    public ResponseEntity<String> createposte(@RequestParam("poste") String posteJson
                                            ,@RequestPart(value = "file" , required = false) MultipartFile file) throws JsonMappingException, JsonProcessingException {
        
        
        this.posteService.createPoste(posteJson , file);
        return ResponseEntity.ok("post saved ");
    }
}

