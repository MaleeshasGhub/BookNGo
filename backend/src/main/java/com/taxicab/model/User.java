package com.taxicab.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

// ─── Encapsulation: all fields are private, accessed via getters/setters (Lombok @Data) ───
// ─── Inheritance:  Passenger and Admin extend this class ────────────────────────────────

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType userType = UserType.PASSENGER;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // ─── Enums ───────────────────────────────────────────────────
    public enum UserType { PASSENGER, DRIVER, ADMIN }
    public enum Status   { ACTIVE, INACTIVE }

    // ─── Polymorphism: subclasses override this to provide
    //     different authentication behaviour ────────────────────
    public String authenticate() {
        return "Authenticating user: " + email;
    }
}