package com.taxicab.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

// ─── Encapsulation: all review data secured in this class ────────────────────
// ─── Inheritance:  PublicReview and VerifiedReview extend this class ──────────
// ─── Polymorphism: displayReview() differs between review types ───────────────

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Entity
    @Table(name = "reviews")
    @Inheritance(strategy = InheritanceType.JOINED)
    public class Review {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long reviewId;

        @ManyToOne
        @JoinColumn(name = "ride_id", nullable = false)
        private Ride ride;

        @ManyToOne
        @JoinColumn(name = "passenger_id", nullable = false)
        private User passenger;

        @ManyToOne
        @JoinColumn(name = "driver_id", nullable = false)
        private Driver driver;

        @Column(nullable = false)
        private int rating; // 1 to 5

        private String comment;

        @Enumerated(EnumType.STRING)
        private ReviewStatus status = ReviewStatus.VISIBLE;

        private LocalDateTime createdAt = LocalDateTime.now();

        public enum ReviewStatus { VISIBLE, HIDDEN }

        // ─── Polymorphism: subclasses override display behaviour ──────
        public String displayReview() {
            return "Review by passenger " + passenger.getFullName()
                    + " | Rating: " + rating + "/5 | " + comment;
        }
    }

