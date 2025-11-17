import { useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';

const ChatWindow = ({ open, onClose }) => {
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Click outside to close
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
          <div className="text-sm text-slate-500">How can I help you today?</div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex items-center gap-2 p-3 border-t bg-slate-50"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about jobs, companies, or candidates"
            className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button type="submit" className="inline-flex items-center justify-center rounded-full bg-primary text-white h-10 w-10 hover:opacity-90 transition">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
