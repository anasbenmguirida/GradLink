package com.back.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.back.backend.Entities.DemandeMentorat;
import com.back.backend.services.EtudiantService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/etudiant")
@CrossOrigin(origins = "http://localhost:4200")
public class EtudiantController {
private final EtudiantService etudiantService;

@PostMapping("/demande-mentorat")
    public ResponseEntity<String> demanderMentorat(@RequestBody DemandeMentorat demandeMentorat) {
    return this.etudiantService.demanderMentorat(demandeMentorat);
    }
}
