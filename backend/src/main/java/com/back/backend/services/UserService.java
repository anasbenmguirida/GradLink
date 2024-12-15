package com.back.backend.services;

import com.back.backend.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public void deleteUser(Integer userId) {
        // Check if the user exists
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User with ID " + userId + " not found");
        }
        // Delete the user
        userRepository.deleteById(userId);

    }
}
