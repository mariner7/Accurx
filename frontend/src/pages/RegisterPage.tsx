import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';
import { apiService } from '../api/service';
import Logo from '../assets/logo.png';

const PASSWORD_MIN_LENGTH = 8;

function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Mínimo ${PASSWORD_MIN_LENGTH} caracteres`);
  }
  if (!/\d/.test(password)) {
    errors.push('Al menos un número');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Al menos un caracter especial');
  }
  
  return { valid: errors.length === 0, errors };
}

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showDialog } = useDialog();
  
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: 'MALE' as 'MALE' | 'FEMALE',
    address: '',
    phone: '',
    allergies: ''
  });

  const { setAuthState } = useAuth();
  const navigate = useNavigate();

  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const canSubmit = passwordValidation.valid && passwordsMatch && patientData.name && patientData.age;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordValidation.valid) {
      showDialog('Error', 'La contraseña no cumple los requisitos');
      return;
    }
    
    if (!passwordsMatch) {
      showDialog('Error', 'Las contraseñas no coinciden');
      return;
    }
    
    setLoading(true);

    try {
      const response = await apiService.register({
        email,
        password,
        role: 'PATIENT',
        name: patientData.name,
        age: Number(patientData.age),
        gender: patientData.gender,
        address: patientData.address,
        phone: patientData.phone,
        allergies: patientData.allergies
      });
      
      setAuthState(response.token, response.user);
      console.log('Registration successful, navigating to home');
      navigate('/', { replace: true });
    } catch (err: unknown) {
      console.error('Registration error:', err);
      const axiosError = err as { response?: { data?: { error?: { message?: string } } } };
      showDialog('Error', axiosError.response?.data?.error?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="logo" style={{ justifyContent: 'center', marginBottom: '24px' }}>
          <img src={Logo} alt="AccuRx" />
        </div>
        
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Registrarse</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <div className="password-input-container">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={PASSWORD_MIN_LENGTH}
            />
            {password && !passwordValidation.valid && (
              <div className="password-requirements">
                <p className={password.length >= PASSWORD_MIN_LENGTH ? 'valid' : 'invalid'}>
                  ✓ Mínimo {PASSWORD_MIN_LENGTH} caracteres
                </p>
                <p className={/\d/.test(password) ? 'valid' : 'invalid'}>
                  ✓ Al menos un número
                </p>
                <p className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'valid' : 'invalid'}>
                  ✓ Al menos un caracter especial
                </p>
              </div>
            )}
          </div>

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={PASSWORD_MIN_LENGTH}
          />
          {confirmPassword && !passwordsMatch && (
            <p className="error-message">Las contraseñas no coinciden</p>
          )}

          <input
            type="text"
            placeholder="Nombre completo"
            value={patientData.name}
            onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
            required
          />
          <div className="form-row">
            <input
              type="number"
              placeholder="Edad"
              value={patientData.age}
              onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
              required
              min="0"
              max="150"
            />
            <select
              value={patientData.gender}
              onChange={(e) => setPatientData({ ...patientData, gender: e.target.value as 'MALE' | 'FEMALE' })}
              required
            >
              <option value="MALE">Masculino</option>
              <option value="FEMALE">Femenino</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Dirección"
            value={patientData.address}
            onChange={(e) => setPatientData({ ...patientData, address: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={patientData.phone}
            onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Alergias (opcional)"
            value={patientData.allergies}
            onChange={(e) => setPatientData({ ...patientData, allergies: e.target.value })}
          />

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading || !canSubmit}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          ¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
        </p>
      </div>
    </div>
  );
}
