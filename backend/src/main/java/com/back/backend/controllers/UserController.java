package com.back.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.back.backend.Entities.PosteLikes;
import com.back.backend.services.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class UserController {
private final UserService userService;


    @PostMapping("/api/create-poste")
    public ResponseEntity<String> createposte(@RequestParam("poste") String posteJson
                                ,@RequestPart(value = "file" , required = false) MultipartFile file) throws JsonMappingException, JsonProcessingException {
        this.userService.createPoste(posteJson , file);
        return ResponseEntity.ok("post saved ");
    }

    @PutMapping("/api/like")
    public ResponseEntity<String> likePoste(@RequestBody PosteLikes posteLikes){
        return this.userService.likePoste(posteLikes.getPosteId() ,posteLikes.getUserId());
    }
}
