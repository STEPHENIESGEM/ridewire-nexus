import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../utils/apiClient';
import EncryptionModule from '../../encryption';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const encryptionModule = useRef(new EncryptionModule());

  useEffect(() => {
    // Initialize encryption module
    encryptionModule.current.init().then(() => {
      setSessionId(Math.random().toString(36).substr(2, 9));
    });
  }, []);

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
          gpt4strategist: 'GPT-4 Strategist analyzing your query...',
          gpt4oanalyst: 'GPT-4o Analyst synthesizing perspective...',
          gpt4turbovalidator: 'GPT-4 Turbo Validator generating insights...',
          consensus: 'Consensus: Multiple Azure OpenAI perspectives loaded.',
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

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>🔄 Multi-AI Consensus Chat (Azure OpenAI)</h2>
        <p>Session: {sessionId}</p>
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
          <h3>🤖 Azure OpenAI Roundtable Responses</h3>
          <div className="ai-responses">
            <div className="ai-response chatgpt">
              <strong>GPT-4 Strategist:</strong>
              <p>{responses.gpt4strategist || 'Waiting for response...'}</p>
            </div>
            <div className="ai-response claude">
              <strong>GPT-4o Analyst:</strong>
              <p>{responses.gpt4oanalyst || 'Waiting for response...'}</p>
            </div>
            <div className="ai-response gemini">
              <strong>GPT-4 Turbo Validator:</strong>
              <p>{responses.gpt4turbovalidator || 'Waiting for response...'}</p>
            </div>
            <div className="consensus">
              <strong>Consensus:</strong>
              <p>{responses.consensus || 'Awaiting Azure OpenAI analysis...'}</p>
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
          placeholder="Ask a question to the Azure OpenAI roundtable..."
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
