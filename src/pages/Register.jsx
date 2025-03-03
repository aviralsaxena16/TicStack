import React from 'react';
import { Link } from 'react-router-dom';
import './auth.css';

const Register = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Register</h1>
        </div>
        <form>
          <div className="form-group">
            <input type="text" placeholder="Username" required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Email" required />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" required />
          </div>
          <button type="submit" className="auth-button">Register</button>
        </form>
        <div className="auth-links">
          <div className="divider">or</div>
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;