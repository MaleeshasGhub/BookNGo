package com.taxicab.controller;

import com.taxicab.model.Driver;
import com.taxicab.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    @Autowired
    private DriverService driverService;

    
    
    @PostMapping("/register")
    public ResponseEntity<?> registerDriver(@RequestBody Driver driver) {
        try {
            return ResponseEntity.ok(driverService.registerDriver(driver));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
    
    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    
    
    @GetMapping("/available")
    public ResponseEntity<List<Driver>> getAvailableDrivers() {
        return ResponseEntity.ok(driverService.getAvailableDrivers());
    }

    
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getDriver(@PathVariable @NonNull Long id) {
        try {
            return ResponseEntity.ok(driverService.getDriverById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDriver(@PathVariable @NonNull Long id, @RequestBody Driver driver) {
        try {
            return ResponseEntity.ok(driverService.updateDriver(id, driver));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
    
    @PutMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(
            @PathVariable @NonNull Long id,
            @RequestBody Map<String, String> body) {
        try {
            Driver.Availability availability =
                    Driver.Availability.valueOf(body.get("availability"));
            return ResponseEntity.ok(driverService.updateAvailability(id, availability));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDriver(@PathVariable @NonNull Long id) {
        try {
            driverService.deleteDriver(id);
            return ResponseEntity.ok(Map.of("message", "Driver deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
