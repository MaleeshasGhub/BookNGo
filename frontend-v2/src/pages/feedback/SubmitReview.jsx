import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumButton from '../../components/PremiumButton';
import toast from 'react-hot-toast';

const SubmitReview = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error('Please select a rating');
    console.log("Submitting review:", { rating, comment });
    toast.success('Thank you for your feedback!');
    navigate('/profile');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '4rem' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Rate Your Ride</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>How was your trip with Alice?</p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                style={{ 
                  cursor: 'pointer', 
                  fontSize: '3rem', 
                  color: star <= (hoverRating || rating) ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                  transition: 'var(--transition-fast)'
                }}
              >
                ★
              </span>
            ))}
          </div>

          <textarea 
            placeholder="Leave a comment (optional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(26, 29, 45, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-main)',
              fontSize: '1rem',
              outline: 'none',
              resize: 'vertical',
              marginBottom: '2rem',
              fontFamily: 'inherit'
            }}
          />

          <PremiumButton type="submit" variant="primary" style={{ width: '100%' }}>
            Submit Review
          </PremiumButton>
        </form>
      </div>
    </div>
  );
};

export default SubmitReview;
