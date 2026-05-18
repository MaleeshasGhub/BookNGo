package com.taxicab.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;



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
        private int rating; 

        private String comment;

        @Enumerated(EnumType.STRING)
        private ReviewStatus status = ReviewStatus.VISIBLE;

        private LocalDateTime createdAt = LocalDateTime.now();

        public enum ReviewStatus { VISIBLE, HIDDEN }

        
        public String displayReview() {
            return "Review by passenger " + passenger.getFullName()
                    + " | Rating: " + rating + "/5 | " + comment;
        }
    }

