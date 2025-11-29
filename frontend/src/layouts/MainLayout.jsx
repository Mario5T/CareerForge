import { Outlet } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import NotionChatbot from '../components/NotionChatbot';

const MainLayout = () => {
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

      {/* Notion-style Floating Chatbot */}
      <NotionChatbot />
    </div>
  );
};

export default MainLayout;
