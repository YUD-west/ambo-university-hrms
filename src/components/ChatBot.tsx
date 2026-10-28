import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './ChatBot.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('chatbot.welcome', { lng: i18n.language }),
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const lang = i18n.language;

    // Dashboard/Stats
    if (
      lowerMessage.includes('dashboard') || lowerMessage.includes('statistic') || lowerMessage.includes('overview') ||
      lowerMessage.includes('ዳሽቦርድ') || lowerMessage.includes('ስታትስቲክስ') ||
      lowerMessage.includes('daashboordii') || lowerMessage.includes('statistiksii')
    ) {
      return t('chatbot.dashboard', { lng: lang });
    }

    // Add Book
    if (
      lowerMessage.includes('add book') || lowerMessage.includes('new book') || lowerMessage.includes('create book') ||
      lowerMessage.includes('መጽሐፍ ጨምር') || lowerMessage.includes('አዲስ መጽሐፍ') ||
      lowerMessage.includes('kutaa dabalchisi') || lowerMessage.includes('kutaa haaraa')
    ) {
      return t('chatbot.addBook', { lng: lang });
    }

    // Edit Book
    if (
      lowerMessage.includes('edit book') || lowerMessage.includes('update book') || lowerMessage.includes('modify book') ||
      lowerMessage.includes('መጽሐፍ አርም') || lowerMessage.includes('መጽሐፍ አዘምን') ||
      lowerMessage.includes('kutaa gulaaluu') || lowerMessage.includes('jijjiir')
    ) {
      return t('chatbot.editBook', { lng: lang });
    }

    // Delete Book
    if (
      lowerMessage.includes('delete book') || lowerMessage.includes('remove book') ||
      lowerMessage.includes('መጽሐፍ ሰርዝ') || lowerMessage.includes('መጽሐፍ አስወግድ') ||
      lowerMessage.includes('kutaa haquu') || lowerMessage.includes('haqi')
    ) {
      return t('chatbot.deleteBook', { lng: lang });
    }

    // Search Books
    if (
      lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('look for') ||
      lowerMessage.includes('ፈልግ') || lowerMessage.includes('አግኝ') ||
      lowerMessage.includes('barbaadi') || lowerMessage.includes('barbaaduu')
    ) {
      return t('chatbot.search', { lng: lang });
    }

    // Add Member
    if (
      lowerMessage.includes('add member') || lowerMessage.includes('new member') || lowerMessage.includes('register member') ||
      lowerMessage.includes('አባል ጨምር') || lowerMessage.includes('አዲስ አባል') ||
      lowerMessage.includes('mataa dabalchisi') || lowerMessage.includes('galmeessi')
    ) {
      return t('chatbot.addMember', { lng: lang });
    }

    // Member Status
    if (
      lowerMessage.includes('member status') || lowerMessage.includes('active member') || lowerMessage.includes('inactive member') ||
      lowerMessage.includes('አባል ሁኔታ') || lowerMessage.includes('ንቁ አባል') ||
      lowerMessage.includes('sadarkaa') || lowerMessage.includes('haala')
    ) {
      return t('chatbot.memberStatus', { lng: lang });
    }

    // Borrowing Process
    if (
      lowerMessage.includes('how to borrow') || lowerMessage.includes('borrow process') || lowerMessage.includes('borrowing') ||
      lowerMessage.includes('እንዴት እብድር') || lowerMessage.includes('የብድር ሂደት') ||
      lowerMessage.includes('birabiraach') || lowerMessage.includes('liqeess')
    ) {
      return t('chatbot.borrowProcess', { lng: lang });
    }

    // Return Process
    if (
      lowerMessage.includes('how to return') || lowerMessage.includes('return process') || lowerMessage.includes('returning') ||
      lowerMessage.includes('እንዴት እመለስ') || lowerMessage.includes('የመመለሻ ሂደት') ||
      lowerMessage.includes('deebis') || lowerMessage.includes('deebisuu')
    ) {
      return t('chatbot.returnProcess', { lng: lang });
    }

    // Overdue/Fines
    if (
      lowerMessage.includes('overdue') || lowerMessage.includes('fine') || lowerMessage.includes('late') ||
      lowerMessage.includes('ዘግይቷል') || lowerMessage.includes('ቅጣት') ||
      lowerMessage.includes('adabbii') || lowerMessage.includes('yeroo darbe')
    ) {
      return t('chatbot.overdue', { lng: lang });
    }

    // Categories
    if (
      lowerMessage.includes('category') || lowerMessage.includes('categories') || lowerMessage.includes('book type') ||
      lowerMessage.includes('ምድብ') || lowerMessage.includes('ምድቦች') ||
      lowerMessage.includes('garee') || lowerMessage.includes('gareewwan')
    ) {
      return t('chatbot.categories', { lng: lang });
    }

    // Available Copies
    if (
      lowerMessage.includes('available') || lowerMessage.includes('copies') || lowerMessage.includes('in stock') ||
      lowerMessage.includes('ይገኛል') || lowerMessage.includes('ቅጂዎች') ||
      lowerMessage.includes('argamoo') || lowerMessage.includes('kopi')
    ) {
      return t('chatbot.available', { lng: lang });
    }

    // ISBN
    if (
      lowerMessage.includes('isbn') || lowerMessage.includes('book number') || lowerMessage.includes('lakkoofsa')
    ) {
      return t('chatbot.isbn', { lng: lang });
    }

    // Greetings
    if (
      lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || 
      lowerMessage.includes('ሰላም') || lowerMessage.includes('akkam') || lowerMessage.includes('baga nagaan')
    ) {
      return t('chatbot.greeting', { lng: lang });
    }

    // Help
    if (
      lowerMessage.includes('help') || lowerMessage.includes('what can you do') || lowerMessage.includes('assist') ||
      lowerMessage.includes('እርዳታ') || lowerMessage.includes('ምን ማድረግ እችላለሁ') ||
      lowerMessage.includes('gargaarsa') || lowerMessage.includes('tumsa')
    ) {
      return t('chatbot.help', { lng: lang });
    }

    // Default response
    return t('chatbot.default', { lng: lang });
  };

  const sendMessageWithText = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot thinking with the actual sent text
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  const handleSend = () => {
    sendMessageWithText(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickReplies = [
    { key: 'chatbot.quickAddBook', icon: '➕' },
    { key: 'chatbot.quickSearch', icon: '🔍' },
    { key: 'chatbot.quickBorrow', icon: '📖' },
    { key: 'chatbot.quickHelp', icon: '❓' },
  ];

  const handleQuickReply = (key: string) => {
    const text = t(key, { lng: i18n.language });
    sendMessageWithText(text);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat"
        title="AI Library Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <span className="chatbot-icon">🤖</span>
              <div>
                <h3>{t('chatbot.title', { lng: i18n.language })}</h3>
                <span className="chatbot-status">{t('chatbot.online', { lng: i18n.language })}</span>
              </div>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot-message">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="chatbot-quick-replies">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  className="quick-reply-btn"
                  onClick={() => handleQuickReply(reply.key)}
                >
                  <span>{reply.icon}</span>
                  <span>{t(reply.key, { lng: i18n.language })}</span>
                </button>
              ))}
            </div>
          )}

          <div className="chatbot-input-container">
            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              placeholder={t('chatbot.placeholder', { lng: i18n.language })}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="chatbot-send"
              onClick={handleSend}
              disabled={!input.trim()}
              aria-label="Send message"
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
