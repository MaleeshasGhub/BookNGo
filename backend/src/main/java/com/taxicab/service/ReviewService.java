package com.taxicab.service;

import com.taxicab.model.*;
import com.taxicab.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired private ReviewRepository  reviewRepository;
    @Autowired private RideRepository    rideRepository;
    @Autowired private UserRepository    userRepository;
    @Autowired private DriverRepository  driverRepository;

    
    public Review submitReview(@NonNull Long rideId, @NonNull Long passengerId, int rating, String comment) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getStatus() != Ride.RideStatus.COMPLETED) {
            throw new RuntimeException("You can only review completed rides.");
        }

        if (reviewRepository.existsByRideRideIdAndPassengerUserId(rideId, passengerId)) {
            throw new RuntimeException("You have already reviewed this ride.");
        }

        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5.");
        }

        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        Driver driver = driverRepository.findById(ride.getDriver().getUserId())
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        VerifiedReview review = new VerifiedReview();
        review.setRide(ride);
        review.setPassenger(passenger);
        review.setDriver(driver);
        review.setRating(rating);
        review.setComment(comment);
        review.setStatus(Review.ReviewStatus.VISIBLE);
        review.setVerifiedRide(true);

        
        System.out.println(review.displayReview());

        return reviewRepository.save(review);
    }

    
    public List<Review> getReviewsByDriver(@NonNull Long driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        return reviewRepository.findByDriverAndStatus(driver, Review.ReviewStatus.VISIBLE);
    }

    
    public List<Review> getReviewsByPassenger(@NonNull Long passengerId) {
        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        return reviewRepository.findByPassenger(passenger);
    }

    
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    
    public Review getReviewById(@NonNull Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
    }

    
    public Review updateReview(@NonNull Long id, int rating, String comment) {
        Review review = getReviewById(id);

        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5.");
        }

        review.setRating(rating);
        review.setComment(comment);

        return reviewRepository.save(review);
    }

    
    public Review hideReview(@NonNull Long id) {
        Review review = getReviewById(id);
        review.setStatus(Review.ReviewStatus.HIDDEN);
        return reviewRepository.save(review);
    }

    
    public Review showReview(@NonNull Long id) {
        Review review = getReviewById(id);
        review.setStatus(Review.ReviewStatus.VISIBLE);
        return reviewRepository.save(review);
    }

    
    public void deleteReview(@NonNull Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }
}
