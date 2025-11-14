import { useEffect, useRef, useState } from 'react';

import { fetchConversations, sendMessage } from './api';
import './App.css';

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [userId, setUserId] = useState('');
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setStatusMessage('Please log in to continue the conversation.');
      return;
    }

    const payload = parseJwt(token);
    if (!payload?.user_id) {
      setStatusMessage('Session expired. Please log in again.');
      return;
    }

    const derivedUserId = String(payload.user_id);
    setUserId(derivedUserId);

    fetchConversations()
      .then((history) => {
        const orderedMessages = history.flatMap((entry) => [
          { sender: 'user', text: entry.user_message, createdAt: entry.created_at },
          { sender: 'ai', text: entry.ai_response, createdAt: entry.created_at },
        ]);
        setMessages(orderedMessages);
      })
      .catch((error) => {
        const message = error.response?.data?.error || 'Unable to load conversation history.';
        setStatusMessage(message);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputValue.trim()) {
      return;
    }

    if (!userId) {
      setStatusMessage('Please log in to send messages.');
      return;
    }

    const userMessage = { sender: 'user', text: inputValue.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);

    try {
      const reply = await sendMessage(userId, userMessage.text);
      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'system',
          text: 'Sorry, something went wrong while contacting the AI.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-messages" ref={scrollContainerRef}>
        {statusMessage && <div className="message message-system">{statusMessage}</div>}
        {messages.map((message, index) => (
          <div key={index} className={`message message-${message.sender}`}>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Let's talk about it..."
          disabled={isSending}
        />
        <button type="submit" disabled={isSending}>
          {isSending ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
