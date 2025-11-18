import { useEffect, useMemo, useRef, useState } from 'react';
import { sendMessage, jobDetails } from '../services/chatbot.service';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

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
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      {!open && (
        <button onClick={() => setOpen(true)} style={{ background: '#6d28d9', color: 'white', borderRadius: 9999, padding: '12px 16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)' }}>Chat</button>
      )}
      {open && (
        <div style={{ width: 360, height: 520, background: 'white', borderRadius: 16, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ background: '#6d28d9', color: 'white', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>CareerForge Assistant</div>
            <button onClick={() => setOpen(false)} style={{ background: 'transparent', color: 'white' }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 12, background: '#f8fafc' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                <div style={{ maxWidth: '85%', background: m.role === 'user' ? '#6d28d9' : 'white', color: m.role === 'user' ? 'white' : '#111827', padding: '8px 10px', borderRadius: 12, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                  {m.type === 'jobList' ? (
                    <div>
                      <div style={{ marginBottom: 6, fontWeight: 600 }}>Here are some roles for you:</div>
                      <div style={{ display: 'grid', gap: 8 }}>
                        {(m.jobs || []).map((j) => (
                          <div key={j.id} style={{ border: '1px solid #e5e7eb', padding: 8, borderRadius: 8, background: 'white' }}>
                            <div style={{ fontWeight: 600 }}>{j.title}</div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>{j.company?.name}</div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                              <a href={`/jobs/${j.id}`} style={{ color: '#6d28d9', fontSize: 12 }}>Open</a>
                              <button onClick={() => openJob(j.id)} style={{ color: '#6d28d9', fontSize: 12, background: 'transparent' }}>Preview</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : m.type === 'applications' ? (
                    <div>
                      <div style={{ marginBottom: 6, fontWeight: 600 }}>Your applications:</div>
                      <div style={{ display: 'grid', gap: 8 }}>
                        {(m.applications || []).map((a) => (
                          <div key={a.id} style={{ border: '1px solid #e5e7eb', padding: 8, borderRadius: 8, background: 'white' }}>
                            <div style={{ fontWeight: 600 }}>{a.job?.title}</div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>{a.job?.company?.name}</div>
                            <div style={{ fontSize: 12, marginTop: 4 }}>Status: {a.status}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : m.type === 'stats' ? (
                    <div>
                      <div style={{ marginBottom: 6, fontWeight: 600 }}>Your application stats</div>
                      <div style={{ fontSize: 14 }}>Total: {m.stats?.total}</div>
                      <div style={{ fontSize: 14 }}>Pending: {m.stats?.pending}</div>
                      <div style={{ fontSize: 14 }}>Accepted: {m.stats?.accepted}</div>
                      <div style={{ fontSize: 14 }}>Rejected: {m.stats?.rejected}</div>
                    </div>
                  ) : (
                    <div>{m.text}</div>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div style={{ padding: 10, display: 'flex', gap: 8, borderTop: '1px solid #e5e7eb', background: 'white' }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') onSend(); }} placeholder="Ask about jobs, companies, applications..." style={{ flex: 1, border: '1px solid #e5e7eb', padding: '10px 12px', borderRadius: 8 }} />
            <button onClick={onSend} disabled={!canSend} style={{ background: canSend ? '#6d28d9' : '#a78bfa', color: 'white', padding: '10px 14px', borderRadius: 8 }}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
