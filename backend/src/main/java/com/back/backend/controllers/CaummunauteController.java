package com.back.backend.controllers;

import com.back.backend.Entities.Caummunaute;
import com.back.backend.services.CaummunauteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/caummunautes")
public class CaummunauteController {

    private final CaummunauteService caummunauteService;

    public CaummunauteController(CaummunauteService caummunauteService) {
        this.caummunauteService = caummunauteService;
    }

    @PostMapping
    public ResponseEntity<Caummunaute> createCaummunaute(@RequestBody Caummunaute caummunaute, @RequestParam int adminId) {
        Caummunaute createdCaummunaute = caummunauteService.createCaummunaute(caummunaute, adminId);
        return ResponseEntity.ok(createdCaummunaute);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Caummunaute> updateCaummunaute(@PathVariable int id, @RequestBody Caummunaute updatedCaummunaute) {
        Caummunaute updated = caummunauteService.updateCaummunaute(id, updatedCaummunaute);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCaummunaute(@PathVariable int id) {
        caummunauteService.deleteCaummunaute(id);
        return ResponseEntity.noContent().build();
    }

    //Check m3a front wash n addew a method for retrieving all Caummunaute entities created by a specific admin
}
