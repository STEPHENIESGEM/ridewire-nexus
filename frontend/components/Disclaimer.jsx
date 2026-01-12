import React from 'react';
import { Link } from 'react-router-dom';

export default function Disclaimer() {
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
          ⚠️ Legal Disclaimer
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
              1. No Professional Advice
            </h2>
            <p style={{ marginBottom: '15px' }}>
              The information provided by RideWire AI Hub ("we," "us," or "our") through our multi-AI 
              consensus platform is for general informational purposes only. All information on the platform 
              is provided in good faith; however, we make no representation or warranty of any kind, express 
              or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness 
              of any information on the platform.
            </p>
            <p>
              <strong>The RideWire AI Hub does NOT provide:</strong>
            </p>
            <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
              <li>Professional automotive diagnostic advice</li>
              <li>Medical, legal, or financial advice</li>
              <li>Certified mechanic recommendations</li>
              <li>Safety-critical decision making guidance</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              2. AI-Generated Content Disclaimer
            </h2>
            <p style={{ marginBottom: '15px' }}>
              Our platform uses multiple artificial intelligence models (ChatGPT, Claude, Gemini) to generate 
              responses. While we strive for accuracy through our multi-AI consensus approach:
            </p>
            <ul style={{ marginLeft: '20px' }}>
              <li>AI responses may contain errors, inaccuracies, or outdated information</li>
              <li>Consensus does not guarantee correctness</li>
              <li>AI models may have inherent biases or limitations</li>
              <li>Responses should not replace professional consultation</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              3. Automotive Diagnostic Disclaimer
            </h2>
            <p style={{ marginBottom: '15px' }}>
              If you are using RideWire AI Hub for automotive diagnostics:
            </p>
            <ul style={{ marginLeft: '20px' }}>
              <li>Always consult a certified mechanic for vehicle issues</li>
              <li>Do not rely solely on AI recommendations for safety-critical repairs</li>
              <li>Vehicle diagnostics require physical inspection by qualified professionals</li>
              <li>We are not liable for any damages resulting from following AI suggestions</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              4. No Liability
            </h2>
            <p>
              Under no circumstance shall we have any liability to you for any loss or damage of any kind 
              incurred as a result of the use of the platform or reliance on any information provided on 
              the platform. Your use of the platform and your reliance on any information on the platform 
              is solely at your own risk.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              5. Third-Party AI Services
            </h2>
            <p>
              Our platform integrates with third-party AI services (OpenAI, Anthropic, Google). We are not 
              responsible for the accuracy, reliability, or availability of these third-party services. 
              Each service has its own terms of use and privacy policies.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              6. Data Security
            </h2>
            <p>
              While we implement client-side encryption and security measures, no system is completely secure. 
              Users should not share highly sensitive, personal, or confidential information through the platform.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              7. Changes to This Disclaimer
            </h2>
            <p>
              We reserve the right to modify this disclaimer at any time. Changes will be effective immediately 
              upon posting. Your continued use of the platform after changes constitutes acceptance of the 
              modified disclaimer.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#00d9ff', marginBottom: '15px' }}>
              8. Contact Information
            </h2>
            <p>
              If you have questions about this disclaimer, please contact us at:
            </p>
            <p style={{ marginTop: '10px' }}>
              <strong>Email:</strong> legal@ridewire.ai<br />
              <strong>GitHub:</strong> <a href="https://github.com/STEPHENIESGEM/ridewire-ai-hub" 
                style={{ color: '#00d9ff', textDecoration: 'none' }}>
                github.com/STEPHENIESGEM/ridewire-ai-hub
              </a>
            </p>
          </section>

          <div style={{
            marginTop: '40px',
            padding: '20px',
            background: 'rgba(255, 68, 68, 0.1)',
            border: '2px solid #ff4444',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <strong style={{ color: '#ff4444', fontSize: '18px' }}>
              ⚠️ IMPORTANT WARNING
            </strong>
            <p style={{ marginTop: '10px', fontSize: '14px' }}>
              Never use AI-generated automotive diagnostic information for safety-critical decisions 
              without professional verification. Always consult certified professionals for vehicle repairs.
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
          <Link to="/terms" style={{
            color: '#00d9ff',
            textDecoration: 'none',
            fontSize: '14px'
          }}>
            View Terms of Service →
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
