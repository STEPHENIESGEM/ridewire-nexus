import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import EncryptionModule from '../../encryption';
import LegalDisclaimer from './LegalDisclaimer';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [checkingDisclaimer, setCheckingDisclaimer] = useState(true);
  const messagesEndRef = useRef(null);
  const encryptionModule = useRef(new EncryptionModule());

  useEffect(() => {
    // Initialize encryption module
    encryptionModule.current.init().then(() => {
      setSessionId(Math.random().toString(36).substr(2, 9));
    });

    // Check if user has accepted disclaimer
    checkDisclaimerAcceptance();
  }, []);

  const checkDisclaimerAcceptance = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      
      const response = await axios.get(`${apiUrl}/api/legal/check-disclaimer/diagnostic`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.accepted) {
        setDisclaimerAccepted(true);
        setShowDisclaimer(false);
      } else {
        setDisclaimerAccepted(false);
        setShowDisclaimer(true);
      }
    } catch (error) {
      console.error('Failed to check disclaimer:', error);
      // Default to showing disclaimer on error (safe default)
      setDisclaimerAccepted(false);
      setShowDisclaimer(true);
    } finally {
      setCheckingDisclaimer(false);
    }
  };

  const handleDisclaimerAccept = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      
      await axios.post(`${apiUrl}/api/legal/accept-disclaimer`, {
        disclaimerType: 'diagnostic',
        version: '1.0.0'
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setDisclaimerAccepted(true);
      setShowDisclaimer(false);
    } catch (error) {
      console.error('Failed to accept disclaimer:', error);
      alert('Failed to accept disclaimer. Please try again.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

      // Encrypt the message
      const encrypted = encryptionModule.current.encryptMessage(input, sessionId);

      // Send to backend for multi-AI processing
      const response = await axios.post(`${apiUrl}/messages`, {
        ...encrypted,
        session_id: sessionId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        // Fetch responses from all AI agents
        const aiResponse = await axios.get(`${apiUrl}/messages/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setResponses({
          chatgpt: 'ChatGPT analyzing your query...',
          claude: 'Claude synthesizing perspective...',
          gemini: 'Gemini generating insights...',
          consensus: 'Consensus: Multiple AI perspectives loaded.',
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: 'Error: Could not process message',
        sender: 'system',
        timestamp: new Date().toISOString(),
      }]);
    }

    setLoading(false);
  };

  // Show loading state while checking disclaimer
  if (checkingDisclaimer) {
    return (
      <div className="chat-container">
        <div className="chat-loading">
          <p>Loading diagnostic tools...</p>
        </div>
      </div>
    );
  }

  // Show disclaimer modal if not accepted
  if (showDisclaimer) {
    return <LegalDisclaimer onAccept={handleDisclaimerAccept} />;
  }

  // Show chat interface only after disclaimer is accepted
  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>🔄 Multi-AI Consensus Chat</h2>
        <p>Session: {sessionId}</p>
        <div className="disclaimer-notice">
          ⚠️ Advisory only - Always consult qualified professionals
        </div>
      </header>

      <div className="chat-main">
        <div className="messages-section">
          <div className="messages-list">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-content">{msg.text}</div>
                <div className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {loading && <div className="message system">🔄 Processing with multiple AIs...</div>}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="consensus-section">
          <h3>🤖 AI Roundtable Responses</h3>
          <div className="ai-responses">
            <div className="ai-response chatgpt">
              <strong>ChatGPT:</strong>
              <p>{responses.chatgpt || 'Waiting for response...'}</p>
            </div>
            <div className="ai-response claude">
              <strong>Claude:</strong>
              <p>{responses.claude || 'Waiting for response...'}</p>
            </div>
            <div className="ai-response gemini">
              <strong>Gemini:</strong>
              <p>{responses.gemini || 'Waiting for response...'}</p>
            </div>
            <div className="consensus">
              <strong>Consensus:</strong>
              <p>{responses.consensus || 'Awaiting AI analysis...'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question to the AI roundtable..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}>
          {loading ? '⏳ Processing...' : '🚀 Send'}
        </button>
      </div>
    </div>
  );
};

export default Chat;
