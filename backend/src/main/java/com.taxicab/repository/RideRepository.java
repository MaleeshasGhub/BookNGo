package com.taxicab.repository;

import com.taxicab.model.Ride;
import com.taxicab.model.User;
import com.taxicab.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {

    // Get all rides by a specific passenger
    List<Ride> findByPassenger(User passenger);

    // Get all rides by a specific driver
    List<Ride> findByDriver(Driver driver);

    // Get all rides by status
    List<Ride> findByStatus(Ride.RideStatus status);


    long countByStatus(Ride.RideStatus status);

    // Get ride history for a passenger (completed rides)
    List<Ride> findByPassengerAndStatus(User passenger, Ride.RideStatus status);

    // Get active ride for a driver
    List<Ride> findByDriverAndStatus(Driver driver, Ride.RideStatus status);
}