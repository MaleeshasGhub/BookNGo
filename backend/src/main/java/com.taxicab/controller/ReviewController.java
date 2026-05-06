package Controller;

public class ReviewController {

    package com.taxicab.controller;

import com.taxicab.model.Review;
import com.taxicab.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

    @RestController
    @RequestMapping("/api/reviews")
    public class ReviewController {

        @Autowired
        private ReviewService reviewService;

        // ─── POST /api/reviews ────────────────────────────────────────
        @PostMapping
        public ResponseEntity<?> submitReview(@RequestBody Map<String, String> body) {
            try {
                Long   rideId      = Long.parseLong(body.get("rideId"));
                Long   passengerId = Long.parseLong(body.get("passengerId"));
                int    rating      = Integer.parseInt(body.get("rating"));
                String comment     = body.get("comment");
                return ResponseEntity.ok(reviewService.submitReview(rideId, passengerId, rating, comment));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }

        // ─── GET /api/reviews ─────────────────────────────────────────
        @GetMapping
        public ResponseEntity<List<Review>> getAllReviews() {
            return ResponseEntity.ok(reviewService.getAllReviews());
        }

        // ─── GET /api/reviews/{id} ────────────────────────────────────
        @GetMapping("/{id}")
        public ResponseEntity<?> getReview(@PathVariable Long id) {
            try {
                return ResponseEntity.ok(reviewService.getReviewById(id));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }

        // ─── GET /api/reviews/driver/{driverId} ───────────────────────
        @GetMapping("/driver/{driverId}")
        public ResponseEntity<?> getReviewsByDriver(@PathVariable Long driverId) {
            try {
                return ResponseEntity.ok(reviewService.getReviewsByDriver(driverId));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }

        // ─── GET /api/reviews/passenger/{passengerId} ─────────────────
        @GetMapping("/passenger/{passengerId}")
        public ResponseEntity<?> getReviewsByPassenger(@PathVariable Long passengerId) {
            try {
                return ResponseEntity.ok(reviewService.getReviewsByPassenger(passengerId));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }

        // ─── PUT /api/reviews/{id} ────────────────────────────────────
        @PutMapping("/{id}")
        public ResponseEntity<?> updateReview(@PathVariable Long id, @RequestBody Map<String, String> body) {
            try {
                int    rating  = Integer.parseInt(body.get("rating"));
                String comment = body.get("comment");
                return ResponseEntity.ok(reviewService.updateReview(id, rating, comment));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }

        // ─── PUT /api/reviews/{id}/hide ───────────────────────────────
        @PutMapping("/{id}/hide")
        public ResponseEntity<?> hideReview(@PathVariable Long id) {
            try {
                return ResponseEntity.ok(reviewService.hideReview(id));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }

        // ─── PUT /api/reviews/{id}/show ───────────────────────────────
        @PutMapping("/{id}/show")
        public ResponseEntity<?> showReview(@PathVariable Long id) {
            try {
                return ResponseEntity.ok(reviewService.showReview(id));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }

        // ─── DELETE /api/reviews/{id} ─────────────────────────────────
        @DeleteMapping("/{id}")
        public ResponseEntity<?> deleteReview(@PathVariable Long id) {
            try {
                reviewService.deleteReview(id);
                return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        }
    }

}
