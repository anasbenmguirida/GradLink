package com.back.backend.controllers;

import com.back.backend.Entities.Evenement;
import com.back.backend.services.EvenementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@RestController
@AllArgsConstructor
@NoArgsConstructor
public class EvenementController {

    @Autowired
    private EvenementService evenementService;

    @PostMapping("/api/evenement")
    public ResponseEntity<Evenement> createEvent(@RequestBody Evenement evenement, @RequestParam int adminId) {
        Evenement createdEvent = evenementService.createEvent(evenement, adminId);
        return ResponseEntity.ok(createdEvent);
    }

    @PutMapping("/api/evenement/{eventId}")
    public ResponseEntity<Evenement> updateEvent(@PathVariable int eventId, @RequestBody Evenement updatedEvenement) {
        Evenement updatedEvent = evenementService.updateEvent(eventId, updatedEvenement);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/api/evenement/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable int eventId) {
        evenementService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }
}
