import { useState } from 'react';
import ChatWidget from './ChatWidget';
import ChatWindow from './ChatWindow';

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ChatWidget open={open} onToggle={() => setOpen((v) => !v)} />
      <ChatWindow open={open} onClose={() => setOpen(false)} />
    </>
  );
}
