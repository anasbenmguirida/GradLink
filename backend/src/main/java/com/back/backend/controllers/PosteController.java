package com.back.backend.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RestController;

import com.back.backend.Entities.Poste;
import com.back.backend.Entities.PosteLikes;
import com.back.backend.services.PosteService;
import com.back.backend.services.UserService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")

public class PosteController {

    private final PosteService posteService;

    @GetMapping("/api/postes")  // for the feed 
    public List<Poste> getAllPostes(){
        return this.posteService.getAllPoste();
    }
    
}
