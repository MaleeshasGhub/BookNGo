package Controller;

public class AdminController {
    package com.taxicab.controller;

import com.taxicab.model.Admin;
import com.taxicab.service.AdminService;
import com.taxicab.service.DriverService;
import com.taxicab.service.RideService;
import com.taxicab.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

    @RestController
    @RequestMapping("/api/admin")
    public class AdminController {

        @Autowired private AdminService  adminService;
        @Autowired private UserService   userService;
        @Autowired private DriverService driverService;
        @Autowired private RideService   rideService;

        // ─── POST /api/admin/register ─────────────────────────────────
        // Create a new admin account
        @PostMapping("/register")
        public ResponseEntity<?> createAdmin(@RequestBody Admin admin) {
            try {
                return ResponseEntity.ok(adminService.createAdmin(admin));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }

        // ─── GET /api/admin/dashboard ─────────────────────────────────
        // Called by Dashboard.jsx — returns system-wide stats
        @GetMapping("/dashboard")
        public ResponseEntity<Map<String, Object>> getDashboard() {
            return ResponseEntity.ok(adminService.getDashboardStats());
        }

        // ─── GET /api/admin ───────────────────────────────────────────
        // List all admins
        @GetMapping
        public ResponseEntity<List<Admin>> getAllAdmins() {
            return ResponseEntity.ok(adminService.getAllAdmins());
        }

        // ─── GET /api/admin/{id} ──────────────────────────────────────
        @GetMapping("/{id}")
        public ResponseEntity<?> getAdmin(@PathVariable Long id) {
            try {
                return ResponseEntity.ok(adminService.getAdminById(id));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }

        // ─── GET /api/admin/users ─────────────────────────────────────
        // Called by ManageUsers.jsx
        @GetMapping("/users")
        public ResponseEntity<?> getAllUsers() {
            return ResponseEntity.ok(userService.getAllUsers());
        }

        // ─── GET /api/admin/drivers ───────────────────────────────────
        // Called by ManageDrivers.jsx
        @GetMapping("/drivers")
        public ResponseEntity<?> getAllDrivers() {
            return ResponseEntity.ok(driverService.getAllDrivers());
        }

        // ─── GET /api/admin/rides ─────────────────────────────────────
        // Called by MonitorRides.jsx
        @GetMapping("/rides")
        public ResponseEntity<?> getAllRides() {
            return ResponseEntity.ok(rideService.getAllRides());
        }

        // ─── PUT /api/admin/{id} ──────────────────────────────────────
        // Update admin permissions or profile
        @PutMapping("/{id}")
        public ResponseEntity<?> updateAdmin(@PathVariable Long id, @RequestBody Admin admin) {
            try {
                return ResponseEntity.ok(adminService.updateAdmin(id, admin));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }

        // ─── PUT /api/admin/users/{id}/deactivate ────────────────────
        // Called by ManageUsers.jsx to ban a user
        @PutMapping("/users/{id}/deactivate")
        public ResponseEntity<?> deactivateUser(@PathVariable Long id) {
            try {
                return ResponseEntity.ok(adminService.deactivateUser(id));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }

        // ─── PUT /api/admin/users/{id}/reactivate ────────────────────
        @PutMapping("/users/{id}/reactivate")
        public ResponseEntity<?> reactivateUser(@PathVariable Long id) {
            try {
                return ResponseEntity.ok(adminService.reactivateUser(id));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }

        // ─── DELETE /api/admin/{id} ───────────────────────────────────
        @DeleteMapping("/{id}")
        public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
            try {
                adminService.deleteAdmin(id);
                return ResponseEntity.ok(Map.of("message", "Admin deleted successfully"));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }

        // ─── DELETE /api/admin/users/{id} ────────────────────────────
        // Called by ManageUsers.jsx to remove a user
        @DeleteMapping("/users/{id}")
        public ResponseEntity<?> deleteUser(@PathVariable Long id) {
            try {
                userService.deleteUser(id);
                return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }

        // ─── DELETE /api/admin/drivers/{id} ──────────────────────────
        // Called by ManageDrivers.jsx to remove a driver
        @DeleteMapping("/drivers/{id}")
        public ResponseEntity<?> deleteDriver(@PathVariable Long id) {
            try {
                driverService.deleteDriver(id);
                return ResponseEntity.ok(Map.of("message", "Driver deleted successfully"));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }
    }



}
