package com.taxicab.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

// ─── Inheritance: Driver extends User ────────────────────────────────────────
// ─── Encapsulation: all driver data secured in this class ────────────────────
// ─── Polymorphism: overrides authenticate() with driver-specific logic ────────

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Entity
@Table(name = "drivers")
@PrimaryKeyJoinColumn(name = "user_id")
public class Driver extends User {

    @Column(unique = true)
    private String licenseNumber;

    private String vehicleType;   // e.g. "Sedan", "SUV", "Van"
    private String vehiclePlate;  // e.g. "CAB-1234"

    @Enumerated(EnumType.STRING)
    private Availability availability = Availability.AVAILABLE;

    public enum Availability {
        AVAILABLE, BUSY, OFFLINE
    }

    // ─── Polymorphism: driver-specific authentication ─────────────
    @Override
    public String authenticate() {
        return "Driver login: " + getEmail() + " | Vehicle: " + vehiclePlate;
    }
}
