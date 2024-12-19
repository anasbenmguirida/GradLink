package com.back.backend.controllers;

import com.back.backend.Entities.Evenement;
import com.back.backend.services.EvenementService;
import com.back.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@RestController
@AllArgsConstructor
@NoArgsConstructor
public class AdminController {

    @Autowired
    private EvenementService evenementService;

    @Autowired
    private UserService userService;

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

    @DeleteMapping("/api/user/{id}")
    public ResponseEntity<Object> deleteUser(@PathVariable int id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting user: " + e.getMessage());
        }
    }
}
