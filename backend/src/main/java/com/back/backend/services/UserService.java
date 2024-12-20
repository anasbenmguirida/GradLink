package com.back.backend.services;

import com.back.backend.Entities.User;
import com.back.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<String> deleteUser(int id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
    public ResponseEntity<User> getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    public ResponseEntity<User> updateUserProfile(String email, User updatedUser) {
        User existingUser = userRepository.findByEmail(email).orElse(null);
        if (existingUser == null) {
            return ResponseEntity.notFound().build();
        }
        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setPassword(updatedUser.getPassword());
        userRepository.save(existingUser);
        return ResponseEntity.ok(existingUser);
    }
}
