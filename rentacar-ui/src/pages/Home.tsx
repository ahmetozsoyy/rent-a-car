import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="container mt-8">
      <div className="text-center">
        <h1>Premium Vehicle Rentals</h1>
        <p>Experience the ultimate driving pleasure with our curated collection of premium vehicles.</p>
        <div className="mt-4 flex justify-center gap-4">
          <button className="btn btn-primary">Browse Fleet</button>
          <button className="btn btn-outline">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
