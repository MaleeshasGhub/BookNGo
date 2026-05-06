package com.taxicab.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

// ─── Inheritance: VerifiedReview extends Review ───────────────────────────────
// ─── Polymorphism: overrides displayReview() with verified badge ──────────────

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Entity
@Table(name = "verified_reviews")
@PrimaryKeyJoinColumn(name = "review_id")
public class VerifiedReview extends Review {

    // Verified reviews are from passengers who actually completed the ride
    private boolean verifiedRide = true;

    // ─── Polymorphism: verified display includes badge ────────────
    @Override
    public String displayReview() {
        return "[✓ VERIFIED] " + getPassenger().getFullName()
                + " rated " + getRating() + "/5: " + getComment();
    }
}
