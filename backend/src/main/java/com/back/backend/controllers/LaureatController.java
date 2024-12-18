package com.back.backend.controllers;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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


import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@RestController
@AllArgsConstructor
@NoArgsConstructor

public class LaureatController {

    @Autowired
    private LaureatService laureatService ; 

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
    @PostMapping(path = "/api/create-poste" , consumes = {"multipart/form-data"})
    public ResponseEntity<Poste> createposte(@RequestPart("fichiers") MultipartFile fichiers,
                                               @RequestParam("textArea") String text,
                                               @RequestParam("typePoste") TypePoste typePoste,
                                               @RequestParam("userId") int userId,
                                               @RequestParam("datePoste") LocalDateTime datePoste 
    )  
                                     {
        System.out.println("Received file: " + fichiers.getOriginalFilename()); 
        try {
              
            Poste poste = new Poste();
            poste.setUserId(userId);
            poste.setDatePoste(datePoste);
            poste.setFichiers(fichiers.getBytes());
            poste.setTextArea(text);
            poste.setTypePoste(typePoste);
            this.laureatService.createPoste(poste) ; 
            return ResponseEntity.ok(poste);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }
}

