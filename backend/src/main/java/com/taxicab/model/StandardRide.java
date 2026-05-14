package com.taxicab.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

// ─── Inheritance: StandardRide extends Ride ───────────────────────────────────
// ─── Polymorphism: overrides calculateFare() with standard pricing ────────────

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Entity
@Table(name = "standard_rides")
@PrimaryKeyJoinColumn(name = "ride_id")
public class StandardRide extends Ride {

    // Standard rides have no extra features
    private String notes; // optional passenger note

    // ─── Polymorphism: standard rate — Rs.50 per km ───────────────
    @Override
    public Double calculateFare(double distanceKm) {
        return distanceKm * 50.0;
    }
}