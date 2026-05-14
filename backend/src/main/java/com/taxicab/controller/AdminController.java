package com.taxicab.controller;

import com.taxicab.model.Admin;
import com.taxicab.service.AdminService;
import com.taxicab.service.DriverService;
import com.taxicab.service.RideService;
import com.taxicab.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;
    @Autowired
    private UserService userService;
    @Autowired
    private DriverService driverService;
    @Autowired
    private RideService rideService;

    // CREATE ADMIN
    @PostMapping("/register")
    public ResponseEntity<?> createAdmin(@RequestBody Admin admin) {
        try {
            return ResponseEntity.ok(adminService.createAdmin(admin));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DASHBOARD
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // GET ALL ADMINS
    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    // GET ADMIN BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAdmin(@PathVariable @NonNull Long id) {
        try {
            return ResponseEntity.ok(adminService.getAdminById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // USERS
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // DRIVERS
    @GetMapping("/drivers")
    public ResponseEntity<?> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    // RIDES
    @GetMapping("/rides")
    public ResponseEntity<?> getAllRides() {
        return ResponseEntity.ok(rideService.getAllRides());
    }

    // UPDATE ADMIN
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable @NonNull Long id, @RequestBody Admin admin) {
        try {
            return ResponseEntity.ok(adminService.updateAdmin(id, admin));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
