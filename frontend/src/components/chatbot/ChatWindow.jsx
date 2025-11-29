import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Send } from 'lucide-react';
import { sendMessage, jobDetails } from '../../services/chatbot.service';

const ChatWindow = ({ open, onClose }) => {
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const endRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [open, onClose]);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

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
        const botMsg = { role: 'bot', type: 'jobList', jobs: data.jobs };
        setMessages((prev) => [...prev, botMsg]);
      } else if (data?.type === 'applications') {
        const botMsg = { role: 'bot', type: 'applications', applications: data };
        setMessages((prev) => [...prev, botMsg]);
      } else if (data?.type === 'stats') {
        const botMsg = { role: 'bot', type: 'stats', stats: data.stats };
        setMessages((prev) => [...prev, botMsg]);
      } else if (data?.message) {
        const botMsg = { role: 'bot', type: 'text', text: data.message };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const botMsg = { role: 'bot', type: 'text', text: 'No response.' };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (e) {
      const botMsg = { role: 'bot', type: 'text', text: 'Failed to fetch. Please login and try again.' };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const openJob = async (id) => {
    try {
      const data = await jobDetails(id);
      const text = `${data.title} at ${data.company?.name}`;
      const botMsg = { role: 'bot', type: 'text', text };
      setMessages((prev) => [...prev, botMsg]);
    } catch {}
  };

  return (
    <div
      className={[
        'fixed z-50 right-4 md:right-6',
        'bottom-24 md:bottom-28',
        'w-[92vw] max-w-md md:max-w-lg',
        'transition-all duration-200',
        open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none',
      ].join(' ')}
    >
      <div
        ref={containerRef}
        className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="CareerForge Assistant"
      >
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b">
          <div className="font-semibold">CareerForge Assistant</div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-72 md:h-96 overflow-y-auto px-4 py-3 space-y-3 bg-white">
          {messages.length === 0 && (
            <div className="text-sm text-slate-500">How can I help you today?</div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={['flex', m.role === 'user' ? 'justify-end' : 'justify-start'].join(' ')}>
              <div className={[
                'max-w-[85%] px-3 py-2 rounded-xl shadow-sm text-sm',
                m.role === 'user' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-900'
              ].join(' ')}>
                {m.type === 'jobList' ? (
                  <div>
                    <div className="font-semibold mb-2">Here are some roles for you:</div>
                    <div className="space-y-2">
                      {(m.jobs || []).map((j) => (
                        <div key={j.id} className="border border-slate-200 rounded-lg p-2 bg-white text-slate-900">
                          <div className="font-semibold">{j.title}</div>
                          <div className="text-xs text-slate-500">{j.company?.name}</div>
                          <div className="flex gap-3 mt-2">
                            <a href={`/jobs/${j.id}`} className="text-primary text-xs">Open</a>
                            <button onClick={() => openJob(j.id)} className="text-primary text-xs">Preview</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : m.type === 'applications' ? (
                  <div>
                    <div className="font-semibold mb-2">Your applications:</div>
                    <div className="space-y-2">
                      {(m.applications || []).map((a) => (
                        <div key={a.id} className="border border-slate-200 rounded-lg p-2 bg-white text-slate-900">
                          <div className="font-semibold">{a.job?.title}</div>
                          <div className="text-xs text-slate-500">{a.job?.company?.name}</div>
                          <div className="text-xs mt-1">Status: {a.status}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : m.type === 'stats' ? (
                  <div>
                    <div className="font-semibold mb-2">Your application stats</div>
                    <div className="text-sm">Total: {m.stats?.total}</div>
                    <div className="text-sm">Pending: {m.stats?.pending}</div>
                    <div className="text-sm">Accepted: {m.stats?.accepted}</div>
                    <div className="text-sm">Rejected: {m.stats?.rejected}</div>
                  </div>
                ) : (
                  <div>{m.text}</div>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSend();
          }}
          className="flex items-center gap-2 p-3 border-t bg-slate-50"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about jobs, companies, or candidates"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSend(); }}
            className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button type="submit" disabled={!canSend} className="inline-flex items-center justify-center rounded-full bg-primary text-white h-10 w-10 hover:opacity-90 transition disabled:opacity-60">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
