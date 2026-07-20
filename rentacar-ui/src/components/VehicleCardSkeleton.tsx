import React from 'react';

const VehicleCardSkeleton: React.FC = () => {
  return (
    <div className="glass" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Image Skeleton */}
      <div className="skeleton" style={{ width: '100%', height: '260px' }}></div>
      
      {/* Content Skeleton */}
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Title & Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="skeleton" style={{ height: '1.5rem', width: '150px', marginBottom: '0.5rem' }}></div>
            <div className="skeleton" style={{ height: '1rem', width: '100px' }}></div>
          </div>
          <div className="skeleton" style={{ height: '1.5rem', width: '60px', borderRadius: '16px' }}></div>
        </div>

        {/* Features Row */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <div className="skeleton" style={{ height: '1.25rem', width: '80px', borderRadius: '4px' }}></div>
          <div className="skeleton" style={{ height: '1.25rem', width: '80px', borderRadius: '4px' }}></div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '0.5rem 0' }} />

        {/* Price & Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton" style={{ height: '1.75rem', width: '120px' }}></div>
          <div className="skeleton" style={{ height: '2.5rem', width: '100px', borderRadius: '6px' }}></div>
        </div>

      </div>
    </div>
  );
};

export default VehicleCardSkeleton;
