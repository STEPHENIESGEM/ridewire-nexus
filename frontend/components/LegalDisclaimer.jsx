import React, { useState } from 'react';

const LegalDisclaimer = ({ onAccept }) => {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleAccept = async () => {
    if (!agreed) {
      setError('Please read and accept the terms to continue.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Record acceptance in database
      const token = localStorage.getItem('token');
      const response = await fetch('/api/legal/accept-disclaimer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          agreementType: 'diagnostic_disclaimer',
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        // Store acceptance locally
        localStorage.setItem('diagnostic_disclaimer_accepted', 'true');
        onAccept();
      } else {
        setError('Failed to record agreement. Please try again.');
      }
    } catch (error) {
      console.error('Error recording agreement:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.modal}>
        <h2 style={styles.title}>⚠️ Important Legal Disclaimer</h2>
        
        {error && (
          <div style={styles.errorBanner}>
            <strong>⚠️ {error}</strong>
          </div>
        )}
        
        <div style={styles.content}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>AI Diagnostic Guidance</h3>
            <p style={styles.text}>
              <strong>RideWire is a high-tech diagnostic company providing AI-powered guidance.</strong> 
              {' '}We <strong>CANNOT</strong> and <strong>DO NOT</strong> replace licensed mechanics, 
              certified technicians, CPAs, financial advisors, or other professionals.
            </p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Professional Consultation Required</h3>
            <p style={styles.text}>
              This AI-powered diagnostic tool provides <strong>informational guidance only</strong>. 
              Always consult a qualified, licensed mechanic before performing any repairs or 
              modifications to your vehicle. RideWire assumes no liability for vehicle repairs, 
              modifications, or outcomes based on AI recommendations.
            </p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>⚠️ Safety Warning</h3>
            <p style={styles.text}>
              Vehicle repairs can be dangerous. Improper repairs may result in injury, death, 
              or vehicle damage. <strong>Only qualified, licensed mechanics should perform repairs.</strong> 
              RideWire is not liable for any injuries, damages, or outcomes resulting from 
              following AI recommendations.
            </p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Cost Estimates</h3>
            <p style={styles.text}>
              Cost estimates are approximate and for informational purposes only. Actual repair 
              costs may vary significantly based on location, parts availability, labor rates, 
              and vehicle condition. RideWire is not a financial advisor and does not provide 
              professional financial guidance.
            </p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>No Warranty</h3>
            <p style={styles.text}>
              All AI outputs are provided "AS-IS" without warranty of any kind, either expressed 
              or implied. RideWire makes no guarantees about the accuracy, reliability, or 
              completeness of AI diagnostic recommendations.
            </p>
          </div>
        </div>

        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="agree-checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (e.target.checked) setError(null);
            }}
            style={styles.checkbox}
          />
          <label htmlFor="agree-checkbox" style={styles.checkboxLabel}>
            I have read and understand the disclaimers above. I acknowledge that RideWire 
            provides informational guidance only and does not replace professional mechanics 
            or licensed professionals. I agree to consult qualified professionals for all 
            vehicle repairs and accept full responsibility for any actions I take based on 
            AI recommendations.
          </label>
        </div>

        <div style={styles.buttonContainer}>
          <button
            onClick={handleAccept}
            disabled={!agreed || isSubmitting}
            style={{
              ...styles.button,
              ...((!agreed || isSubmitting) && styles.buttonDisabled)
            }}
          >
            {isSubmitting ? 'Recording Agreement...' : 'I Accept - Continue to Diagnostics'}
          </button>
        </div>

        <p style={styles.footer}>
          By accepting these terms, your agreement will be recorded with a timestamp for 
          legal compliance purposes.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px'
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '30px',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
  },
  title: {
    color: '#d32f2f',
    fontSize: '28px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    border: '2px solid #d32f2f',
    borderRadius: '6px',
    padding: '15px',
    marginBottom: '20px',
    color: '#d32f2f',
    textAlign: 'center'
  },
  content: {
    marginBottom: '25px'
  },
  section: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    borderLeft: '4px solid #ff9800'
  },
  sectionTitle: {
    color: '#333',
    fontSize: '18px',
    marginBottom: '10px',
    fontWeight: 'bold'
  },
  text: {
    color: '#555',
    fontSize: '15px',
    lineHeight: '1.6',
    margin: 0
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '25px',
    padding: '15px',
    backgroundColor: '#fff3e0',
    borderRadius: '6px',
    border: '2px solid #ff9800'
  },
  checkbox: {
    marginRight: '12px',
    marginTop: '4px',
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    flexShrink: 0
  },
  checkboxLabel: {
    fontSize: '15px',
    color: '#333',
    lineHeight: '1.5',
    cursor: 'pointer',
    fontWeight: '500'
  },
  buttonContainer: {
    textAlign: 'center',
    marginBottom: '15px'
  },
  button: {
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    padding: '15px 40px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  },
  footer: {
    fontSize: '13px',
    color: '#777',
    textAlign: 'center',
    fontStyle: 'italic',
    margin: 0
  }
};

export default LegalDisclaimer;
