package com.back.backend.controllers;

import com.back.backend.Entities.Caummunaute;
import com.back.backend.Entities.Etudiant;
import com.back.backend.Entities.Evenement;
import com.back.backend.services.CaummunauteService;
import com.back.backend.services.EtudiantService;
import com.back.backend.services.EvenementService;
import com.back.backend.services.UserService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin") // Group admin-related endpoints
@CrossOrigin(origins = "http://localhost:4200")

public class AdminController {

    private final EvenementService evenementService;
    private final UserService userService;
    private final CaummunauteService caummunauteService;
    private final EtudiantService etudiantService;

    // Constructor Injection
    @Autowired
    public AdminController(EvenementService evenementService, UserService userService,
            CaummunauteService caummunauteService, EtudiantService etudiantService) {
        this.evenementService = evenementService;
        this.userService = userService;
        this.caummunauteService = caummunauteService;
        this.etudiantService = etudiantService;
    }

    // Create a new event
    @PostMapping("/evenement")
    public ResponseEntity<?> createEvent(@RequestBody Evenement evenement, @RequestParam int adminId) {
        try {
            Evenement createdEvent = evenementService.createEvent(evenement, adminId);
            return new ResponseEntity<>(createdEvent, HttpStatus.CREATED); // HTTP 201
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating event: " + e.getMessage());
        }
    }

    // Update an existing event
    @PutMapping("/evenement/{eventId}")
    public ResponseEntity<?> updateEvent(@PathVariable int eventId, @RequestBody Evenement updatedEvenement) {
        try {
            Evenement updatedEvent = evenementService.updateEvent(eventId, updatedEvenement);
            return ResponseEntity.ok(updatedEvent); // HTTP 200
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error updating event: " + e.getMessage());
        }
    }

    // Delete an event
    @DeleteMapping("/evenement/{eventId}")
    public ResponseEntity<?> deleteEvent(@PathVariable int eventId) {
        try {
            evenementService.deleteEvent(eventId);
            return ResponseEntity.noContent().build(); // HTTP 204
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error deleting event: " + e.getMessage());
        }
    }

    // Delete a user
    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build(); // HTTP 204
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error deleting user: " + e.getMessage());
        }
    }

    // Create a new community (Caummunaute)
    @PostMapping("/caummunaute")
    public ResponseEntity<?> createCaummunaute(@RequestBody Caummunaute caummunaute, @RequestParam int adminId) {
        try {
            Caummunaute createdCaummunaute = caummunauteService.createCaummunaute(caummunaute, adminId);
            return new ResponseEntity<>(createdCaummunaute, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating community: " + e.getMessage());
        }
    }

    // Update an existing community
    @PutMapping("/caummunaute/{id}")
    public ResponseEntity<?> updateCaummunaute(@PathVariable int id, @RequestBody Caummunaute updatedCaummunaute) {
        try {
            Caummunaute updatedCommunity = caummunauteService.updateCaummunaute(id, updatedCaummunaute);
            return ResponseEntity.ok(updatedCommunity); // HTTP 200
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error updating community: " + e.getMessage());
        }
    }

    // Delete a community
    @DeleteMapping("/caummunaute/{id}")
    public ResponseEntity<?> deleteCaummunaute(@PathVariable int id) {
        try {
            caummunauteService.deleteCaummunaute(id);
            return ResponseEntity.noContent().build(); // HTTP 204
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error deleting community: " + e.getMessage());
        }
    }
    @GetMapping("/etudiants/search")
    public ResponseEntity<List<Etudiant>> searchEtudiants(@RequestParam(required = false) String firstName,
                                                           @RequestParam(required = false) String lastName,
                                                           @RequestParam(required = false) String filiere,
                                                           @RequestParam(required = false) String email) {
        try {
            List<Etudiant> etudiants = etudiantService.searchEtudiants(firstName, lastName, filiere, email);
            return new ResponseEntity<>(etudiants, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
    }
    
}
