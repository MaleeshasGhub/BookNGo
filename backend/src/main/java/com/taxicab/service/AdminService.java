package com.taxicab.service;

// Spring
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;

// Models
import com.taxicab.model.Admin;
import com.taxicab.model.User;
import com.taxicab.model.Ride;
import com.taxicab.model.Payment;

// Repositories
import com.taxicab.repository.AdminRepository;
import com.taxicab.repository.UserRepository;
import com.taxicab.repository.DriverRepository;
import com.taxicab.repository.RideRepository;
import com.taxicab.repository.PaymentRepository;

// Java Utils
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class AdminService {

    @Autowired private AdminRepository adminRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private DriverRepository driverRepository;
    @Autowired private RideRepository rideRepository;
    @Autowired private PaymentRepository paymentRepository;

    
    public Admin createAdmin(Admin admin) {
        if (adminRepository.existsByEmail(admin.getEmail())) {
            throw new RuntimeException("Admin with this email already exists.");
        }
        admin.setUserType(User.UserType.ADMIN);
        return adminRepository.save(admin);
    }

    
    public Admin getAdminById(@NonNull Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalUsers", userRepository.count());
        stats.put("totalDrivers", driverRepository.count());
        stats.put("totalRides", rideRepository.count());
        stats.put("totalPayments", paymentRepository.count());

        stats.put("pendingRides", rideRepository.countByStatus(Ride.RideStatus.PENDING));
        stats.put("completedRides", rideRepository.countByStatus(Ride.RideStatus.COMPLETED));

        stats.put("totalRevenue",
                paymentRepository.sumByStatus(Payment.PaymentStatus.COMPLETED));

        return stats;
    }

    
    public Admin updateAdmin(@NonNull Long id, Admin updatedAdmin) {
        Admin existing = getAdminById(id);
        existing.setFullName(updatedAdmin.getFullName());
        existing.setPhone(updatedAdmin.getPhone());
        existing.setPermissions(updatedAdmin.getPermissions());
        return adminRepository.save(existing);
    }

    
    public void deleteAdmin(@NonNull Long id) {
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("Admin not found with id: " + id);
        }
        adminRepository.deleteById(id);
    }

    
    public User deactivateUser(@NonNull Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(User.Status.INACTIVE);
        return userRepository.save(user);
    }

    public User reactivateUser(@NonNull Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(User.Status.ACTIVE);
        return userRepository.save(user);
    }
}