import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme, ThemeSelector } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="app-layout" data-theme={theme}>
      <header className="app-header">
        <div className="container header-content">
          <div className="logo">
            <img src={Logo} alt="AccuRx" />
          </div>
          
          <div className="header-datetime">
            {formatDateTime(currentDateTime)}
          </div>

          <div className="user-controls">
            <ThemeSelector />
            <button 
              className={`hamburger-menu ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-items">
          <div className="mobile-menu-item">
            <span>👤</span>
            <span>{user?.email}</span>
          </div>
          <div className="mobile-menu-item">
            <span>📋</span>
            <span className="role-badge">{user?.role}</span>
          </div>
          <div className="mobile-menu-item clickable" onClick={() => { navigate('/profile'); setMenuOpen(false); }}>
            <span>👁️</span>
            <span>Ver Perfil</span>
          </div>
          <div className="mobile-menu-item clickable danger" onClick={handleLogout}>
            <span>🚪</span>
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </div>

      <main className="container main-content">
        {children}
      </main>
    </div>
  );
}
