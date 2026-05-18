package com.taxicab.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;



@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Entity
@Table(name = "premium_rides")
@PrimaryKeyJoinColumn(name = "ride_id")
public class PremiumRide extends Ride {

    private boolean airConditioned = true;
    private String  vehiclePreference; 

    
    @Override
    public Double calculateFare(double distanceKm) {
        return distanceKm * 100.0;
    }
}