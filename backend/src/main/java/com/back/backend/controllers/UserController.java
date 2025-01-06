package com.back.backend.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.back.backend.Entities.Etudiant;
import com.back.backend.Entities.Laureat;

import com.back.backend.dto.PosteWithUserDTO;
import com.back.backend.Entities.Poste;
import com.back.backend.Entities.PosteLikes;
import com.back.backend.Entities.User;
import com.back.backend.enums.TypePoste;
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
private final LaureatService laureatService ;


  
@PostMapping("/api/create-poste")

public ResponseEntity<Map<String, String>> createPoste(
        @RequestParam("textArea") String textArea,
        @RequestParam("typePost") TypePoste typePost,
        @RequestParam("userId") int userId,
        @RequestParam("caummunauteId") int caummunateId,
        @RequestPart(value = "files", required = false) MultipartFile[] files) {

    try {
        // Appel au service pour créer le poste
        userService.createPoste(textArea, typePost, files, userId , caummunateId);

        // Construire une réponse JSON de succès
        Map<String, String> response = new HashMap<>();
        response.put("message", "Poste ajouté avec succès");
        return ResponseEntity.ok(response);

    } catch (RuntimeException e) {
        // Construire une réponse JSON en cas d'erreur
        Map<String, String> response = new HashMap<>();
        response.put("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
    // modifier un poste 
    @PutMapping("/api/update-poste")
    public ResponseEntity<String> updatePoste(@RequestBody Poste poste){
        return laureatService.modifierPoste(poste.getId(), poste.getTextArea()) ;  
    }


    
    // postes can be deleted by bith admins or laureat 
    @DeleteMapping("/api/delete-poste/{id}")
    public ResponseEntity<String> deletePoste(@PathVariable int id){
        return this.posteService.deletePoste(id);
    }

    @PostMapping("/api/like")
    public ResponseEntity<String> likePoste(@RequestBody PosteLikes posteLikes){
        return this.userService.likePoste(posteLikes.getPosteId() ,posteLikes.getUserId());
    }
    @GetMapping("/api/poste/{id}") // for the profile page admins/laureats
    public List<PosteWithUserDTO> getPoste(@PathVariable int id){
        return this.posteService.findPostesByUserId(id) ; 
    }
    @PutMapping("/api/unlike") // id dial le poste
    public ResponseEntity<String> unlikePoste(@RequestBody PosteLikes posteLikes){
        return this.userService.unlikePoste(posteLikes.getPosteId() , posteLikes.getUserId());
    }

  
    @PutMapping("/api/save-picture")
    public ResponseEntity<String> savePicture(@RequestParam("id") int id , @RequestParam("file") MultipartFile file){
        return this.userService.SaveProfilePicture( file , id);
    }

    @GetMapping("/api/profile-picture/{id}")
    public ResponseEntity<byte[]> getProfilePicture(@PathVariable int id){
        return this.userService.getProfileImage(id);
    } 
    @GetMapping("/api/check-likes")
    public boolean checkLikes(@RequestParam int postId, @RequestParam int userId) {
        return this.userService.checklikes(userId, postId);
    }
    
  
    @GetMapping("/api/isLiked")
    public ResponseEntity<Boolean> isLikedPoste(@RequestBody PosteLikes posteLikes) {
        boolean isLiked = posteService.checkLikedPoste(posteLikes);
        return ResponseEntity.ok(isLiked);
    }



   
    
    @GetMapping("/api/profile/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable int id) {
        User user = userService.getUserById(id);  
        return ResponseEntity.ok(user);  
    }

    
    @GetMapping("/api/except-admins")
    public List<User> getAllUsersExceptAdmins() {
        return userService.getAllUsersExceptAdmins();
    }
    @PutMapping("/profile")
public ResponseEntity<?> updateUserProfile(@RequestBody User updatedUser) {
    try {
        // Fetch the current user based on their ID
        User currentUser = userService.getUserById(updatedUser.getId());

        // Check if the current user ID matches the ID of the updatedUser
        if (currentUser == null || currentUser.getId() != updatedUser.getId()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User not authorized to update this profile.");
        }

        // Update common fields
        currentUser.setFirstName(updatedUser.getFirstName());
        currentUser.setLastName(updatedUser.getLastName());
        currentUser.setPassword(updatedUser.getPassword());
        currentUser.setEmail(updatedUser.getEmail());
        currentUser.setPhotoProfile(updatedUser.getPhotoProfile());

        // Check if the user is an instance of Etudiant or Laureat and update accordingly
        if (currentUser instanceof Etudiant etudiant && updatedUser instanceof Etudiant updatedEtudiant) {
            // Update specific fields for Etudiant
            etudiant.setFiliere(updatedEtudiant.getFiliere());
            etudiant.setPhotoProfile(updatedEtudiant.getPhotoProfile());
            // Save as Etudiant
            userService.updateEtudiantProfile((Etudiant) currentUser);
        } else if (currentUser instanceof Laureat laureat && updatedUser instanceof Laureat updatedLaureat) {
            // Update specific fields for Laureat
            laureat.setPromotion(updatedLaureat.getPromotion());
            laureat.setSpecialite(updatedLaureat.getSpecialite());
            laureat.setPhotoProfile(updatedLaureat.getPhotoProfile());
            // Save as Laureat
            userService.updateLaureatProfile((Laureat) currentUser);
        }

        return ResponseEntity.ok("Profile updated successfully.");
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
    }
}

}