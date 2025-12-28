import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../utils/apiClient';

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/login', {
        email,
        password
      });

      // Store JWT token and user ID
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      
      // Update authentication state
      if (setIsAuthenticated) {
        setIsAuthenticated(true);
      }
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
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
          Welcome Back
        </h2>
        <p style={{ textAlign: 'center', color: '#cccccc', marginBottom: '30px' }}>
          Sign in to access the Multi-AI Hub
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
        
        <form onSubmit={handleLogin}>
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

          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#cccccc' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#00d9ff', textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
