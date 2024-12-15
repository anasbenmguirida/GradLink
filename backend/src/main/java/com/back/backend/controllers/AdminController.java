package com.back.backend.controllers;

import com.back.backend.Entities.Evenement;
import com.back.backend.services.EvenementService;
import com.back.backend.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final EvenementService evenementService;

    // Constructor-based injection for UserService and EvenementService
    public AdminController(UserService userService, EvenementService evenementService) {
        this.userService = userService;
        this.evenementService = evenementService;
    }

    // Endpoint to delete a user profile
    @DeleteMapping("/user/{id}")
    public ResponseEntity<Object> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build(); // Return 204 No Content
    }

    // Endpoint to create an event
    @PostMapping("/api/evenement")
    public ResponseEntity<Evenement> createEvent(@RequestBody Evenement evenement, @RequestParam int adminId) {
        Evenement createdEvent = evenementService.createEvent(evenement, adminId);
        return ResponseEntity.ok(createdEvent); // Return 200 OK with the created event
    }

    // Endpoint to update an event
    @PutMapping("/api/evenement/{eventId}")
    public ResponseEntity<Evenement> updateEvent(@PathVariable int eventId, @RequestBody Evenement updatedEvenement) {
        Evenement updatedEvent = evenementService.updateEvent(eventId, updatedEvenement);
        return ResponseEntity.ok(updatedEvent); // Return 200 OK with the updated event
    }
    // Endpoint to delete an event
    @DeleteMapping("/api/evenement/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable int eventId) {
        evenementService.deleteEvent(eventId);
        return ResponseEntity.noContent().build(); // Return 204 No Content after deletion
        //if it returns 500 there is a 100% chance the event does not exist in the DataBase
    }
}
