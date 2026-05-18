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
@Table(name = "rides")
@Inheritance(strategy = InheritanceType.JOINED)
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rideId;

    @ManyToOne
    @JoinColumn(name = "passenger_id", nullable = false)
    private User passenger;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @Column(nullable = false)
    private String pickupLocation;

    @Column(nullable = false)
    private String dropoffLocation;

    @Enumerated(EnumType.STRING)
    private RideType rideType = RideType.STANDARD;

    @Enumerated(EnumType.STRING)
    private RideStatus status = RideStatus.PENDING;

    private LocalDateTime bookedAt = LocalDateTime.now();

    private Double fare;

    public enum RideType   { STANDARD, PREMIUM }
    public enum RideStatus { PENDING, ACCEPTED, ONGOING, COMPLETED, CANCELLED }

    
    
    public Double calculateFare(double distanceKm) {
        return distanceKm * 50.0; 
    }
}