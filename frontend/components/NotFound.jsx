import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1626 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <div style={{ fontSize: '120px', marginBottom: '20px' }}>🤖</div>
        <h1 style={{
          fontSize: '72px',
          marginBottom: '20px',
          color: '#00d9ff'
        }}>
          404
        </h1>
        <h2 style={{
          fontSize: '32px',
          marginBottom: '20px',
          fontWeight: 'normal'
        }}>
          Page Not Found
        </h2>
        <p style={{
          fontSize: '18px',
          color: '#cccccc',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          The AI consensus is unanimous: this page doesn't exist in our knowledge base.
          Let's get you back to exploring the RideWire AI Hub.
        </p>

        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '12px 30px',
              background: 'rgba(255,255,255,0.1)',
              color: '#00d9ff',
              border: '2px solid #00d9ff',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            ← Go Back
          </button>
          
          <Link
            to="/"
            style={{
              padding: '12px 30px',
              background: '#00d9ff',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            🏠 Home
          </Link>

          <Link
            to="/pricing"
            style={{
              padding: '12px 30px',
              background: 'rgba(255,255,255,0.1)',
              color: '#00d9ff',
              border: '2px solid #00d9ff',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            💎 Pricing
          </Link>
        </div>

        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '10px',
          fontSize: '14px',
          color: '#cccccc'
        }}>
          <p><strong>Need help?</strong></p>
          <p style={{ marginTop: '10px' }}>
            Visit our <Link to="/" style={{ color: '#00d9ff', textDecoration: 'none' }}>homepage</Link> or 
            check out <Link to="/pricing" style={{ color: '#00d9ff', textDecoration: 'none' }}>pricing options</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
