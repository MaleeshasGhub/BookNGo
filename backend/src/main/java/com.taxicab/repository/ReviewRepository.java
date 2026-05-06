package com.taxicab.repository;

import com.taxicab.model.Driver;
import com.taxicab.model.Review;
import com.taxicab.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByDriver(Driver driver);

    List<Review> findByPassenger(User passenger);

    List<Review> findByDriverAndStatus(Driver driver, Review.ReviewStatus status);

    List<Review> findByStatus(Review.ReviewStatus status);

    boolean existsByRideRideIdAndPassengerUserId(Long rideId, Long passengerId);
}