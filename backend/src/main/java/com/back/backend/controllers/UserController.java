package com.back.backend.controllers;

import com.back.backend.Entities.User;
import com.back.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    
    @GetMapping("/profile/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable int id) {
        User user = userService.getUserById(id);  
        return ResponseEntity.ok(user);  
    }
    
    @PutMapping("/profile")
public ResponseEntity<ResponseEntity<User>> updateUserProfile(@RequestBody User updatedUser) {
    String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

    try {
        User currentUser = userService.getUserByEmail(currentUserEmail);
        
        if (!currentUser.getEmail().equals(updatedUser.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Forbidden if the user is not the owner
        }

        ResponseEntity<User> updated = userService.updateUserProfile(currentUser.getEmail(), updatedUser);
        return ResponseEntity.ok(updated);
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Handle user not found
    }
}

}