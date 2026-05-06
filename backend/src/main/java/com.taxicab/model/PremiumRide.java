package com.taxicab.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

// ─── Inheritance: PremiumRide extends Ride ────────────────────────────────────
// ─── Polymorphism: overrides calculateFare() with premium pricing ─────────────

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Entity
@Table(name = "premium_rides")
@PrimaryKeyJoinColumn(name = "ride_id")
public class PremiumRide extends Ride {

    private boolean airConditioned = true;
    private String  vehiclePreference; // e.g. "SUV", "Luxury Sedan"

    // ─── Polymorphism: premium rate — Rs.100 per km ───────────────
    @Override
    public Double calculateFare(double distanceKm) {
        return distanceKm * 100.0;
    }
}