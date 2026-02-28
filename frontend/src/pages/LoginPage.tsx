import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';
import Logo from '../assets/logo.png';
import { es } from '../i18n/es';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { showDialog } = useDialog();
  const navigate = useNavigate();
  const t = es.auth;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      showDialog('Error', t.loginError);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="logo" style={{ justifyContent: 'center', marginBottom: '24px' }}>
          <img src={Logo} alt="AccuRx" />
        </div>
        
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>{t.login}</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            {t.signIn}
          </button>
        </form>
        
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          {t.noAccount} <a href="/register">{t.register}</a>
        </p>
      </div>
  </div>
    );
}
