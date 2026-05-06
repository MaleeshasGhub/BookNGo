package Repository;

public class AdminRepository {
    package com.taxicab.repository;

import com.taxicab.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

    @Repository
    public interface AdminRepository extends JpaRepository<Admin, Long> {

        // Find admin by email
        Optional<Admin> findByEmail(String email);

        // Check if admin email already exists
        boolean existsByEmail(String email);
    }


}
