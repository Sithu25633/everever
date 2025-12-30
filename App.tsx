
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Splash from './components/Splash';
import SecurityGate from './components/SecurityGate';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Photos from './components/Photos';
import Videos from './components/Videos';
import Letters from './components/Letters';
import LoveCounter from './components/LoveCounter';
import { AppSection } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [securityUnlocked, setSecurityUnlocked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);

  useEffect(() => {
    // Check local storage for persistent login
    const savedPin = localStorage.getItem('security_unlocked');
    const token = localStorage.getItem('auth_token');
    
    if (savedPin === 'true') setSecurityUnlocked(true);
    if (token) setAuthenticated(true);

    // Initial splash timeout
    const timer = setTimeout(() => setLoading(false), 3000);

    // Disable right click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    // Setup daily notifications (Simulation)
    requestNotificationPermission();

    return () => {
      clearTimeout(timer);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }
  };

  if (loading) return <Splash />;
  if (!securityUnlocked) return <SecurityGate onUnlock={() => setSecurityUnlocked(true)} />;
  if (!authenticated) return <Auth onLogin={() => setAuthenticated(true)} />;

  const renderSection = () => {
    switch (activeSection) {
      case AppSection.HOME: return <Home />;
      case AppSection.PHOTOS: return <Photos />;
      case AppSection.VIDEOS: return <Videos />;
      case AppSection.LETTERS: return <Letters />;
      case AppSection.COUNTER: return <LoveCounter />;
      default: return <Home />;
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-rose-500/30 overflow-hidden flex flex-col">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-900 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-800 rounded-full blur-[120px]" />
      </div>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 pt-4 px-4 scroll-smooth">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl mx-auto"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Text */}
      <div className="fixed bottom-20 left-0 right-0 text-center opacity-40 text-[10px] uppercase tracking-[0.2em] font-light z-40 pointer-events-none">
        for your Kash ❤
      </div>

      <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />
    </div>
  );
};

export default App;
