package com.back.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.back.backend.Entities.DemandeMentorat;
import com.back.backend.services.EtudiantService;

import lombok.AllArgsConstructor;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@AllArgsConstructor
public class EtudiantController {
    private final EtudiantService etudiantService;

    @PostMapping("/api/etudiant/demander-mentorat")
    public ResponseEntity<String> demanderMentorat(@RequestBody DemandeMentorat demandeMentorat) {
        return etudiantService.demanderMentorat(demandeMentorat);
    }
}
