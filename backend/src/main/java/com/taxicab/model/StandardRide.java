package com.taxicab.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;



@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Entity
@Table(name = "standard_rides")
@PrimaryKeyJoinColumn(name = "ride_id")
public class StandardRide extends Ride {

    
    private String notes; 

    
    @Override
    public Double calculateFare(double distanceKm) {
        return distanceKm * 50.0;
    }
}