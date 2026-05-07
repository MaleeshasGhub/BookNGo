package com.taxicab.repository;

import com.taxicab.model.Payment;
import com.taxicab.model.Ride;
import com.taxicab.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Get all payments by a passenger
    List<Payment> findByPassenger(User passenger);

    // Get payment for a specific ride
    Optional<Payment> findByRide(Ride ride);

    // Get payments by status
    List<Payment> findByStatus(Payment.PaymentStatus status);

    // Check if a ride already has a payment
    boolean existsByRide(Ride ride);


    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = :status")
    Double sumByStatus(@Param("status") Payment.PaymentStatus status);
}