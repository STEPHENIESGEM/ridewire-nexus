/**
 * Email Approval Queue Component
 * Review and approve COCO's email drafts
 * Built on Azure OpenAI Service and Microsoft infrastructure
 * 
 * Company: RIDEWIRE LLC
 * Founder: Stephenie N. Lacy
 * Contact: hello@stepheniesgem.io
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

const ApprovalQueue = () => {
  const [pendingEmails, setPendingEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingEmails();
  }, []);

  const fetchPendingEmails = async () => {
    try {
      const response = await apiClient.get('/api/email-automation/pending-approvals');
      setPendingEmails(response.data.pendingEmails);
      if (response.data.pendingEmails.length > 0) {
        selectEmail(0);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending emails:', error);
      setLoading(false);
    }
  };

  const selectEmail = (index) => {
    const email = pendingEmails[index];
    setCurrentEmail({ ...email, index });
    setEditedSubject(email.subject);
    setEditedBody(email.body);
    setEditMode(false);
  };

  const handleApprove = async (withEdits = false) => {
    try {
      const approvalData = {
        approvalId: currentEmail.index,
        edits: withEdits ? {
          subject: editedSubject,
          body: editedBody
        } : {}
      };

      await apiClient.post('/api/email-automation/approve', approvalData);
      
      alert('✅ Email approved and queued for sending!');
      
      // Remove from pending list
      const newPending = pendingEmails.filter((_, idx) => idx !== currentEmail.index);
      setPendingEmails(newPending);
      
      if (newPending.length > 0) {
        selectEmail(0);
      } else {
        setCurrentEmail(null);
      }
    } catch (error) {
      console.error('Error approving email:', error);
      alert('Error approving email. Please try again.');
    }
  };

  const handleReject = async () => {
    const reason = prompt('Why are you rejecting this email? (optional)');
    
    try {
      await apiClient.post('/api/email-automation/reject', {
        approvalId: currentEmail.index,
        reason: reason || 'No reason provided'
      });
      
      alert('❌ Email rejected');
      
      // Remove from pending list
      const newPending = pendingEmails.filter((_, idx) => idx !== currentEmail.index);
      setPendingEmails(newPending);
      
      if (newPending.length > 0) {
        selectEmail(0);
      } else {
        setCurrentEmail(null);
      }
    } catch (error) {
      console.error('Error rejecting email:', error);
      alert('Error rejecting email. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="approval-queue loading">
        <p>Loading pending approvals...</p>
      </div>
    );
  }

  if (pendingEmails.length === 0) {
    return (
      <div className="approval-queue empty">
        <h2>📬 Email Approval Queue</h2>
        <div className="empty-state">
          <p>🎉 No emails pending approval!</p>
          <p className="subtitle">COCO is all caught up.</p>
          <button onClick={() => window.location.href = '/email-dashboard'}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="approval-queue">
      <header className="approval-header">
        <h1>📬 Email Approval Queue</h1>
        <p className="subtitle">Review COCO's drafts powered by Azure OpenAI</p>
        <div className="queue-count">
          {pendingEmails.length} email{pendingEmails.length !== 1 ? 's' : ''} pending review
        </div>
      </header>

      <div className="approval-layout">
        {/* Email List Sidebar */}
        <div className="email-list-sidebar">
          <h3>Pending Emails</h3>
          {pendingEmails.map((email, idx) => (
            <div
              key={idx}
              className={`email-list-item ${currentEmail && currentEmail.index === idx ? 'active' : ''}`}
              onClick={() => selectEmail(idx)}
            >
              <div className="email-preview">
                <strong>{email.contactName || 'Unknown Contact'}</strong>
                <p className="email-subject">{email.subject}</p>
                <span className="email-type">{email.templateUsed || 'custom'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Email Preview/Edit Panel */}
        {currentEmail && (
          <div className="email-preview-panel">
            <div className="email-header">
              <div className="email-meta">
                <strong>To:</strong> {currentEmail.to}
              </div>
              <div className="email-meta">
                <strong>Template:</strong> {currentEmail.templateUsed || 'AI Generated'}
              </div>
              {currentEmail.aiGenerated && (
                <div className="ai-badge">
                  🤖 Generated by Azure OpenAI
                </div>
              )}
            </div>

            <div className="email-content">
              {!editMode ? (
                <>
                  <div className="email-field">
                    <label>Subject:</label>
                    <p className="subject-text">{currentEmail.subject}</p>
                  </div>
                  <div className="email-field">
                    <label>Body:</label>
                    <pre className="body-text">{currentEmail.body}</pre>
                  </div>
                </>
              ) : (
                <>
                  <div className="email-field">
                    <label>Subject:</label>
                    <input
                      type="text"
                      value={editedSubject}
                      onChange={(e) => setEditedSubject(e.target.value)}
                      className="subject-input"
                    />
                  </div>
                  <div className="email-field">
                    <label>Body:</label>
                    <textarea
                      value={editedBody}
                      onChange={(e) => setEditedBody(e.target.value)}
                      className="body-textarea"
                      rows={15}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="email-actions">
              {!editMode ? (
                <>
                  <button
                    className="action-btn primary approve"
                    onClick={() => handleApprove(false)}
                  >
                    ✅ Approve & Send
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => setEditMode(true)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="action-btn danger"
                    onClick={handleReject}
                  >
                    ❌ Reject
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="action-btn primary"
                    onClick={() => handleApprove(true)}
                  >
                    ✅ Approve with Edits
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => {
                      setEditMode(false);
                      setEditedSubject(currentEmail.subject);
                      setEditedBody(currentEmail.body);
                    }}
                  >
                    ↩️ Cancel Edits
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="approval-footer">
        <button onClick={() => window.location.href = '/email-dashboard'}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ApprovalQueue;
