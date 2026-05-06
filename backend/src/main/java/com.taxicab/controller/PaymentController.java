package com.taxicab.controller;

import com.taxicab.model.Payment;
import com.taxicab.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // ─── POST /api/payments ───────────────────────────────────────
    // Called by Payment.jsx when passenger pays after ride
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

    // ─── GET /api/payments ────────────────────────────────────────
    // Called by admin to view all payments
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // ─── GET /api/payments/{id} ───────────────────────────────────
    // Called by Invoice.jsx to show receipt
    @GetMapping("/{id}")
    public ResponseEntity<?> getPayment(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(paymentService.getPaymentById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── GET /api/payments/passenger/{passengerId} ────────────────
    // Called by PaymentHistory.jsx
    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<?> getPaymentsByPassenger(@PathVariable Long passengerId) {
        try {
            return ResponseEntity.ok(paymentService.getPaymentsByPassenger(passengerId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── GET /api/payments/ride/{rideId} ──────────────────────────
    // Called by Invoice.jsx to get payment for a specific ride
    @GetMapping("/ride/{rideId}")
    public ResponseEntity<?> getPaymentByRide(@PathVariable Long rideId) {
        try {
            return ResponseEntity.ok(paymentService.getPaymentByRide(rideId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── PUT /api/payments/{id}/status ───────────────────────────
    // Called by admin to update payment status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            Payment.PaymentStatus status =
                    Payment.PaymentStatus.valueOf(body.get("status"));
            return ResponseEntity.ok(paymentService.updatePaymentStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── DELETE /api/payments/{id} ────────────────────────────────
    // Called by admin to remove failed/invalid payments
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayment(@PathVariable Long id) {
        try {
            paymentService.deletePayment(id);
            return ResponseEntity.ok(Map.of("message", "Payment deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

