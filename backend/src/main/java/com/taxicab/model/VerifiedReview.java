package com.taxicab.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;



@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Entity
@Table(name = "verified_reviews")
@PrimaryKeyJoinColumn(name = "review_id")
public class VerifiedReview extends Review {

    
    private boolean verifiedRide = true;

    
    @Override
    public String displayReview() {
        return "[✓ VERIFIED] " + getPassenger().getFullName()
                + " rated " + getRating() + "/5: " + getComment();
    }
}
