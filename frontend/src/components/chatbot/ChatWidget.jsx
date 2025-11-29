import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const ChatWidget = ({ open, onToggle }) => {
  return (
    <button
      aria-label="Open chatbot"
      onClick={onToggle}
      className={[
        'fixed z-50 bottom-6 right-6',
        'mr-[env(safe-area-inset-right)] mb-[env(safe-area-inset-bottom)]',
        'h-14 w-14 md:h-16 md:w-16 rounded-full',
        'bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500',
        'shadow-2xl border border-white/20',
        'flex items-center justify-center',
        'transition transform hover:scale-105',
        'chat-sphere-glow',
      ].join(' ')}
    >
      <div className="relative">
        <MessageCircle className="h-7 w-7 text-white drop-shadow" />
        <span className={[
          'absolute -top-2 -right-2 h-3 w-3 rounded-full',
          open ? 'bg-emerald-400 animate-pulse' : 'bg-white/70'
        ].join(' ')} />
      </div>
    </button>
  );
};

export default ChatWidget;
