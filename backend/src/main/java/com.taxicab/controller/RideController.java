package com.taxicab.controller;

import com.taxicab.model.Ride;
import com.taxicab.service.RideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rides")
public class RideController {

    @Autowired
    private RideService rideService;

    // ─── POST /api/rides/book/{passengerId} ───────────────────────
    // Called by BookRide.jsx when passenger submits booking
    @PostMapping("/book/{passengerId}")
    public ResponseEntity<?> bookRide(
            @PathVariable Long passengerId,
            @RequestBody Ride ride) {
        try {
            return ResponseEntity.ok(rideService.bookRide(passengerId, ride));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── GET /api/rides ───────────────────────────────────────────
    // Called by admin MonitorRides.jsx
    @GetMapping
    public ResponseEntity<List<Ride>> getAllRides() {
        return ResponseEntity.ok(rideService.getAllRides());
    }

    // ─── GET /api/rides/pending ───────────────────────────────────
    // Called by driver to see available ride requests
    @GetMapping("/pending")
    public ResponseEntity<List<Ride>> getPendingRides() {
        return ResponseEntity.ok(rideService.getPendingRides());
    }

    // ─── GET /api/rides/{id} ──────────────────────────────────────
    // Called by TrackRide.jsx
    @GetMapping("/{id}")
    public ResponseEntity<?> getRide(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(rideService.getRideById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── GET /api/rides/passenger/{passengerId} ───────────────────
    // Called by RideHistory.jsx (passenger view)
    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<?> getRidesByPassenger(@PathVariable Long passengerId) {
        try {
            return ResponseEntity.ok(rideService.getRidesByPassenger(passengerId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── GET /api/rides/driver/{driverId} ────────────────────────
    // Called by driver to see their ride history
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<?> getRidesByDriver(@PathVariable Long driverId) {
        try {
            return ResponseEntity.ok(rideService.getRidesByDriver(driverId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── PUT /api/rides/{id}/status ───────────────────────────────
    // Called by driver to accept/complete a ride
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            Ride.RideStatus status = Ride.RideStatus.valueOf(body.get("status"));
            Long driverId = body.get("driverId") != null
                    ? Long.parseLong(body.get("driverId")) : null;
            return ResponseEntity.ok(rideService.updateRideStatus(id, status, driverId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── DELETE /api/rides/{id}/cancel ────────────────────────────
    // Called by passenger to cancel a pending ride
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<?> cancelRide(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(rideService.cancelRide(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}