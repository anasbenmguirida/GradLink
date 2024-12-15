package com.back.backend.controllers;

import com.back.backend.Entities.Evenement;
import com.back.backend.services.EvenementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/evenement")
public class EvenementController {

    private final EvenementService evenementService;

    // Constructor-based dependency injection
    public EvenementController(EvenementService evenementService) {
        this.evenementService = evenementService;
    }

    // Endpoint to create an event
    @PostMapping
    public ResponseEntity<Evenement> createEvent(@RequestBody Evenement evenement, @RequestParam int adminId) {
        Evenement createdEvent = evenementService.createEvent(evenement, adminId);
        return ResponseEntity.ok(createdEvent); // Return 200 OK with the created event
    }

    // Endpoint to update an event
    @PutMapping("/{eventId}")
    public ResponseEntity<Evenement> updateEvent(@PathVariable int eventId, @RequestBody Evenement updatedEvenement) {
        Evenement updatedEvent = evenementService.updateEvent(eventId, updatedEvenement);
        return ResponseEntity.ok(updatedEvent); // Return 200 OK with the updated event
    }

    // Endpoint to delete an event
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable int eventId) {
        evenementService.deleteEvent(eventId);
        return ResponseEntity.noContent().build(); // Return 204 No Content after deletion
        // If it returns 500, there is a high chance the event does not exist in the database
    }
}
