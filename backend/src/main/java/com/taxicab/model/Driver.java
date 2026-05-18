package com.taxicab.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;



@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Entity
@Table(name = "drivers")
@PrimaryKeyJoinColumn(name = "user_id")
public class Driver extends User {

    @Column(unique = true)
    private String licenseNumber;

    private String vehicleType;   
    private String vehiclePlate;  

    @Enumerated(EnumType.STRING)
    private Availability availability = Availability.AVAILABLE;

    public enum Availability {
        AVAILABLE, BUSY, OFFLINE
    }

    
    @Override
    public String authenticate() {
        return "Driver login: " + getEmail() + " | Vehicle: " + vehiclePlate;
    }
}
