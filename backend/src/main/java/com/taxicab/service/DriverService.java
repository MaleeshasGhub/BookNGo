package com.taxicab.service;

import com.taxicab.model.Driver;
import com.taxicab.model.User;
import com.taxicab.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    @PersistenceContext
    private EntityManager entityManager;

    
    public Driver registerDriver(Driver driver) {
        if (driverRepository.existsByLicenseNumber(driver.getLicenseNumber())) {
            throw new RuntimeException("License number already registered.");
        }
        driver.setUserType(User.UserType.DRIVER);
        driver.setStatus(User.Status.INACTIVE); 
        return driverRepository.save(driver);
    }

    
    public Driver getDriverById(@NonNull Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));
    }

    
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    
    public List<Driver> getAvailableDrivers() {
        return driverRepository.findByAvailability(Driver.Availability.AVAILABLE);
    }

    
    public Driver updateDriver(@NonNull Long id, Driver updatedDriver) {
        Driver existing = getDriverById(id);
        existing.setFullName(updatedDriver.getFullName());
        existing.setPhone(updatedDriver.getPhone());
        existing.setVehicleType(updatedDriver.getVehicleType());
        existing.setVehiclePlate(updatedDriver.getVehiclePlate());
        return driverRepository.save(existing);
    }

    
    public Driver updateAvailability(@NonNull Long id, Driver.Availability availability) {
        Driver driver = getDriverById(id);
        driver.setAvailability(availability);
        return driverRepository.save(driver);
    }

    
    @Transactional
    public void deleteDriver(@NonNull Long id) {
        if (!driverRepository.existsById(id)) {
            throw new RuntimeException("Driver not found with id: " + id);
        }
        
        
        entityManager.createQuery("DELETE FROM Review r WHERE r.passenger.userId = :id OR r.driver.userId = :id").setParameter("id", id).executeUpdate();
        entityManager.createQuery("DELETE FROM Payment p WHERE p.ride.rideId IN (SELECT r.rideId FROM Ride r WHERE r.passenger.userId = :id OR r.driver.userId = :id)").setParameter("id", id).executeUpdate();
        entityManager.createQuery("DELETE FROM Ride r WHERE r.passenger.userId = :id OR r.driver.userId = :id").setParameter("id", id).executeUpdate();
        
        driverRepository.deleteById(id);
    }
}
