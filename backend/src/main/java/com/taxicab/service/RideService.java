package com.taxicab.service;

import com.taxicab.model.Driver;
import com.taxicab.model.Ride;
import com.taxicab.model.User;
import com.taxicab.repository.DriverRepository;
import com.taxicab.repository.RideRepository;
import com.taxicab.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Service
public class RideService {

    @Autowired private RideRepository   rideRepository;
    @Autowired private UserRepository   userRepository;
    @Autowired private DriverRepository driverRepository;
    
    @PersistenceContext private EntityManager entityManager;

    
    public Ride bookRide(@NonNull Long passengerId, Ride ride) {
        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        ride.setPassenger(passenger);
        ride.setStatus(Ride.RideStatus.PENDING);

        
        double estimatedDistance = 10.0; 
        ride.setFare(ride.calculateFare(estimatedDistance));

        return rideRepository.save(ride);
    }

    
    public Ride getRideById(@NonNull Long id) {
        return rideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ride not found with id: " + id));
    }

    
    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }

    
    public List<Ride> getRidesByPassenger(@NonNull Long passengerId) {
        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));
        return rideRepository.findByPassenger(passenger);
    }

    
    public List<Ride> getRidesByDriver(@NonNull Long driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        return rideRepository.findByDriver(driver);
    }

    
    public List<Ride> getPendingRides() {
        return rideRepository.findByStatus(Ride.RideStatus.PENDING);
    }

    
    public Ride updateRideStatus(@NonNull Long rideId, Ride.RideStatus newStatus, Long driverId) {
        Ride ride = getRideById(rideId);

        if (driverId != null) {
            Driver driver = driverRepository.findById(driverId)
                    .orElseThrow(() -> new RuntimeException("Driver not found"));
            ride.setDriver(driver);

            
            if (newStatus == Ride.RideStatus.ACCEPTED || newStatus == Ride.RideStatus.ONGOING) {
                driver.setAvailability(Driver.Availability.BUSY);
            } else if (newStatus == Ride.RideStatus.COMPLETED || newStatus == Ride.RideStatus.CANCELLED) {
                driver.setAvailability(Driver.Availability.AVAILABLE);
            }
            driverRepository.save(driver);
        }

        ride.setStatus(newStatus);
        return rideRepository.save(ride);
    }

    
    public Ride cancelRide(@NonNull Long rideId) {
        Ride ride = getRideById(rideId);
        if (ride.getStatus() != Ride.RideStatus.PENDING) {
            throw new RuntimeException("Only pending rides can be cancelled.");
        }
        ride.setStatus(Ride.RideStatus.CANCELLED);
        return rideRepository.save(ride);
    }

    
    @Transactional
    public void deleteRide(@NonNull Long rideId) {
        if (!rideRepository.existsById(rideId)) {
            throw new RuntimeException("Ride not found with id: " + rideId);
        }
        
        entityManager.createQuery("DELETE FROM Payment p WHERE p.ride.rideId = :id").setParameter("id", rideId).executeUpdate();
        
        entityManager.createQuery("DELETE FROM Review r WHERE r.ride.rideId = :id").setParameter("id", rideId).executeUpdate();
        
        rideRepository.deleteById(rideId);
    }
}