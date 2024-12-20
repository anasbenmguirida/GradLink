package com.back.backend.controllers;

import com.back.backend.Entities.User;
import com.back.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    
    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@RequestParam String email) {
        return userService.getUserByEmail(email);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateUserProfile(@RequestParam String email, @RequestBody User updatedUser) {
        return userService.updateUserProfile(email, updatedUser);
    }
}