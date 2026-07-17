import React from 'react';

const Register: React.FC = () => {
  return (
    <div className="container mt-8 flex justify-center">
      <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 className="text-center">Create Account</h2>
        <p className="text-center mb-4">Join us to start renting premium vehicles.</p>
        
        <form>
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input type="text" className="form-control" placeholder="John" />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input type="text" className="form-control" placeholder="Doe" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="john@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
