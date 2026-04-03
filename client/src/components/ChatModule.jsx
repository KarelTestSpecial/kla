import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

const ChatModule = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Welkom terug. Ik ben gereed voor onze volgende strategische stap.', model: 'KDClaw-System' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      
      // If there's an action, add a special system message or update the bot message
      const botMessage = { 
        role: 'bot', 
        text: data.text, 
        model: data.model || 'Brain',
        action: data.action
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'Systeemfout: Verbinding met de Brain verbroken.', 
        model: 'System' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Brain Console</h2>
        </div>
        <Sparkles size={16} className="text-indigo-400" />
      </div>
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl flex gap-3 ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
            }`}>
              <div className="shrink-0 mt-1">
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} className="text-indigo-400" />}
              </div>
              <div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                {msg.action && (
                  <div className={`mt-3 p-2 rounded-lg border flex items-center gap-2 ${
                    msg.action.status === 'success' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {msg.action.status === 'success' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Action: {msg.action.name.replace(/_/g, ' ')}
                    </span>
                  </div>
                )}
                {msg.model && (
                  <span className="text-[10px] opacity-40 mt-2 block uppercase tracking-tighter">
                    {msg.model}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-400 p-4 rounded-2xl border border-slate-700 rounded-tl-none flex gap-2 items-center">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[10px] uppercase font-mono italic">Thinking via Waterfall...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-slate-900/80 border-t border-slate-800 sticky bottom-0 z-10 backdrop-blur-md">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type een strategische opdracht..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm"
          />
          <button 
            type="submit"
            disabled={isTyping}
            className="absolute right-2 top-1.5 p-2 text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatModule;
