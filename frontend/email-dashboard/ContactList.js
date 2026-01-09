/**
 * Contact List Component
 * Manage target contacts for email automation
 * Built on Azure OpenAI Service and Microsoft infrastructure
 * 
 * Company: RIDEWIRE LLC
 * Founder: Stephenie N. Lacy
 * Contact: hello@stepheniesgem.io
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    personalizationDetail: '',
    relevantTopic: '',
    personalizedHook: '',
    tags: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, filterStatus]);

  const fetchContacts = async () => {
    try {
      const response = await apiClient.get('/api/email-automation/contacts');
      setContacts(response.data.contacts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = [...contacts];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.firstName.toLowerCase().includes(term) ||
        c.lastName.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.companyName.toLowerCase().includes(term)
      );
    }

    setFilteredContacts(filtered);
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    
    try {
      const response = await apiClient.post('/api/email-automation/contacts', newContact);
      
      alert('✅ Contact added successfully!');
      setContacts([...contacts, response.data.contact]);
      setShowAddForm(false);
      setNewContact({
        firstName: '',
        lastName: '',
        email: '',
        companyName: '',
        personalizationDetail: '',
        relevantTopic: '',
        personalizedHook: '',
        tags: []
      });
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Error adding contact. Please try again.');
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      await apiClient.delete(`/api/email-automation/contacts/${contactId}`);
      alert('✅ Contact deleted');
      setContacts(contacts.filter(c => c.id !== contactId));
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting contact. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: { color: 'blue', text: '🆕 New' },
      contacted: { color: 'yellow', text: '📧 Contacted' },
      replied: { color: 'green', text: '💬 Replied' },
      meeting_scheduled: { color: 'purple', text: '📅 Meeting' },
      closed_won: { color: 'success', text: '✅ Won' },
      closed_lost: { color: 'gray', text: '❌ Lost' }
    };

    const badge = badges[status] || { color: 'gray', text: status };
    return <span className={`status-badge ${badge.color}`}>{badge.text}</span>;
  };

  if (loading) {
    return (
      <div className="contact-list loading">
        <p>Loading contacts...</p>
      </div>
    );
  }

  return (
    <div className="contact-list">
      <header className="contact-header">
        <h1>👥 Contact Management</h1>
        <p className="subtitle">Manage your target list for COCO email automation</p>
      </header>

      {/* Controls */}
      <div className="contact-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-bar">
          <label>Filter by status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Contacts</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="replied">Replied</option>
            <option value="meeting_scheduled">Meeting Scheduled</option>
            <option value="closed_won">Closed Won</option>
            <option value="closed_lost">Closed Lost</option>
          </select>
        </div>

        <button
          className="action-btn primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          ➕ Add Contact
        </button>
      </div>

      {/* Add Contact Form */}
      {showAddForm && (
        <div className="add-contact-form">
          <h3>Add New Contact</h3>
          <form onSubmit={handleAddContact}>
            <div className="form-row">
              <input
                type="text"
                placeholder="First Name *"
                value={newContact.firstName}
                onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Last Name *"
                value={newContact.lastName}
                onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="email"
                placeholder="Email *"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Company Name *"
                value={newContact.companyName}
                onChange={(e) => setNewContact({ ...newContact, companyName: e.target.value })}
                required
              />
            </div>
            <input
              type="text"
              placeholder="Personalization Detail (e.g., 'scaling direct air capture')"
              value={newContact.personalizationDetail}
              onChange={(e) => setNewContact({ ...newContact, personalizationDetail: e.target.value })}
            />
            <input
              type="text"
              placeholder="Relevant Topic (e.g., 'carbon removal market analysis')"
              value={newContact.relevantTopic}
              onChange={(e) => setNewContact({ ...newContact, relevantTopic: e.target.value })}
            />
            <input
              type="text"
              placeholder="Personalized Hook (e.g., 'DAC market insights')"
              value={newContact.personalizedHook}
              onChange={(e) => setNewContact({ ...newContact, personalizedHook: e.target.value })}
            />
            <div className="form-actions">
              <button type="submit" className="action-btn primary">
                ✅ Add Contact
              </button>
              <button
                type="button"
                className="action-btn secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contact List */}
      <div className="contacts-table">
        <div className="table-header">
          <span className="col-name">Name</span>
          <span className="col-company">Company</span>
          <span className="col-email">Email</span>
          <span className="col-status">Status</span>
          <span className="col-actions">Actions</span>
        </div>
        
        {filteredContacts.length === 0 ? (
          <div className="empty-state">
            <p>No contacts found.</p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div key={contact.id} className="table-row">
              <span className="col-name">
                {contact.firstName} {contact.lastName}
              </span>
              <span className="col-company">{contact.companyName}</span>
              <span className="col-email">{contact.email}</span>
              <span className="col-status">
                {getStatusBadge(contact.status)}
              </span>
              <span className="col-actions">
                <button
                  className="action-btn small"
                  onClick={() => window.location.href = `/contact/${contact.id}`}
                >
                  📝 View
                </button>
                <button
                  className="action-btn small danger"
                  onClick={() => handleDeleteContact(contact.id)}
                >
                  🗑️
                </button>
              </span>
            </div>
          ))
        )}
      </div>

      <div className="contact-footer">
        <p>Total contacts: {contacts.length} | Showing: {filteredContacts.length}</p>
        <button onClick={() => window.location.href = '/email-dashboard'}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ContactList;
