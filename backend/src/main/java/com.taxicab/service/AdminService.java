package com.taxicab.service;

import com.taxicab.model.*;
import com.taxicab.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired private AdminRepository   adminRepository;
    @Autowired private UserRepository    userRepository;
    @Autowired private DriverRepository  driverRepository;
    @Autowired private RideRepository    rideRepository;
    @Autowired private PaymentRepository paymentRepository;

    // ─── CREATE: Register a new admin ────────────────────────────
    public Admin createAdmin(Admin admin) {
        if (adminRepository.existsByEmail(admin.getEmail())) {
            throw new RuntimeException("Admin with this email already exists.");
        }
        admin.setUserType(User.UserType.ADMIN);
        return adminRepository.save(admin);
    }

    // ─── READ: Get admin by ID ────────────────────────────────────
    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
    }

    // ─── READ: Get all admins ─────────────────────────────────────
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    // ─── READ: System dashboard stats ────────────────────────────
    // Abstraction: complex DB queries hidden behind a simple method
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers",    userRepository.count());
        stats.put("totalDrivers",  driverRepository.count());
        stats.put("totalRides",    rideRepository.count());
        stats.put("totalPayments", paymentRepository.count());
        stats.put("pendingRides",  rideRepository.findByStatus(Ride.RideStatus.PENDING).size());
        stats.put("completedRides",rideRepository.findByStatus(Ride.RideStatus.COMPLETED).size());

        double totalRevenue = paymentRepository.findAll()
                .stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.COMPLETED)
                .mapToDouble(Payment::getAmount)
                .sum();
        stats.put("totalRevenue", totalRevenue);
        return stats;
    }

    // ─── UPDATE: Update admin permissions ────────────────────────
    public Admin updateAdmin(Long id, Admin updatedAdmin) {
        Admin existing = getAdminById(id);
        existing.setFullName(updatedAdmin.getFullName());
        existing.setPhone(updatedAdmin.getPhone());
        existing.setPermissions(updatedAdmin.getPermissions());
        return adminRepository.save(existing);
    }

    // ─── DELETE: Remove admin account ────────────────────────────
    public void deleteAdmin(Long id) {
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("Admin not found with id: " + id);
        }
        adminRepository.deleteById(id);
    }

    // ─── Admin action: deactivate any user ───────────────────────
    public User deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.Status.INACTIVE);
        return userRepository.save(user);
    }

    // ─── Admin action: reactivate any user ───────────────────────
    public User reactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.Status.ACTIVE);
        return userRepository.save(user);
    }
}
