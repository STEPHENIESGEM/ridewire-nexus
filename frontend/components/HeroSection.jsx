import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section" style={{
      padding: '60px 20px',
      background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1626 100%)',
      textAlign: 'center',
      color: '#ffffff'
    }}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <h1 style={{fontSize: '48px', marginBottom: '20px', fontWeight: 'bold'}}>
          RideWire AI Hub
        </h1>
        <p style={{fontSize: '20px', marginBottom: '10px', color: '#00d9ff'}}>
          Multi-AI Agent Collaboration Platform with AR Auto Diagnostic Foundation
        </p>
        <p style={{fontSize: '16px', marginBottom: '30px', color: '#cccccc', maxWidth: '600px', margin: '0 auto 30px'}}>
          Three independent AI agents (ChatGPT, Claude, Gemini) collaborate in real-time to reach consensus on your vehicle's diagnostic queries.
        </p>
        
        <div style={{marginBottom: '40px'}}>
          <button 
            onClick={() => navigate('/login')}
            style={{
              padding: '12px 30px',
              margin: '0 10px',
              backgroundColor: '#00d9ff',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            Start Diagnostic
          </button>
          <button 
            onClick={() => navigate('/register')}
            style={{
              padding: '12px 30px',
              margin: '0 10px',
              backgroundColor: 'transparent',
              color: '#00d9ff',
              border: '2px solid #00d9ff',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            Get Started Free
          </button>
        </div>

        <div style={{display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px'}}>
          <div><span style={{fontSize: '24px'}}>⚡</span> Multi-AI Consensus</div>
          <div><span style={{fontSize: '24px'}}>🔒</span> End-to-End Encrypted</div>
          <div><span style={{fontSize: '24px'}}>📱</span> AR Ready</div>
        </div>

        <div style={{
          backgroundColor: '#1a2f4a',
          padding: '40px',
          borderRadius: '10px',
          border: '2px solid #00d9ff',
          textAlign: 'center'
        }}>
          <p style={{margin: 0, color: '#00d9ff', fontSize: '14px', marginBottom: '10px'}}>FINISHED PRODUCT PREVIEW</p>
          <p style={{margin: 0, fontSize: '24px', fontWeight: 'bold'}}>🚗 Multi-AI Diagnostic Engine + AR Overlays</p>
          <p style={{margin: '10px 0 0 0', color: '#cccccc', fontSize: '14px'}}>Hero image placeholder: Agents + Vehicle + AR Diagnostics Visualization</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
