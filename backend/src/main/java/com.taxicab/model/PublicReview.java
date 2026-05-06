package com.taxicab.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

// ─── Inheritance: PublicReview extends Review ─────────────────────────────────
// ─── Polymorphism: overrides displayReview() for public visibility ─────────────

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Entity
@Table(name = "public_reviews")
@PrimaryKeyJoinColumn(name = "review_id")
public class PublicReview extends Review {

    // Public reviews are visible to all users
    private boolean anonymous = false;

    // ─── Polymorphism: public display includes passenger name ─────
    @Override
    public String displayReview() {
        String author = anonymous ? "Anonymous" : getPassenger().getFullName();
        return "[PUBLIC] " + author + " rated " + getRating() + "/5: " + getComment();
    }
}
