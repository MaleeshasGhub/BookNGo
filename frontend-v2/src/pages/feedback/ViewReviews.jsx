import React from 'react';

const ViewReviews = () => {
  const reviews = [
    { id: 1, passenger: "John Doe", rating: 5, comment: "Excellent driver, arrived early and the car was spotless!", date: "May 14, 2026" },
    { id: 2, passenger: "Jane Smith", rating: 4, comment: "Good ride, very safe driving.", date: "May 12, 2026" },
    { id: 3, passenger: "Mike T.", rating: 5, comment: "Alice is the best!", date: "May 10, 2026" }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Driver Reviews</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Showing reviews for Alice Johnson (4.9 ★)</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reviews.map(review => (
          <div key={review.id} className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{review.passenger}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{review.date}</p>
              </div>
              <div style={{ color: '#fbbf24', fontSize: '1.2rem', letterSpacing: '2px' }}>
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
            </div>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.5' }}>"{review.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewReviews;
