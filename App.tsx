
import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { Auth } from './components/Auth';
import { UserSession } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('vox_session');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (sessionData: UserSession) => {
    localStorage.setItem('vox_session', JSON.stringify(sessionData));
    setSession(sessionData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('vox_session');
    setSession(null);
    setCurrentPage('landing');
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'landing' && (
        <LandingPage 
          onStart={() => setCurrentPage('auth')} 
          onDashboard={() => setCurrentPage('dashboard')}
          isLoggedIn={!!session}
        />
      )}
      {currentPage === 'auth' && (
        <Auth onAuthSuccess={handleLogin} onBack={() => setCurrentPage('landing')} />
      )}
      {currentPage === 'dashboard' && session && (
        <Dashboard session={session} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
