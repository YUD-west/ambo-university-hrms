import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { chatbotService, type ChatMessage } from '../services/chatbotService';
import './ChatBot.css';

const CHAT_STORAGE_KEY = 'ambo_hrms_chat_history_v2';

const ChatBot = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'initial_welcome',
        text: t(
          'chatbot.welcome',
          'Hello! I am your Ambo University HR & Public Servant Assistant. How can I help you today with forms, attendance, leaves, or university policies?'
        ),
        sender: 'bot',
        timestamp: new Date().toISOString(),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Synchronize messages with sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendQuery = async (queryText: string) => {
    const text = queryText.trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await chatbotService.sendMessage(text, currentLang, messages);
      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        text: responseText,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chatbot response error:', err);
      const fallbackMessage: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        text:
          currentLang === 'am'
            ? 'ይቅርታ፣ ምላሹን ለማዘጋጀት ችግር አጋጥሟል። እባክዎ ጥቂት ቆይተው እንደገና ይሞክሩ።'
            : currentLang === 'om'
            ? 'Dhiifama, deebii qopheessuuf rakkoon mudateera. Maaloo xiqqoo turanii irra deebi\'aa yaalaa.'
            : 'I apologize, but I encountered an error preparing the response. Please try again or rephrase your question.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery(input);
    }
  };

  const handleClearHistory = () => {
    sessionStorage.removeItem(CHAT_STORAGE_KEY);
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        text: t(
          'chatbot.welcome',
          'Hello! I am your Ambo University HR & Public Servant Assistant. How can I help you today?'
        ),
        sender: 'bot',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  // Trilingual Quick Prompts
  const quickPrompts = [
    { label: '📋 ' + t('chatbot.quickPrompt1', 'Life History Form'), query: t('chatbot.quickPrompt1', 'How do I complete the Life History Form?') },
    { label: '🛡️ ' + t('chatbot.quickPrompt3', 'Pension Form'), query: t('chatbot.quickPrompt3', 'How does the Pension & Social Security form work?') },
    { label: '📅 ' + t('chatbot.quickPrompt2', 'Leave Rules'), query: t('chatbot.quickPrompt2', 'What are the rules for leave requests?') },
    { label: '⏰ ' + t('chatbot.quickPrompt5', 'Work Hours'), query: t('chatbot.quickPrompt5', 'What are the working hours and attendance policies?') },
    { label: '📍 ' + t('chatbot.quickPrompt4', 'Campus HR'), query: t('chatbot.quickPrompt4', 'How do I contact Ambo University HR?') },
  ];

  return (
    <>
      <button
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Ambo University HR Assistant"
        title="Ambo University HR AI Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="chatbot-container" role="dialog" aria-labelledby="chatbot-heading">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <span className="chatbot-icon">🏛️</span>
              <div>
                <h3 id="chatbot-heading">{t('chatbot.title', 'Ambo University HR Assistant')}</h3>
                <span className="chatbot-status">
                  <span className="online-indicator"></span>
                  {t('chatbot.onlineStatus', 'Knowledge Base Online')}
                </span>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button
                type="button"
                className="chatbot-clear-btn"
                onClick={handleClearHistory}
                title="Reset conversation"
                aria-label="Reset conversation"
              >
                🔄
              </button>
              <button
                type="button"
                className="chatbot-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="chatbot-messages">
            {messages.map((message) => {
              const timeStr = new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              return (
                <div
                  key={message.id}
                  className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <div className="message-content">
                    <p style={{ whiteSpace: 'pre-line' }}>{message.text}</p>
                    <span className="message-time">{timeStr}</span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="message bot-message">
                <div className="message-content">
                  <div className="typing-indicator" aria-label="Assistant is thinking">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="chatbot-quick-replies">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="quick-reply-btn"
                onClick={() => handleSendQuery(prompt.query)}
                disabled={isTyping}
              >
                <span>{prompt.label}</span>
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="chatbot-input-container">
            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              placeholder={t('chatbot.inputPlaceholder', 'Ask a question about HR, forms, or policies...')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping}
              aria-label="Your question"
            />
            <button
              type="button"
              className="chatbot-send"
              onClick={() => handleSendQuery(input)}
              disabled={!input.trim() || isTyping}
              aria-label={t('chatbot.send', 'Send')}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
