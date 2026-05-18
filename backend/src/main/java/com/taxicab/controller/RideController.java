package com.taxicab.controller;

import com.taxicab.model.Ride;
import com.taxicab.service.RideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rides")
public class RideController {

    @Autowired
    private RideService rideService;

    
    
    @PostMapping("/book/{passengerId}")
    public ResponseEntity<?> bookRide(
            @PathVariable @NonNull Long passengerId,
            @RequestBody Ride ride) {
        try {
            return ResponseEntity.ok(rideService.bookRide(passengerId, ride));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
    
    @GetMapping
    public ResponseEntity<List<Ride>> getAllRides() {
        return ResponseEntity.ok(rideService.getAllRides());
    }

    
    
    @GetMapping("/pending")
    public ResponseEntity<List<Ride>> getPendingRides() {
        return ResponseEntity.ok(rideService.getPendingRides());
    }

    
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getRide(@PathVariable @NonNull Long id) {
        try {
            return ResponseEntity.ok(rideService.getRideById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
    
    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<?> getRidesByPassenger(@PathVariable @NonNull Long passengerId) {
        try {
            return ResponseEntity.ok(rideService.getRidesByPassenger(passengerId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
    
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<?> getRidesByDriver(@PathVariable @NonNull Long driverId) {
        try {
            return ResponseEntity.ok(rideService.getRidesByDriver(driverId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable @NonNull Long id,
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

    
    
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<?> cancelRide(@PathVariable @NonNull Long id) {
        try {
            return ResponseEntity.ok(rideService.cancelRide(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRide(@PathVariable @NonNull Long id) {
        try {
            rideService.deleteRide(id);
            return ResponseEntity.ok(Map.of("message", "Ride deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}