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

    
    List<Payment> findByPassenger(User passenger);

    
    Optional<Payment> findByRide(Ride ride);

    
    List<Payment> findByStatus(Payment.PaymentStatus status);

    
    boolean existsByRide(Ride ride);


    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = :status")
    Double sumByStatus(@Param("status") Payment.PaymentStatus status);
}