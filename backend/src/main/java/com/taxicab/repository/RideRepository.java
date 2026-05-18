package com.taxicab.repository;

import com.taxicab.model.Ride;
import com.taxicab.model.User;
import com.taxicab.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {

    
    List<Ride> findByPassenger(User passenger);

    
    List<Ride> findByDriver(Driver driver);

    
    List<Ride> findByStatus(Ride.RideStatus status);


    long countByStatus(Ride.RideStatus status);

    
    List<Ride> findByPassengerAndStatus(User passenger, Ride.RideStatus status);

    
    List<Ride> findByDriverAndStatus(Driver driver, Ride.RideStatus status);
}