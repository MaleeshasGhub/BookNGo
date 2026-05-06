package service;

public class ReviewService {
    package com.taxicab.service;

import com.taxicab.model.*;
import com.taxicab.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

    @Service
    public class ReviewService {

        @Autowired private ReviewRepository  reviewRepository;
        @Autowired private RideRepository    rideRepository;
        @Autowired private UserRepository    userRepository;
        @Autowired private DriverRepository  driverRepository;

        // ─── CREATE: Submit a new review ─────────────────────────────
        public Review submitReview(Long rideId, Long passengerId, int rating, String comment) {

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

            // Use VerifiedReview since passenger actually completed the ride
            VerifiedReview review = new VerifiedReview();
            review.setRide(ride);
            review.setPassenger(passenger);
            review.setDriver(driver);
            review.setRating(rating);
            review.setComment(comment);
            review.setStatus(Review.ReviewStatus.VISIBLE);
            review.setVerifiedRide(true);

            // Polymorphism: calls VerifiedReview's displayReview()
            System.out.println(review.displayReview());

            return reviewRepository.save(review);
        }

        // ─── READ: Get all reviews for a driver ──────────────────────
        public List<Review> getReviewsByDriver(Long driverId) {
            Driver driver = driverRepository.findById(driverId)
                    .orElseThrow(() -> new RuntimeException("Driver not found"));
            return reviewRepository.findByDriverAndStatus(driver, Review.ReviewStatus.VISIBLE);
        }

        // ─── READ: Get all reviews by a passenger ────────────────────
        public List<Review> getReviewsByPassenger(Long passengerId) {
            User passenger = userRepository.findById(passengerId)
                    .orElseThrow(() -> new RuntimeException("Passenger not found"));
            return reviewRepository.findByPassenger(passenger);
        }

        // ─── READ: Get all reviews (admin) ───────────────────────────
        public List<Review> getAllReviews() {
            return reviewRepository.findAll();
        }

        // ─── READ: Get review by ID ───────────────────────────────────
        public Review getReviewById(Long id) {
            return reviewRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
        }

        // ─── UPDATE: Edit a review ────────────────────────────────────
        public Review updateReview(Long id, int rating, String comment) {
            Review review = getReviewById(id);
            if (rating < 1 || rating > 5) {
                throw new RuntimeException("Rating must be between 1 and 5.");
            }
            review.setRating(rating);
            review.setComment(comment);
            return reviewRepository.save(review);
        }

        // ─── UPDATE: Hide a review (admin moderation) ─────────────────
        public Review hideReview(Long id) {
            Review review = getReviewById(id);
            review.setStatus(Review.ReviewStatus.HIDDEN);
            return reviewRepository.save(review);
        }

        // ─── UPDATE: Show a hidden review ────────────────────────────
        public Review showReview(Long id) {
            Review review = getReviewById(id);
            review.setStatus(Review.ReviewStatus.VISIBLE);
            return reviewRepository.save(review);
        }

        // ─── DELETE: Delete a review ──────────────────────────────────
        public void deleteReview(Long id) {
            if (!reviewRepository.existsById(id)) {
                throw new RuntimeException("Review not found with id: " + id);
            }
            reviewRepository.deleteById(id);
        }
    }

}
