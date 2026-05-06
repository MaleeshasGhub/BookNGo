package com.taxicab.repository;

import com.taxicab.model.Driver;
import com.taxicab.model.Review;
import com.taxicab.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

    @Repository
    public interface ReviewRepository extends JpaRepository<Review, Long> {

        // Get all reviews for a specific driver
        List<Review> findByDriver(Driver driver);

        // Get all reviews by a specific passenger
        List<Review> findByPassenger(User passenger);

        // Get all visible reviews for a driver
        List<Review> findByDriverAndStatus(Driver driver, Review.ReviewStatus status);

        // Get all reviews by status (for admin moderation)
        List<Review> findByStatus(Review.ReviewStatus status);

        // Check if passenger already reviewed a ride
        boolean existsByRideRideIdAndPassengerUserId(Long rideId, Long passengerId);
    }


