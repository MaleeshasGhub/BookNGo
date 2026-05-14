package com.taxicab.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

// ─── Inheritance: Passenger extends User ─────────────────────────────────────
// ─── Polymorphism: overrides authenticate() with passenger-specific logic ─────

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Entity
@Table(name = "passengers")
@PrimaryKeyJoinColumn(name = "user_id")
public class Passenger extends User {

    private String preferredPaymentMethod;
    private int totalRides = 0;

    // ─── Polymorphism: passenger-specific authentication ─────────
    @Override
    public String authenticate() {
        return "Passenger login: " + getEmail() + " | Rides taken: " + totalRides;
    }
}