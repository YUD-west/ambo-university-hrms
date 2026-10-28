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
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am your Ambo University HR & Employee Portal Assistant. How can I help you today with forms, attendance, leaves, or employee records?',
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
    const lower = userMessage.toLowerCase();
    const lang = i18n.language;

    // Life History Form
    if (
      lower.includes('life history') || lower.includes('personal info') || lower.includes('form') ||
      lower.includes('የሕይወት ታሪክ') || lower.includes('ቅጽ') || lower.includes('unka jireenya')
    ) {
      if (lang === 'am') {
        return 'የሕይወት ታሪክ ቅጽ ለመሙላት: ወደ "Life History Form" ገጽ ይሂዱ፣ የግል፣ የቤተሰብ፣ የትምህርትና የስራ ልምድ መረጃዎችን አስገብተው "Submit" የሚለውን ይጫኑ።';
      }
      if (lang === 'om') {
        return 'Unka Seenaa Jireenyaa guutuuf: Fuula "Life History Form" deemi, odeeffannoo dhuunfaa, maatii, barnoota fi muuxannoo hojii guuti ergi.';
      }
      return 'To complete the Life History Form, navigate to the "Life History Form" link from the top navigation or home screen. Fill in personal, family, education, and employment history, then click submit.';
    }

    // Social Security Form
    if (
      lower.includes('social security') || lower.includes('pension') || lower.includes('ጡረታ') ||
      lower.includes('ማህበራዊ ዋስትና') || lower.includes('nagahee hawaasummaa')
    ) {
      if (lang === 'am') {
        return 'የማህበራዊ ዋስትና (ጡረታ) ቅጽ ለመሙላት: ወደ "Social Security Form" ገጽ ይሂዱ፣ የጡረታ መለያ ቁጥርዎንና የስራ ዝርዝሮችን ሞልተው ያስገቡ።';
      }
      if (lang === 'om') {
        return 'Unka Wabii Hawaasummaa guutuuf: Fuula "Social Security Form" deemi, lakkoofsa penshinii fi odeeffannoo hojii guuti ergi.';
      }
      return 'To fill out the Social Security Form, click on "Social Security Form" in the menu. Enter your pension scheme details, identification, and beneficiary information.';
    }

    // Leaves / Vacation
    if (
      lower.includes('leave') || lower.includes('vacation') || lower.includes('sick') ||
      lower.includes('ፈቃድ') || lower.includes('እረፍት') || lower.includes('baha') || lower.includes('eeyyama')
    ) {
      if (lang === 'am') {
        return 'የእረፍት ወይም የህመም ፈቃድ ለመጠየቅ: ወደ HR Portal → "Leave Management" ይሂዱና "Add Leave Request" የሚለውን ይጫኑ። ፈቃዱ በአስተዳዳሪው ይጸድቃል።';
      }
      if (lang === 'om') {
        return 'Eeyyama bahaa gaafachuuf: HR Portal → "Bulchiinsa Baha" deemi, "Add Leave Request" filadhu. Admin irraa mirkanaa\'a.';
      }
      return 'To request leave (vacation, sick, maternity, or personal), go to HR Portal → "Leave Management" and click "Add Leave Request". Your supervisor or HR admin will review and approve it.';
    }

    // Attendance
    if (
      lower.includes('attendance') || lower.includes('check in') || lower.includes('check out') || lower.includes('late') ||
      lower.includes('መገኘት') || lower.includes('ሰዓት') || lower.includes('argamuu')
    ) {
      if (lang === 'am') {
        return 'የመገኘት መረጃን ለመመልከት: ወደ HR Portal → "Attendance" ይሂዱ። የቀኑን መገኘት፣ የዘገዩ ሰራተኞችንና የስራ ሰዓታትን ማየት ይችላሉ።';
      }
      if (lang === 'om') {
        return 'Galmee argamuu ilaaluuf: HR Portal → "Argamuu" deemi. Guyyaa guyyaan kanneen argaman fi sa\'aatii hojii argachuun ni danda\'ama.';
      }
      return 'You can view and log employee attendance under HR Portal → "Attendance". It tracks daily presence, check-in/out times, and calculates total hours worked.';
    }

    // Employees / Directory
    if (
      lower.includes('employee') || lower.includes('staff') || lower.includes('worker') ||
      lower.includes('ሰራተኛ') || lower.includes('ሰራተኞች') || lower.includes('hojjetaa') || lower.includes('hojjettoota')
    ) {
      if (lang === 'am') {
        return 'የሰራተኞችን ዝርዝር ለመመልከት ወይም አዲስ ሰራተኛ ለመመዝገብ: ወደ HR Portal → "Employees" ይሂዱ።';
      }
      if (lang === 'om') {
        return 'Tarree hojjettootaa ilaaluuf ykn hojjetaa haaraa galmeessuuf: HR Portal → "Hojjettoota" deemi.';
      }
      return 'To view the employee directory, search staff, or add new employees, visit HR Portal → "Employees". You can filter by name, department, or status.';
    }

    // Departments
    if (
      lower.includes('department') || lower.includes('division') || lower.includes('ክፍል') || lower.includes('ዲፓርትመንት') || lower.includes('garee')
    ) {
      if (lang === 'am') {
        return 'ክፍሎችን ለመመልከት ወይም ለማስተዳደር: ወደ HR Portal → "Departments" ይሂዱ። የበጀትና የሰራተኛ ቁጥር መረጃዎችን ያገኛሉ።';
      }
      if (lang === 'om') {
        return 'Gareewwan ilaaluuf: HR Portal → "Gareewwan" deemi. Baajata fi baay\'ina hojjettootaa argatta.';
      }
      return 'Manage company/university departments under HR Portal → "Departments". View manager assignments, budgets, and team headcounts.';
    }

    // Performance
    if (
      lower.includes('performance') || lower.includes('review') || lower.includes('rating') ||
      lower.includes('አፈጻጸም') || lower.includes('ግምገማ') || lower.includes('madaallii')
    ) {
      if (lang === 'am') {
        return 'የሰራተኞች የስራ አፈጻጸም ግምገማን ለመመልከት ወይም አዲስ ግምገማ ለማስገባት: ወደ HR Portal → "Performance" ይሂዱ።';
      }
      if (lang === 'om') {
        return 'Madaallii hojii ilaaluuf: HR Portal → "Hojii" deemi. Sadarkaa fi yaada gamaaggamaa galchuu ni dandeessa.';
      }
      return 'Review employee evaluations, achievements, goals, and ratings under HR Portal → "Performance Management".';
    }

    // Admin
    if (
      lower.includes('admin') || lower.includes('approve') || lower.includes('reject') ||
      lower.includes('አስተዳዳሪ') || lower.includes('ማጽደቅ')
    ) {
      if (lang === 'am') {
        return 'የአስተዳዳሪ ገጽ ለመግባት: ወደ "Admin Panel" ይሂዱ። በመጠባበቅ ላይ ያሉ ቅጾችን ማጽደቅ ወይም ውድቅ ማድረግ ይችላሉ።';
      }
      if (lang === 'om') {
        return 'Fuula Admin seenuuf: "Admin Panel" deemi. Unkaalee eeggatan mirkaneessuu ykn dhiisuu dandeessa.';
      }
      return 'HR Administrators can view, review, approve, or reject pending Life History and Social Security form submissions from the "Admin Panel".';
    }

    // Greetings
    if (
      lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || 
      lower.includes('ሰላም') || lower.includes('akkam')
    ) {
      if (lang === 'am') return 'ሰላም! የአምቦ ዩኒቨርሲቲ የሰው ኃይል አስተዳደር ረዳት ነኝ። በምን ልርዳዎት?';
      if (lang === 'om') return 'Akkam! Ani tumsa sirna bulchiinsa humna namaa Yunivarsiitii Ambooti. Maal si gargaaru?';
      return 'Hello! I am the Ambo University HRMS Assistant. How can I assist you with employee forms, leave requests, attendance, or department management?';
    }

    // Default
    if (lang === 'am') {
      return 'ስለ ቅጾች አሞላል፣ ፈቃድ መጠየቅ፣ መገኘት፣ ሰራተኞች ወይም አስተዳዳሪ ፓነል ማንኛውንም ጥያቄ መጠየቅ ይችላሉ።';
    }
    if (lang === 'om') {
      return 'Waa\'ee unkaalee, eeyyama bahaa, argamuu, hojjettootaa, fi paaneelii admin gaafachuu dandeessa.';
    }
    return 'I can assist you with:\n• Life History & Social Security forms\n• Employee records & directory\n• Requesting and approving leaves\n• Daily attendance tracking\n• Performance evaluations\n• Admin panel management\n\nWhat would you like to know?';
  };

  const sendMessageWithText = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: Math.random().toString(36).substring(2, 9),
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 500);
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
    { label: '📋 Life History Form', query: 'How to fill Life History Form?' },
    { label: '📅 Request Leave', query: 'How to request a leave?' },
    { label: '⏰ Check Attendance', query: 'How does attendance tracking work?' },
    { label: '⚙️ Admin Panel', query: 'What can I do in Admin Panel?' },
  ];

  return (
    <>
      <button
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open HR Assistant chat"
        title="HR Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <span className="chatbot-icon">🏛️</span>
              <div>
                <h3>HR Portal Assistant</h3>
                <span className="chatbot-status">Online • Ambo University</span>
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

          {messages.length <= 2 && (
            <div className="chatbot-quick-replies">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  className="quick-reply-btn"
                  onClick={() => sendMessageWithText(reply.query)}
                >
                  <span>{reply.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="chatbot-input-container">
            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              placeholder="Ask HR Assistant..."
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
