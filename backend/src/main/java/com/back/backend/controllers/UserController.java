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