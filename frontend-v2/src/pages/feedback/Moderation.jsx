import React, { useState } from 'react';
import PremiumButton from '../../components/PremiumButton';

const Moderation = () => {
  const [reviews, setReviews] = useState([
    { id: 1, passenger: "John Doe", driver: "Alice", rating: 5, comment: "Excellent driver!", hidden: false },
    { id: 2, passenger: "Spam Bot", driver: "Bob", rating: 1, comment: "Check out this link: http://spam.com", hidden: false },
    { id: 3, passenger: "Angry User", driver: "Charlie", rating: 2, comment: "Driver took a very long route.", hidden: true }
  ]);

  const toggleHide = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, hidden: !r.hidden } : r));
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Review Moderation</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Admin tools to hide or show passenger reviews.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reviews.map(review => (
          <div key={review.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: review.hidden ? 0.5 : 1 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>{review.passenger} ➔ {review.driver}</span>
                <span style={{ color: '#fbbf24' }}>{'★'.repeat(review.rating)}</span>
                {review.hidden && <span style={{ fontSize: '0.8rem', background: 'var(--danger)', padding: '0.1rem 0.4rem', borderRadius: '4px', color: 'white' }}>HIDDEN</span>}
              </div>
              <p style={{ color: 'var(--text-muted)' }}>"{review.comment}"</p>
            </div>
            <div>
              <PremiumButton 
                variant={review.hidden ? 'primary' : 'danger'}
                onClick={() => toggleHide(review.id)}
              >
                {review.hidden ? 'Show Review' : 'Hide Review'}
              </PremiumButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Moderation;
