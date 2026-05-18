package com.taxicab.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;



@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Entity
@Table(name = "public_reviews")
@PrimaryKeyJoinColumn(name = "review_id")
public class PublicReview extends Review {

    
    private boolean anonymous = false;

    
    @Override
    public String displayReview() {
        String author = anonymous ? "Anonymous" : getPassenger().getFullName();
        return "[PUBLIC] " + author + " rated " + getRating() + "/5: " + getComment();
    }
}
