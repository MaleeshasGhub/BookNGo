package com.taxicab.service;

import com.taxicab.model.Driver;
import com.taxicab.model.User;
import com.taxicab.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    // ─── CREATE: Register a new driver ───────────────────────────
    public Driver registerDriver(Driver driver) {
        if (driverRepository.existsByLicenseNumber(driver.getLicenseNumber())) {
            throw new RuntimeException("License number already registered.");
        }
        driver.setUserType(User.UserType.DRIVER);
        return driverRepository.save(driver);
    }

    // ─── READ: Get driver by ID ───────────────────────────────────
    public Driver getDriverById(@NonNull Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));
    }

    // ─── READ: Get all drivers ────────────────────────────────────
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    // ─── READ: Get all available drivers ─────────────────────────
    public List<Driver> getAvailableDrivers() {
        return driverRepository.findByAvailability(Driver.Availability.AVAILABLE);
    }

    // ─── UPDATE: Update driver profile ───────────────────────────
    public Driver updateDriver(@NonNull Long id, Driver updatedDriver) {
        Driver existing = getDriverById(id);
        existing.setFullName(updatedDriver.getFullName());
        existing.setPhone(updatedDriver.getPhone());
        existing.setVehicleType(updatedDriver.getVehicleType());
        existing.setVehiclePlate(updatedDriver.getVehiclePlate());
        return driverRepository.save(existing);
    }

    // ─── UPDATE: Update driver availability ──────────────────────
    public Driver updateAvailability(@NonNull Long id, Driver.Availability availability) {
        Driver driver = getDriverById(id);
        driver.setAvailability(availability);
        return driverRepository.save(driver);
    }

    // ─── DELETE: Remove driver account ───────────────────────────
    public void deleteDriver(@NonNull Long id) {
        if (!driverRepository.existsById(id)) {
            throw new RuntimeException("Driver not found with id: " + id);
        }
        driverRepository.deleteById(id);
    }
}
