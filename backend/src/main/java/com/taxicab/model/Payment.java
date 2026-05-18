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
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @ManyToOne
    @JoinColumn(name = "ride_id", nullable = false)
    private Ride ride;

    @ManyToOne
    @JoinColumn(name = "passenger_id", nullable = false)
    private User passenger;

    @Column(nullable = false)
    private Double amount;

    @Enumerated(EnumType.STRING)
    private PaymentMethod method = PaymentMethod.CASH;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status = PaymentStatus.PENDING;

    private LocalDateTime paidAt = LocalDateTime.now();

    public enum PaymentMethod { CASH, CARD, WALLET }
    public enum PaymentStatus { PENDING, COMPLETED, FAILED }

    
    public String processPayment() {
        return switch (method) {
            case CASH   -> "Processing cash payment of Rs. " + amount;
            case CARD   -> "Processing card payment of Rs. " + amount + " via gateway";
            case WALLET -> "Deducting Rs. " + amount + " from wallet balance";
        };
    }
}
