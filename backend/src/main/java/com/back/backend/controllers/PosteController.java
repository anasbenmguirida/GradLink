package com.back.backend.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.back.backend.Entities.Poste;
import com.back.backend.services.PosteService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class PosteController {

    private final PosteService posteService;

    @GetMapping("/api/postes")
    public List<Poste> getAllPostes(){
        return this.posteService.getAllPoste();
    }
}
