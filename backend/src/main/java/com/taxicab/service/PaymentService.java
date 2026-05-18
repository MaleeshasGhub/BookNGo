package com.taxicab.service;

import com.taxicab.model.Payment;
import com.taxicab.model.Ride;
import com.taxicab.model.User;
import com.taxicab.repository.PaymentRepository;
import com.taxicab.repository.RideRepository;
import com.taxicab.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    @Autowired private PaymentRepository paymentRepository;
    @Autowired private RideRepository    rideRepository;
    @Autowired private UserRepository    userRepository;

    
    public Payment createPayment(@NonNull Long rideId, @NonNull Long passengerId, Payment.PaymentMethod method) {

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

        
        System.out.println(payment.processPayment());

        return paymentRepository.save(payment);
    }

    
    public Payment getPaymentById(@NonNull Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
    }

    
    public List<Payment> getPaymentsByPassenger(@NonNull Long passengerId) {
        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));
        return paymentRepository.findByPassenger(passenger);
    }

    
    public Payment getPaymentByRide(@NonNull Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        return paymentRepository.findByRide(ride)
                .orElseThrow(() -> new RuntimeException("No payment found for this ride"));
    }

    
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    
    public Payment updatePaymentStatus(@NonNull Long id, Payment.PaymentStatus status) {
        Payment payment = getPaymentById(id);
        payment.setStatus(status);
        return paymentRepository.save(payment);
    }

    
    public void deletePayment(@NonNull Long id) {
        Payment payment = getPaymentById(id);
        paymentRepository.deleteById(id);
    }
}
