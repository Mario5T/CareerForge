import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ChatWidget from '../components/chatbot/ChatWidget';
import ChatWindow from '../components/chatbot/ChatWindow';

const MainLayout = () => {
  // Always call hooks unconditionally and in the same order
  const [chatOpen, setChatOpen] = useState(false);
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-6">
        <Outlet />
      </main>
      <Footer />

      {/* Chatbot UI (mounted to body to avoid layout/transform side-effects) */}
      {createPortal(
        <>
          <ChatWindow open={chatOpen} onClose={() => setChatOpen(false)} />
          <ChatWidget open={chatOpen} onToggle={() => setChatOpen((v) => !v)} />
        </>,
        document.body
      )}
    </div>
  );
};

export default MainLayout;
