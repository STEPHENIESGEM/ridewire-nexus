import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../utils/apiClient';
import EncryptionModule from '../../encryption';
import LegalDisclaimer from './LegalDisclaimer';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [checkingDisclaimer, setCheckingDisclaimer] = useState(true);
  const messagesEndRef = useRef(null);
  const encryptionModule = useRef(new EncryptionModule());

  useEffect(() => {
    // Initialize encryption module
    encryptionModule.current.init().then(() => {
      setSessionId(Math.random().toString(36).substr(2, 9));
    });
    
    // Check if user has already accepted disclaimer
    checkDisclaimerStatus();
  }, []);

  const checkDisclaimerStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      
      const response = await axios.get(
        `${apiUrl}/api/legal/check-disclaimer/diagnostic_disclaimer`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.accepted) {
        setDisclaimerAccepted(true);
      }
    } catch (error) {
      console.error('Error checking disclaimer status:', error);
    } finally {
      setCheckingDisclaimer(false);
    }
  };

  const handleDisclaimerAccept = () => {
    setDisclaimerAccepted(true);
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
      // Encrypt the message
      const encrypted = encryptionModule.current.encryptMessage(input, sessionId);

      // Send to backend for multi-AI processing
      const response = await apiClient.post('/messages', {
        ...encrypted,
        session_id: sessionId,
      });

      if (response.status === 201) {
        // Fetch responses from all AI agents
        const aiResponse = await apiClient.get(`/messages/${sessionId}`);

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
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading...</h2>
          <p>Checking requirements...</p>
        </div>
      </div>
    );
  }

  // Show legal disclaimer if not accepted
  if (!disclaimerAccepted) {
    return <LegalDisclaimer onAccept={handleDisclaimerAccept} />;
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>🔄 Multi-AI Consensus Chat</h2>
        <p>Session: {sessionId}</p>
        <p style={{ fontSize: '12px', color: '#ff9800', marginTop: '5px' }}>
          ⚠️ AI guidance only - Always consult licensed professionals
        </p>
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
