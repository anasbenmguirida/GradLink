package com.back.backend.controllers;

import com.back.backend.Entities.DemandeMentorat;
import com.back.backend.enums.StatusMentorat;
import com.back.backend.services.DemandeMentoratService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api")
public class EtudiantController {

    private final DemandeMentoratService demandeMentoratService;

    @Autowired
    public EtudiantController(DemandeMentoratService demandeMentoratService) {
        this.demandeMentoratService = demandeMentoratService;
    }

    // Endpoint to send mentorship request
    @PostMapping("/etudiant/mentorat")
    public ResponseEntity<DemandeMentorat> sendMentorshipRequest(@RequestParam int etudiantId, @RequestParam int laureatId) {
        try {
            // Create a new mentorship request
            DemandeMentorat demandeMentorat = new DemandeMentorat();
            demandeMentorat.setEtudiantId(etudiantId);
            demandeMentorat.setLaureatId(laureatId);
            demandeMentorat.setStatusMentorat(StatusMentorat.PENDING); // Default status
            demandeMentorat.setDateDemande(LocalDate.now());

            // Save the request
            DemandeMentorat savedRequest = demandeMentoratService.saveDemandeMentorat(demandeMentorat);

            // Return the saved request with the status
            return ResponseEntity.ok(savedRequest);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
