package com.taxicab.service;

import com.taxicab.model.Payment;
import com.taxicab.model.Ride;
import com.taxicab.model.User;
import com.taxicab.repository.PaymentRepository;
import com.taxicab.repository.RideRepository;
import com.taxicab.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    @Autowired private PaymentRepository paymentRepository;
    @Autowired private RideRepository    rideRepository;
    @Autowired private UserRepository    userRepository;

    // ─── CREATE: Record a new payment ────────────────────────────
    public Payment createPayment(Long rideId, Long passengerId, Payment.PaymentMethod method) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getStatus() != Ride.RideStatus.COMPLETED) {
            throw new RuntimeException("Payment can only be made for completed rides.");
        }

        if (paymentRepository.existsByRide(ride)) {
            throw new RuntimeException("Payment already recorded for this ride.");
        }

        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        Payment payment = new Payment();
        payment.setRide(ride);
        payment.setPassenger(passenger);
        payment.setAmount(ride.getFare());
        payment.setMethod(method);
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setPaidAt(LocalDateTime.now());

        // Polymorphism: calls the right processPayment() message
        System.out.println(payment.processPayment());

        return paymentRepository.save(payment);
    }

    // ─── READ: Get payment by ID ──────────────────────────────────
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
    }

    // ─── READ: Get all payments by passenger ─────────────────────
    public List<Payment> getPaymentsByPassenger(Long passengerId) {
        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));
        return paymentRepository.findByPassenger(passenger);
    }

    // ─── READ: Get payment by ride ────────────────────────────────
    public Payment getPaymentByRide(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        return paymentRepository.findByRide(ride)
                .orElseThrow(() -> new RuntimeException("No payment found for this ride"));
    }

    // ─── READ: Get all payments (admin) ──────────────────────────
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // ─── UPDATE: Update payment status ───────────────────────────
    public Payment updatePaymentStatus(Long id, Payment.PaymentStatus status) {
        Payment payment = getPaymentById(id);
        payment.setStatus(status);
        return paymentRepository.save(payment);
    }

    // ─── DELETE: Remove failed/invalid payment ────────────────────
    public void deletePayment(Long id) {
        Payment payment = getPaymentById(id);
        if (payment.getStatus() == Payment.PaymentStatus.COMPLETED) {
            throw new RuntimeException("Cannot delete a completed payment.");
        }
        paymentRepository.deleteById(id);
    }
}
