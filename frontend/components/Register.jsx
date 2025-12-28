import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../utils/apiClient';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/register', {
        email,
        password
      });

      // Store JWT token
      localStorage.setItem('token', response.data.token);
      
      // Auto-login and redirect to chat
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1626 100%)',
      padding: '20px'
    }}>
      <div className="auth-card" style={{
        background: 'rgba(255,255,255,0.05)',
        padding: '40px',
        borderRadius: '10px',
        border: '1px solid rgba(0, 217, 255, 0.3)',
        maxWidth: '400px',
        width: '100%',
        color: '#ffffff'
      }}>
        <h2 style={{ fontSize: '32px', marginBottom: '10px', textAlign: 'center' }}>
          Create Account
        </h2>
        <p style={{ textAlign: 'center', color: '#cccccc', marginBottom: '30px' }}>
          Join the Multi-AI Hub
        </p>

        {error && (
          <div style={{
            padding: '12px',
            background: 'rgba(255, 68, 68, 0.2)',
            border: '1px solid #ff4444',
            borderRadius: '5px',
            marginBottom: '20px',
            color: '#ff4444',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleRegister}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                background: 'rgba(255,255,255,0.05)',
                color: '#ffffff',
                fontSize: '14px'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                background: 'rgba(255,255,255,0.05)',
                color: '#ffffff',
                fontSize: '14px'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                background: 'rgba(255,255,255,0.05)',
                color: '#ffffff',
                fontSize: '14px'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#00d9ff',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#cccccc' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#00d9ff', textDecoration: 'none' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
