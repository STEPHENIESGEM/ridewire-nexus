import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    messageCount: 0,
    sessionsCount: 0,
    planType: 'Free'
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load user stats (mock data for now)
    setStats({
      messageCount: 12,
      sessionsCount: 3,
      planType: 'Free'
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1626 100%)',
      color: '#ffffff',
      padding: '20px'
    }}>
      <div className="dashboard-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '10px'
      }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '5px' }}>🤖 RideWire AI Dashboard</h1>
          <p style={{ color: '#00d9ff', fontSize: '14px' }}>Multi-AI Consensus Platform</p>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            background: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      </div>

      <div className="dashboard-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div className="stat-card" style={{
          background: 'rgba(0, 217, 255, 0.1)',
          border: '2px solid #00d9ff',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>💬</div>
          <h3 style={{ fontSize: '24px', marginBottom: '5px' }}>{stats.messageCount}</h3>
          <p style={{ color: '#cccccc', fontSize: '14px' }}>Messages This Month</p>
        </div>

        <div className="stat-card" style={{
          background: 'rgba(0, 217, 255, 0.1)',
          border: '2px solid #00d9ff',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔄</div>
          <h3 style={{ fontSize: '24px', marginBottom: '5px' }}>{stats.sessionsCount}</h3>
          <p style={{ color: '#cccccc', fontSize: '14px' }}>Active Sessions</p>
        </div>

        <div className="stat-card" style={{
          background: 'rgba(0, 217, 255, 0.1)',
          border: '2px solid #00d9ff',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>⭐</div>
          <h3 style={{ fontSize: '24px', marginBottom: '5px' }}>{stats.planType}</h3>
          <p style={{ color: '#cccccc', fontSize: '14px' }}>Current Plan</p>
        </div>
      </div>

      <div className="quick-actions" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <Link to="/chat" style={{
          textDecoration: 'none',
          background: '#00d9ff',
          color: '#000',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '16px',
          transition: 'transform 0.2s'
        }}>
          🚀 Start New Chat
        </Link>

        <Link to="/pricing" style={{
          textDecoration: 'none',
          background: 'rgba(255,255,255,0.1)',
          color: '#00d9ff',
          border: '2px solid #00d9ff',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '16px',
          transition: 'transform 0.2s'
        }}>
          💎 Upgrade Plan
        </Link>
      </div>

      <div className="dashboard-info" style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '10px',
        padding: '20px'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>🎯 Getting Started</h2>
        <ul style={{ lineHeight: '2', color: '#cccccc' }}>
          <li>Click "Start New Chat" to begin a multi-AI consultation</li>
          <li>Ask questions to ChatGPT, Claude, and Gemini simultaneously</li>
          <li>Review consensus recommendations from all three AI agents</li>
          <li>Upgrade to Pro for unlimited messages and advanced features</li>
        </ul>
      </div>
    </div>
  );
}
