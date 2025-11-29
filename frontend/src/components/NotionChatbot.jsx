import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { MessageSquare, X, Send, Sparkles, Bot } from 'lucide-react';
import { sendMessage, jobDetails } from '../services/chatbot.service';

export default function NotionChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const inputRef = useRef(null);
  const endRef = useRef(null);
  const windowRef = useRef(null);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        windowRef.current && 
        !windowRef.current.contains(e.target) && 
        !e.target.closest('button[aria-label="Ask AI"]') // Don't close if clicking trigger
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const onSend = async () => {
    if (!canSend) return;
    const text = input.trim();
    const userMsg = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await sendMessage(text);
      if (data?.type === 'jobList') {
        setMessages((prev) => [...prev, { role: 'bot', type: 'jobList', jobs: data.jobs }]);
      } else if (data?.type === 'applications') {
        setMessages((prev) => [...prev, { role: 'bot', type: 'applications', applications: data.applications }]);
      } else if (data?.type === 'stats') {
        setMessages((prev) => [...prev, { role: 'bot', type: 'stats', stats: data.stats }]);
      } else if (data?.message || data?.text) {
        setMessages((prev) => [...prev, { role: 'bot', type: 'text', text: data.message || data.text }]);
      } else {
        setMessages((prev) => [...prev, { role: 'bot', type: 'text', text: 'No response.' }]);
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'bot', type: 'text', text: 'Failed to connect. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const openJob = async (id) => {
    try {
      const data = await jobDetails(id);
      const text = `Job: ${data.title} at ${data.company?.name}\n\n${data.description?.substring(0, 100)}...`;
      setMessages((prev) => [...prev, { role: 'bot', type: 'text', text }]);
    } catch {}
  };

  return (
    <>
      {/* Floating Trigger Button - Fixed to Viewport */}
      <div 
        style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 9990 }}
        className="print:hidden"
      >
        <button
          onClick={() => setOpen(!open)}
          aria-label="Ask AI"
          className={`
            flex items-center justify-center w-11 h-11 rounded-full 
            bg-white text-slate-700
            shadow-[0_4px_12px_rgba(0,0,0,0.15)] 
            hover:bg-slate-50 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)]
            active:scale-95 active:shadow-sm
            transition-all duration-200 ease-out
            border border-slate-100
          `}
        >
          {open ? (
            <X size={20} className="text-slate-500" />
          ) : (
            <Sparkles size={20} className="text-purple-600 fill-purple-100" />
          )}
        </button>
      </div>

      {/* Chat Window - Rendered via Portal */}
      {open && createPortal(
        <div 
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{ zIndex: 9999 }}
        >
          <div
            ref={windowRef}
            className="absolute bottom-24 right-8 w-[380px] max-w-[calc(100vw-40px)] 
                       bg-white rounded-xl shadow-2xl border border-slate-200 
                       pointer-events-auto flex flex-col overflow-hidden
                       animate-in slide-in-from-bottom-2 fade-in duration-200 origin-bottom-right"
            style={{ 
              height: '600px', 
              maxHeight: 'calc(100vh - 120px)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center">
                  <Sparkles size={14} className="text-purple-600" />
                </div>
                <span className="font-semibold text-slate-800 text-sm">CareerForge AI</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-green-100 text-green-700 uppercase tracking-wide">Beta</span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-6 opacity-60">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3">
                    <Bot size={24} className="text-purple-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-800">How can I help you?</p>
                  <p className="text-xs text-slate-500 mt-1">Ask about jobs, applications, or company info.</p>
                </div>
              )}
              
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`
                      max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm
                      ${m.role === 'user' 
                        ? 'bg-purple-600 text-white rounded-br-none' 
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'}
                    `}
                  >
                    {m.type === 'jobList' ? (
                      <div className="space-y-2">
                        <p className="font-medium text-xs opacity-80 mb-2">Recommended Roles:</p>
                        {m.jobs?.map(j => (
                          <div key={j.id} className="bg-slate-50 p-2 rounded border border-slate-100">
                            <div className="font-semibold text-slate-900">{j.title}</div>
                            <div className="text-xs text-slate-500">{j.company?.name}</div>
                            <div className="mt-2 flex gap-2">
                              <a href={`/jobs/${j.id}`} target="_blank" rel="noreferrer" className="text-xs text-purple-600 font-medium hover:underline">View</a>
                              <button onClick={() => openJob(j.id)} className="text-xs text-slate-500 hover:text-slate-800">Preview</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : m.type === 'stats' ? (
                      <div className="space-y-1">
                        <p className="font-medium border-b border-slate-100 pb-1 mb-1">Application Stats</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                          <span>Total:</span> <span className="font-mono">{m.stats?.total}</span>
                          <span>Pending:</span> <span className="font-mono text-yellow-600">{m.stats?.pending}</span>
                          <span>Accepted:</span> <span className="font-mono text-green-600">{m.stats?.accepted}</span>
                          <span>Rejected:</span> <span className="font-mono text-red-600">{m.stats?.rejected}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-100">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
                  placeholder="Ask anything..."
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all placeholder:text-slate-400"
                />
                <button 
                  onClick={onSend}
                  disabled={!canSend}
                  className="absolute right-1.5 p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="text-[10px] text-center text-slate-400 mt-2">
                AI can make mistakes. Please verify important info.
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
