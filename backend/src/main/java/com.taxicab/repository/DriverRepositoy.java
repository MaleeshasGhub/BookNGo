package com.taxicab.repository;

import com.taxicab.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {

    // Find driver by license number
    Optional<Driver> findByLicenseNumber(String licenseNumber);

    // Check if license already exists
    boolean existsByLicenseNumber(String licenseNumber);

    // Get all available drivers
    List<Driver> findByAvailability(Driver.Availability availability);

    // Find by vehicle plate
    Optional<Driver> findByVehiclePlate(String vehiclePlate);
}
