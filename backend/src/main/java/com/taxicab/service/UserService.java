package com.taxicab.service;

import com.taxicab.model.User;
import com.taxicab.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // ─── CREATE: Register a new user ─────────────────────────────
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered: " + user.getEmail());
        }
        // In production: hash the password before saving
        return userRepository.save(user);
    }

    // ─── READ: Login ──────────────────────────────────────────────
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }
        return user;
    }

    // ─── READ: Get user by ID ─────────────────────────────────────
    public User getUserById(@NonNull Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // ─── READ: Get all users (admin use) ──────────────────────────
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ─── UPDATE: Update user profile ──────────────────────────────
    public User updateUser(Long id, User updatedUser) {
        User existing = getUserById(id);
        existing.setFullName(updatedUser.getFullName());
        existing.setPhone(updatedUser.getPhone());
        existing.setEmail(updatedUser.getEmail());
        return userRepository.save(existing);
    }

    // ─── DELETE: Delete user account ──────────────────────────────
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}