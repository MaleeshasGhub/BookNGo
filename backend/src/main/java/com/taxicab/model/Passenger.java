package com.taxicab.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;



@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Entity
@Table(name = "passengers")
@PrimaryKeyJoinColumn(name = "user_id")
public class Passenger extends User {

    private String preferredPaymentMethod;
    private int totalRides = 0;

    
    @Override
    public String authenticate() {
        return "Passenger login: " + getEmail() + " | Rides taken: " + totalRides;
    }
}