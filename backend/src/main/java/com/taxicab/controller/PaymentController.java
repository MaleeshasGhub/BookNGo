package com.taxicab.controller;

import com.taxicab.model.Payment;
import com.taxicab.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    
    
    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody Map<String, String> body) {
        try {
            Long rideId      = Long.parseLong(body.get("rideId"));
            Long passengerId = Long.parseLong(body.get("passengerId"));
            Payment.PaymentMethod method =
                    Payment.PaymentMethod.valueOf(body.get("method"));
            return ResponseEntity.ok(paymentService.createPayment(rideId, passengerId, method));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
    
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getPayment(@PathVariable @NonNull Long id) {
        try {
            return ResponseEntity.ok(paymentService.getPaymentById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
    
    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<?> getPaymentsByPassenger(@PathVariable @NonNull Long passengerId) {
        try {
            return ResponseEntity.ok(paymentService.getPaymentsByPassenger(passengerId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
    
    @GetMapping("/ride/{rideId}")
    public ResponseEntity<?> getPaymentByRide(@PathVariable @NonNull Long rideId) {
        try {
            return ResponseEntity.ok(paymentService.getPaymentByRide(rideId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable @NonNull Long id,
            @RequestBody Map<String, String> body) {
        try {
            Payment.PaymentStatus status =
                    Payment.PaymentStatus.valueOf(body.get("status"));
            return ResponseEntity.ok(paymentService.updatePaymentStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayment(@PathVariable @NonNull Long id) {
        try {
            paymentService.deletePayment(id);
            return ResponseEntity.ok(Map.of("message", "Payment deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
