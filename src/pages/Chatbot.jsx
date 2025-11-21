import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI travel companion for India. How can I help you plan your journey today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newMessage = { id: Date.now(), text: message, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsTyping(true);
    try {
      const resp = await api.chat.send(message, 'web-session');
      const botText = resp.reply || (resp.raw && JSON.stringify(resp.raw)) || 'Sorry, I could not process that.';
      setMessages(prev => [...prev, { id: Date.now()+1, text: botText, sender: 'ai', timestamp: new Date() }]);
      // optionally save chat to supabase (existing feature)
      try { if (typeof saveChat === 'function') saveChat({ user: 'me', message, reply: botText }); } catch(e){}
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now()+2, text: 'Error: ' + err.message, sender: 'ai', timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-4">
      <div className="chat-window bg-white rounded-lg p-4 shadow">
        <div className="messages h-80 overflow-auto mb-4">
          {messages.map(m => (
            <div key={m.id} className={`my-2 ${m.sender==='ai'?'text-left':'text-right'}`}>
              <div className="inline-block p-2 rounded-md bg-gray-100">{m.text}</div>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2">
          <input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ask about places, safety, budget..." className="flex-1 p-2 border rounded"/>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">
            {isTyping ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
