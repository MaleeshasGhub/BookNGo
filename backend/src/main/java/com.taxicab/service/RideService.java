package com.taxicab.service;

import com.taxicab.model.Driver;
import com.taxicab.model.Ride;
import com.taxicab.model.User;
import com.taxicab.repository.DriverRepository;
import com.taxicab.repository.RideRepository;
import com.taxicab.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RideService {

    @Autowired private RideRepository   rideRepository;
    @Autowired private UserRepository   userRepository;
    @Autowired private DriverRepository driverRepository;

    // ─── CREATE: Book a new ride ──────────────────────────────────
    public Ride bookRide(Long passengerId, Ride ride) {
        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        ride.setPassenger(passenger);
        ride.setStatus(Ride.RideStatus.PENDING);

        // Calculate fare based on ride type (Polymorphism in action)
        double estimatedDistance = 10.0; // default 10km — can be dynamic later
        ride.setFare(ride.calculateFare(estimatedDistance));

        return rideRepository.save(ride);
    }

    // ─── READ: Get ride by ID ─────────────────────────────────────
    public Ride getRideById(Long id) {
        return rideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ride not found with id: " + id));
    }

    // ─── READ: Get all rides ──────────────────────────────────────
    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }

    // ─── READ: Get rides by passenger ────────────────────────────
    public List<Ride> getRidesByPassenger(Long passengerId) {
        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));
        return rideRepository.findByPassenger(passenger);
    }

    // ─── READ: Get rides by driver ────────────────────────────────
    public List<Ride> getRidesByDriver(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        return rideRepository.findByDriver(driver);
    }

    // ─── READ: Get all pending rides ─────────────────────────────
    public List<Ride> getPendingRides() {
        return rideRepository.findByStatus(Ride.RideStatus.PENDING);
    }

    // ─── UPDATE: Update ride status ───────────────────────────────
    public Ride updateRideStatus(Long rideId, Ride.RideStatus newStatus, Long driverId) {
        Ride ride = getRideById(rideId);

        if (driverId != null) {
            Driver driver = driverRepository.findById(driverId)
                    .orElseThrow(() -> new RuntimeException("Driver not found"));
            ride.setDriver(driver);

            // Update driver availability based on ride status
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

    // ─── DELETE: Cancel a ride ────────────────────────────────────
    public Ride cancelRide(Long rideId) {
        Ride ride = getRideById(rideId);
        if (ride.getStatus() != Ride.RideStatus.PENDING) {
            throw new RuntimeException("Only pending rides can be cancelled.");
        }
        ride.setStatus(Ride.RideStatus.CANCELLED);
        return rideRepository.save(ride);
    }
}