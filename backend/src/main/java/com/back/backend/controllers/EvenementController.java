package com.back.backend.controllers;

import com.back.backend.Entities.Evenement;
import com.back.backend.services.EvenementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EvenementController {

    @Autowired
    private EvenementService evenementService;

    // Get all events
    @GetMapping
    public List<Evenement> getAllEvents() {
        return evenementService.getAllEvents();
    }

    // Get event by ID
    @GetMapping("/{id}")
    public ResponseEntity<Evenement> getEventById(@PathVariable int id) {
        return evenementService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Reserve a place for an event
    @PostMapping("/{eventId}/reserve")
    public ResponseEntity<String> reservePlace(@PathVariable int eventId, @RequestBody Map<String, Integer> requestBody) {
        int userId = requestBody.get("userId");
        String result = evenementService.reservePlace(eventId, userId);
        switch (result) {
            case "Reservation successful.":
                return ResponseEntity.ok(result);
            case "Event not found.":
                return ResponseEntity.status(404).body(result);
            case "User not found.":
                return ResponseEntity.status(404).body(result);
            default:
                return ResponseEntity.badRequest().body(result);
        }
    }
    
    
}
