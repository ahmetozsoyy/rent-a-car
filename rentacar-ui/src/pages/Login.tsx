import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="container mt-8 flex justify-center">
      <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 className="text-center">Welcome Back</h2>
        <p className="text-center mb-4">Login to manage your rentals.</p>
        
        <form>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="john@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
