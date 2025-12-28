import React from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="legal-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1626 100%)',
      color: '#ffffff',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '10px',
        padding: '40px',
        border: '1px solid rgba(0, 217, 255, 0.3)'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <Link to="/" style={{
            color: '#00d9ff',
            textDecoration: 'none',
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            ← Back to Home
          </Link>
        </div>

        <h1 style={{
          fontSize: '42px',
          marginBottom: '20px',
          color: '#00d9ff'
        }}>
          📜 Terms of Service
        </h1>

        <div style={{
          fontSize: '14px',
          color: '#cccccc',
          marginBottom: '30px'
        }}>
          <strong>Last Updated:</strong> December 2024
        </div>

        <div style={{
          lineHeight: '1.8',
          fontSize: '16px',
          color: '#e0e0e0'
        }}>
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using RideWire AI Hub ("the Service"), you accept and agree to be bound by 
              the terms and provision of this agreement. If you do not agree to these Terms of Service, 
              please do not use the Service.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              2. Description of Service
            </h2>
            <p style={{ marginBottom: '15px' }}>
              RideWire AI Hub is a multi-AI consensus platform that provides:
            </p>
            <ul style={{ marginLeft: '20px' }}>
              <li>Access to multiple AI models (ChatGPT, Claude, Gemini)</li>
              <li>Real-time AI consensus generation</li>
              <li>Encrypted message storage</li>
              <li>User authentication and session management</li>
              <li>Dashboard and analytics features</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              3. User Accounts and Registration
            </h2>
            <p style={{ marginBottom: '10px' }}>
              To use certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul style={{ marginLeft: '20px' }}>
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept all responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              4. Acceptable Use Policy
            </h2>
            <p style={{ marginBottom: '10px' }}>
              You agree NOT to use the Service to:
            </p>
            <ul style={{ marginLeft: '20px' }}>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malware, viruses, or harmful code</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Use the Service for illegal activities</li>
              <li>Scrape or data mine without permission</li>
              <li>Impersonate others or misrepresent your identity</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              5. Subscription Plans and Payments
            </h2>
            <p style={{ marginBottom: '10px' }}>
              <strong>Free Plan:</strong> Limited messages per month with basic features
            </p>
            <p style={{ marginBottom: '10px' }}>
              <strong>Pro Plan ($9.99/month):</strong> Enhanced features and higher usage limits
            </p>
            <p style={{ marginBottom: '10px' }}>
              <strong>Enterprise Plan ($99/month):</strong> Unlimited usage with premium support
            </p>
            <ul style={{ marginLeft: '20px', marginTop: '15px' }}>
              <li>Subscription fees are billed in advance on a recurring basis</li>
              <li>You can cancel your subscription at any time</li>
              <li>No refunds for partial months or unused services</li>
              <li>We reserve the right to change pricing with 30 days notice</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              6. Intellectual Property
            </h2>
            <p style={{ marginBottom: '10px' }}>
              <strong>Our Rights:</strong> The Service, including all content, features, and functionality, 
              is owned by RideWire AI Hub and protected by copyright, trademark, and other laws.
            </p>
            <p style={{ marginTop: '15px' }}>
              <strong>Your Content:</strong> You retain ownership of content you submit. By submitting 
              content, you grant us a license to use, store, and process it to provide the Service.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              7. AI-Generated Content
            </h2>
            <p>
              Responses generated by AI models are provided "as is" without warranties. We do not guarantee 
              accuracy, completeness, or reliability of AI-generated content. You use AI responses at your 
              own risk and should independently verify critical information.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              8. Privacy and Data Protection
            </h2>
            <p>
              We implement client-side encryption for message storage. However, to provide the Service, 
              we must transmit your queries to third-party AI providers. By using the Service, you 
              acknowledge and consent to this data processing. See our Privacy Policy for details.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              9. Service Availability
            </h2>
            <p>
              We strive for high availability but do not guarantee uninterrupted service. The Service 
              may be temporarily unavailable due to maintenance, updates, or technical issues. We are 
              not liable for any downtime or service interruptions.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              10. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, RideWire AI Hub shall not be liable for any 
              indirect, incidental, special, consequential, or punitive damages, or any loss of profits 
              or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, 
              or other intangible losses.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              11. Termination
            </h2>
            <p style={{ marginBottom: '10px' }}>
              We reserve the right to suspend or terminate your account if:
            </p>
            <ul style={{ marginLeft: '20px' }}>
              <li>You violate these Terms of Service</li>
              <li>You engage in fraudulent or illegal activities</li>
              <li>Your account is inactive for an extended period</li>
              <li>We cease operations or discontinue the Service</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              12. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of material 
              changes via email or platform notification. Continued use of the Service after changes 
              constitutes acceptance of the modified terms.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              13. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
              in which RideWire AI Hub operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              14. Contact Information
            </h2>
            <p>
              For questions about these Terms of Service, please contact us at:
            </p>
            <p style={{ marginTop: '10px' }}>
              <strong>Email:</strong> legal@ridewire.ai<br />
              <strong>Support:</strong> support@ridewire.ai<br />
              <strong>GitHub:</strong> <a href="https://github.com/STEPHENIESGEM/ridewire-ai-hub" 
                style={{ color: '#00d9ff', textDecoration: 'none' }}>
                github.com/STEPHENIESGEM/ridewire-ai-hub
              </a>
            </p>
          </section>

          <div style={{
            marginTop: '40px',
            padding: '20px',
            background: 'rgba(0, 217, 255, 0.1)',
            border: '2px solid #00d9ff',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <strong style={{ color: '#00d9ff', fontSize: '18px' }}>
              By using RideWire AI Hub, you agree to these Terms of Service
            </strong>
            <p style={{ marginTop: '10px', fontSize: '14px' }}>
              Last updated: December 2024
            </p>
          </div>
        </div>

        <div style={{
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          gap: '20px',
          justifyContent: 'center'
        }}>
          <Link to="/disclaimer" style={{
            color: '#00d9ff',
            textDecoration: 'none',
            fontSize: '14px'
          }}>
            View Disclaimer →
          </Link>
          <Link to="/" style={{
            color: '#00d9ff',
            textDecoration: 'none',
            fontSize: '14px'
          }}>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
