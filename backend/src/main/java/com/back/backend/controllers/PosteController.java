package com.back.backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.back.backend.Entities.Poste;
import com.back.backend.Entities.PosteLikes;
import com.back.backend.services.PosteService;
import com.back.backend.services.UserService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class PosteController {

    private final PosteService posteService;
    private final UserService userService;

    @GetMapping("/api/postes")
    public List<Poste> getAllPostes(){
        return this.posteService.getAllPoste();
    }
    @PutMapping("/api/like")
    public ResponseEntity<String> likePoste(@RequestBody PosteLikes posteLikes){
        return this.userService.likePoste(posteLikes.getPosteId() ,posteLikes.getUserId());
    }
}
