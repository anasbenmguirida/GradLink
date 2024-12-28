package com.back.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.back.backend.Entities.Poste;
import com.back.backend.Entities.PosteLikes;
import com.back.backend.Entities.User;
import com.back.backend.services.LaureatService;
import com.back.backend.services.PosteService;
import com.back.backend.services.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
private final UserService userService;
private final PosteService posteService;
private final LaureatService laureatService;


    @PostMapping("/api/create-poste")
    public ResponseEntity<String> createposte(@RequestParam("poste") String posteJson
                                ,@RequestPart(value = "files" , required = false) MultipartFile[] files) throws JsonMappingException, JsonProcessingException {
        this.userService.createPoste(posteJson , files);
        return ResponseEntity.ok("post saved ");
    }
    // postes can be deleted by both admins or laureat 
    @DeleteMapping("/api/delete-poste/{id}")
    public ResponseEntity<String> deletePoste(@PathVariable int id){
        return this.posteService.deletePoste(id);
    }

    @PutMapping("/api/like")
    public ResponseEntity<String> likePoste(@RequestBody PosteLikes posteLikes){
        return this.userService.likePoste(posteLikes.getPosteId() ,posteLikes.getUserId());
    }
    @GetMapping("/api/poste/{id}") // for the profile page admins/laureats
    public List<Poste> getPoste(@PathVariable int id){
        return this.posteService.findPostesByUserId(id) ; 
    }
    @PutMapping("/api/unlike/{posteId}") // id dial le poste
    public ResponseEntity<String> unlikePoste(@PathVariable int posteId , @RequestBody int userId){
        return this.userService.unlikePoste(posteId , userId);
    }
    @PutMapping("/api/save-picture")
    public ResponseEntity<String> savePicture(@RequestParam("id") int id , @RequestParam("file") MultipartFile file){
        return this.userService.SaveProfilePicture( file , id);
    }

    @GetMapping("/api/profile-picture/{id}")
    public String getProfilePicture(@PathVariable int id){
        return this.userService.getProfilePicture(id);
    } 
    @GetMapping("/profile/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable int id) {
        User user = userService.getUserById(id);  
        return ResponseEntity.ok(user);  
    }
    @PostMapping("/api/modifier-poste/{id}")
    public ResponseEntity<String> modifierPoste(@PathVariable int id , @RequestBody String textArea){
        return this.laureatService.modifierPoste(id , textArea);
    }

    @PutMapping("/profile")
    public ResponseEntity<ResponseEntity<User>> updateUserProfile(@RequestBody User updatedUser) {

        try {
            User currentUser = userService.getUserById(updatedUser.getId()); 
    
            if (currentUser.getId() != updatedUser.getId()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }
    
            ResponseEntity<User> updated = userService.updateUserProfile(currentUser.getId(), updatedUser);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

}