package com.taxicab.service;

import com.taxicab.model.User;
import com.taxicab.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered: " + user.getEmail());
        }
        
        return userRepository.save(user);
    }

    
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        if (user.getStatus() == User.Status.INACTIVE) {
            throw new RuntimeException("Your account is pending admin approval.");
        }

        return user;
    }

    
    public User getUserById(@NonNull Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    
    public User updateUser(@NonNull Long id, User updatedUser) {
        User existing = getUserById(id);
        existing.setFullName(updatedUser.getFullName());
        existing.setPhone(updatedUser.getPhone());
        existing.setEmail(updatedUser.getEmail());
        
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().trim().isEmpty()) {
            existing.setPassword(updatedUser.getPassword());
        }
        
        return userRepository.save(existing);
    }

    
    @Transactional
    public void deleteUser(@NonNull Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        
        entityManager.createQuery("DELETE FROM Review r WHERE r.passenger.userId = :id OR r.driver.userId = :id").setParameter("id", id).executeUpdate();
        entityManager.createQuery("DELETE FROM Payment p WHERE p.ride.rideId IN (SELECT r.rideId FROM Ride r WHERE r.passenger.userId = :id OR r.driver.userId = :id)").setParameter("id", id).executeUpdate();
        entityManager.createQuery("DELETE FROM Ride r WHERE r.passenger.userId = :id OR r.driver.userId = :id").setParameter("id", id).executeUpdate();
        
        userRepository.deleteById(id);
    }
}