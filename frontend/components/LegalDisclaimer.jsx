import React, { useState } from 'react';

/**
 * Legal Disclaimer Modal Component
 * 
 * Blocks access to diagnostic features until user accepts terms.
 * Required for legal compliance - user MUST accept before using AI diagnostics.
 */
const LegalDisclaimer = ({ onAccept }) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [error, setError] = useState(null);

  const handleScroll = (e) => {
    const element = e.target;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    if (isAtBottom && !hasScrolled) {
      setHasScrolled(true);
    }
  };

  const handleAccept = async () => {
    if (!hasScrolled) {
      setError('Please read the entire disclaimer before accepting.');
      return;
    }

    setIsAccepting(true);
    setError(null);

    try {
      await onAccept();
    } catch (err) {
      setError('Failed to accept disclaimer. Please try again.');
      setIsAccepting(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>⚠️ Important Legal Disclaimer</h2>
          <p style={styles.subtitle}>Please read carefully before continuing</p>
        </div>

        <div style={styles.content} onScroll={handleScroll}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Advisory Only - Not Professional Services</h3>
            <p style={styles.text}>
              RideWire AI Hub is a high-tech diagnostic platform that provides AI-powered 
              guidance and information. We <strong>DO NOT</strong> provide professional 
              automotive repair services, mechanical work, or licensed professional advice.
            </p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>No Replacement for Licensed Professionals</h3>
            <p style={styles.text}>
              Our AI-powered diagnostic tools and recommendations are for <strong>informational 
              and educational purposes only</strong>. They are NOT a substitute for:
            </p>
            <ul style={styles.list}>
              <li>Licensed automotive technicians and mechanics</li>
              <li>Professional diagnostic equipment and tools</li>
              <li>In-person vehicle inspections</li>
              <li>Manufacturer-certified service centers</li>
              <li>Safety-critical system evaluations</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>No Liability for Repair Outcomes</h3>
            <p style={styles.text}>
              RideWire AI Hub and its operators <strong>accept NO liability</strong> for:
            </p>
            <ul style={styles.list}>
              <li>Repair outcomes or results based on our AI recommendations</li>
              <li>Vehicle damage or malfunction</li>
              <li>Personal injury or property damage</li>
              <li>Financial losses from repair costs</li>
              <li>Accuracy of cost estimates or diagnostic predictions</li>
              <li>Third-party services or parts obtained based on our information</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Always Consult Qualified Professionals</h3>
            <p style={styles.text}>
              Before performing any repairs, modifications, or maintenance on your vehicle, 
              you MUST:
            </p>
            <ul style={styles.list}>
              <li>Consult with licensed automotive professionals</li>
              <li>Have your vehicle properly inspected</li>
              <li>Follow manufacturer guidelines and recommendations</li>
              <li>Use proper tools and safety equipment</li>
              <li>Obtain professional advice for safety-critical systems</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>AI Limitations</h3>
            <p style={styles.text}>
              Our multi-AI consensus system provides recommendations based on available 
              information, but:
            </p>
            <ul style={styles.list}>
              <li>AI cannot physically inspect your vehicle</li>
              <li>AI may not have complete information about your specific vehicle</li>
              <li>AI recommendations are probabilistic, not guaranteed</li>
              <li>AI cannot account for all variables in vehicle condition</li>
            </ul>
          </div>

          <div style={styles.warningBox}>
            <p style={styles.warningText}>
              <strong>⚠️ SAFETY WARNING:</strong> Do not attempt repairs on safety-critical 
              systems (brakes, steering, airbags, etc.) without professional assistance. 
              Improper repairs can result in serious injury or death.
            </p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Your Responsibility</h3>
            <p style={styles.text}>
              By accepting this disclaimer, you acknowledge that:
            </p>
            <ul style={styles.list}>
              <li>You have read and understood this entire disclaimer</li>
              <li>You will use RideWire AI Hub for informational purposes only</li>
              <li>You will consult qualified professionals before performing repairs</li>
              <li>You accept all risks associated with vehicle repair and maintenance</li>
              <li>You will not hold RideWire AI Hub liable for any outcomes</li>
            </ul>
          </div>

          {!hasScrolled && (
            <div style={styles.scrollPrompt}>
              👇 Please scroll to read the entire disclaimer
            </div>
          )}
        </div>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <div style={styles.footer}>
          <button
            onClick={handleAccept}
            disabled={isAccepting || !hasScrolled}
            style={{
              ...styles.acceptButton,
              ...((!hasScrolled || isAccepting) && styles.acceptButtonDisabled)
            }}
          >
            {isAccepting ? 'Accepting...' : 'I Accept - Continue to Diagnostic Tools'}
          </button>
          <p style={styles.footerText}>
            This disclaimer was last updated on January 5, 2026 (v1.0.0)
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    padding: '20px',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  header: {
    padding: '30px 30px 20px',
    borderBottom: '2px solid #e0e0e0',
    backgroundColor: '#fff3cd',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    color: '#333',
    fontWeight: 'bold',
  },
  subtitle: {
    margin: '5px 0 0',
    fontSize: '14px',
    color: '#666',
  },
  content: {
    padding: '30px',
    overflowY: 'auto',
    flex: 1,
    fontSize: '15px',
    lineHeight: '1.6',
  },
  section: {
    marginBottom: '25px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  text: {
    color: '#555',
    marginBottom: '10px',
  },
  list: {
    color: '#555',
    paddingLeft: '20px',
    marginTop: '10px',
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    border: '2px solid #ffc107',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '25px',
  },
  warningText: {
    color: '#856404',
    margin: 0,
    fontWeight: '500',
  },
  scrollPrompt: {
    textAlign: 'center',
    color: '#666',
    fontSize: '14px',
    marginTop: '20px',
    animation: 'bounce 2s infinite',
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    margin: '0 30px',
    borderRadius: '4px',
    fontSize: '14px',
  },
  footer: {
    padding: '20px 30px',
    borderTop: '2px solid #e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  acceptButton: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#28a745',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  acceptButtonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  footerText: {
    marginTop: '10px',
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
  },
};

export default LegalDisclaimer;
