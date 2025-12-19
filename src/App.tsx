import { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Dashboard } from './components/Dashboard';
import { isLoggedIn, getStoredUserInfo } from './api/auth';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  // 检查是否已登录
  useEffect(() => {
    if (isLoggedIn()) {
      const userInfo = getStoredUserInfo();
      if (userInfo) {
        setUser({ username: userInfo.username });
        setLoggedIn(true);
      }
    }
  }, []);

  const handleLoginSuccess = (username: string) => {
    setUser({ username });
    setLoggedIn(true);
  };

  const handleRegisterSuccess = (username: string) => {
    setUser({ username });
    setLoggedIn(true);
    setShowRegister(false);
  };

  const handleLogout = () => {
    setUser(null);
    setLoggedIn(false);
  };

  const handleSwitchToRegister = () => {
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
  };

  if (loggedIn && user) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen font-mono selection:bg-pink-500 selection:text-white flex items-center justify-center p-4"
         style={{
           backgroundColor: '#e0e7ff',
           backgroundImage: 'radial-gradient(#a5b4fc 1px, transparent 1px)',
           backgroundSize: '24px 24px'
         }}>
      {showRegister ? (
        <RegisterForm 
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      ) : (
        <LoginForm 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}
    </div>
  );
}