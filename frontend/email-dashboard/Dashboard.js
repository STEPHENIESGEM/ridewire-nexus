/**
 * Email Automation Dashboard
 * View all email activity, stats, and pipeline
 * Built on Azure OpenAI Service and Microsoft infrastructure
 * 
 * Company: RIDEWIRE LLC
 * Founder: Stephenie N. Lacy
 * Contact: hello@stepheniesgem.io
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

const EmailDashboard = () => {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState('all');

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get('/api/email-automation/dashboard');
      setStats(response.data.stats);
      setAlerts(response.data.alerts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="email-dashboard loading">
        <p>Loading COCO Dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="email-dashboard error">
        <p>Unable to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="email-dashboard">
      <header className="dashboard-header">
        <h1>📧 COCO Email Automation Dashboard</h1>
        <p className="subtitle">Built on Azure OpenAI Service | RIDEWIRE LLC</p>
      </header>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          <h2>🔔 Action Needed</h2>
          {alerts.map((alert, idx) => (
            <div key={idx} className={`alert ${alert.priority}`}>
              <strong>{alert.message}</strong>
              {alert.contacts && (
                <ul>
                  {alert.contacts.slice(0, 3).map(contact => (
                    <li key={contact.id}>
                      {contact.name} - {contact.company} ({contact.reason})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>📤 Emails Sent</h3>
          <p className="stat-value">{stats.emailsSent}</p>
        </div>
        <div className="stat-card">
          <h3>💬 Replies Received</h3>
          <p className="stat-value">{stats.repliesReceived}</p>
          <p className="stat-detail">Response Rate: {stats.responseRate}</p>
        </div>
        <div className="stat-card">
          <h3>📅 Meetings Scheduled</h3>
          <p className="stat-value">{stats.meetingsScheduled}</p>
          <p className="stat-detail">Meeting Rate: {stats.meetingRate}</p>
        </div>
        <div className="stat-card">
          <h3>💰 Pipeline Value</h3>
          <p className="stat-value">${stats.totalRevenue.toLocaleString()}</p>
          <p className="stat-detail">{stats.dealsInPipeline} deals in pipeline</p>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="pipeline-section">
        <h2>📊 Sales Pipeline</h2>
        <div className="pipeline-stages">
          <div className="stage" onClick={() => setSelectedStage('new')}>
            <div className="stage-header">🆕 New</div>
            <div className="stage-count">{stats.pipelineSummary.new}</div>
          </div>
          <div className="stage" onClick={() => setSelectedStage('contacted')}>
            <div className="stage-header">📧 Contacted</div>
            <div className="stage-count">{stats.pipelineSummary.contacted}</div>
          </div>
          <div className="stage" onClick={() => setSelectedStage('replied')}>
            <div className="stage-header">💬 Replied</div>
            <div className="stage-count">{stats.pipelineSummary.replied}</div>
          </div>
          <div className="stage" onClick={() => setSelectedStage('meeting_scheduled')}>
            <div className="stage-header">📅 Meeting</div>
            <div className="stage-count">{stats.pipelineSummary.meeting_scheduled}</div>
          </div>
          <div className="stage" onClick={() => setSelectedStage('proposal_sent')}>
            <div className="stage-header">📄 Proposal</div>
            <div className="stage-count">{stats.pipelineSummary.proposal_sent}</div>
          </div>
          <div className="stage success" onClick={() => setSelectedStage('closed_won')}>
            <div className="stage-header">✅ Won</div>
            <div className="stage-count">{stats.pipelineSummary.closed_won}</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <h2>📝 Recent Activity</h2>
        <div className="activity-list">
          {stats.recentInteractions && stats.recentInteractions.map((interaction, idx) => (
            <div key={idx} className="activity-item">
              <span className="activity-icon">
                {interaction.type === 'email_sent' && '📤'}
                {interaction.type === 'reply_received' && '💬'}
                {interaction.type === 'meeting_scheduled' && '📅'}
                {interaction.type === 'proposal_sent' && '📄'}
                {interaction.type === 'deal_closed' && '✅'}
              </span>
              <div className="activity-details">
                <strong>{interaction.contactName}</strong> - {interaction.company}
                <p className="activity-type">{interaction.type.replace('_', ' ')}</p>
              </div>
              <span className="activity-time">
                {new Date(interaction.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>⚡ Quick Actions</h2>
        <button className="action-btn primary" onClick={() => window.location.href = '/email-approvals'}>
          Review Pending Approvals
        </button>
        <button className="action-btn" onClick={() => window.location.href = '/email-contacts'}>
          Manage Contacts
        </button>
        <button className="action-btn" onClick={fetchDashboardData}>
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

export default EmailDashboard;
