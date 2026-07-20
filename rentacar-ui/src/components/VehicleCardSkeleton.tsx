import React from 'react';

const VehicleCardSkeleton: React.FC = () => {
  return (
    <div className="glass" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '1rem', border: 'none', background: 'transparent', boxShadow: 'none' }}>
      {/* Image Skeleton */}
      <div className="skeleton" style={{ width: '100%', height: '300px', borderRadius: 'var(--border-radius-soft)' }}></div>
      
      {/* Content Skeleton */}
      <div style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
        
        {/* Title & Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="skeleton" style={{ height: '1.5rem', width: '180px', marginBottom: '0.5rem' }}></div>
            <div className="skeleton" style={{ height: '1rem', width: '60px' }}></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="skeleton" style={{ height: '1.5rem', width: '100px', marginBottom: '0.5rem' }}></div>
            <div className="skeleton" style={{ height: '0.8rem', width: '50px', marginLeft: 'auto' }}></div>
          </div>
        </div>

        {/* Features Row */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
          <div className="skeleton" style={{ height: '1.25rem', width: '90px', borderRadius: '4px' }}></div>
          <div className="skeleton" style={{ height: '1.25rem', width: '90px', borderRadius: '4px' }}></div>
        </div>

        {/* Button */}
        <div style={{ marginTop: '2rem' }}>
          <div className="skeleton" style={{ height: '3rem', width: '100%', borderRadius: 'var(--border-radius-soft)' }}></div>
        </div>

      </div>
    </div>
  );
};

export default VehicleCardSkeleton;
