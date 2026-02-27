import { useState, useEffect } from 'react';
import { apiService } from '../api/service';
import { Layout } from '../components/Layout';
import type { Doctor } from '../types';

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

export function AdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [role, setRole] = useState<'DOCTOR' | 'ADMIN'>('DOCTOR');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    licenseNumber: '',
    phone: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const data = await apiService.getDoctors();
      setDoctors(data);
    } catch (err) {
      console.error('Error loading doctors:', err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const passwordValidation = validatePassword(formData.password);
  const canSubmit = role === 'ADMIN' || (role === 'DOCTOR' && passwordValidation.valid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (role === 'DOCTOR' && !passwordValidation.valid) {
      setError('La contraseña no cumple los requisitos');
      setLoading(false);
      return;
    }

    try {
      await apiService.createDoctor(formData);
      setSuccess(`${role === 'DOCTOR' ? 'Médico' : 'Administrador'} creado exitosamente`);
      setFormData({ name: '', specialty: '', licenseNumber: '', phone: '', email: '', password: '' });
      setShowForm(false);
      loadDoctors();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: { message?: string } } } };
      setError(axiosError.response?.data?.error?.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      licenseNumber: doctor.licenseNumber,
      phone: doctor.phone,
      email: doctor.email,
      password: ''
    });
    setShowForm(true);
  };

  return (
    <Layout>
      <div className="admin-page">
        <div className="page-header">
          <h2>Panel de Administración</h2>
          <button onClick={() => { setShowForm(!showForm); setEditingDoctor(null); setFormData({ name: '', specialty: '', licenseNumber: '', phone: '', email: '', password: '' }); }} className="btn btn-primary">
            {showForm ? 'Cancelar' : '+ Nuevo Usuario'}
          </button>
        </div>

        {showForm && (
          <div className="card form-card">
            <h3>{editingDoctor ? 'Editar' : 'Crear Nuevo'} {role === 'DOCTOR' ? 'Médico' : 'Administrador'}</h3>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>Tipo de usuario</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'DOCTOR' | 'ADMIN')}
                disabled={!!editingDoctor}
              >
                <option value="DOCTOR">Médico</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            {success && <p className="success-message">{success}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="doctor-form">
              {role === 'DOCTOR' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre completo</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Dr. Juan Pérez"
                      />
                    </div>
                    <div className="form-group">
                      <label>Especialidad</label>
                      <input
                        type="text"
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        required
                        placeholder="Cardiología"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Cédula profesional</label>
                      <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        required
                        placeholder="12345678"
                        disabled={!!editingDoctor}
                      />
                    </div>
                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        placeholder="+52 55 1234 5678"
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="doctor@hospital.com"
                    disabled={!!editingDoctor}
                  />
                </div>
                {!editingDoctor && role === 'DOCTOR' && (
                  <div className="form-group">
                    <label>Contraseña</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={PASSWORD_MIN_LENGTH}
                        placeholder="Mínimo 8 caracteres"
                        style={{ flex: 1, paddingRight: '40px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          padding: '4px',
                          color: '#666'
                        }}
                        title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showPassword ? '\u2716' : '\u2714'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {role === 'DOCTOR' && !editingDoctor && (
                <>
                  <div className="password-input-container" style={{ marginBottom: '16px' }}>
                    {formData.password && !passwordValidation.valid && (
                      <div className="password-requirements">
                        <p className={formData.password.length >= PASSWORD_MIN_LENGTH ? 'valid' : 'invalid'}>
                          ✓ Mínimo {PASSWORD_MIN_LENGTH} caracteres
                        </p>
                        <p className={/\d/.test(formData.password) ? 'valid' : 'invalid'}>
                          ✓ Al menos un número
                        </p>
                        <p className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'valid' : 'invalid'}>
                          ✓ Al menos un caracter especial
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading || (role === 'DOCTOR' && !canSubmit)}>
                  {loading ? 'Creando...' : editingDoctor ? 'Actualizar' : `Crear ${role === 'DOCTOR' ? 'Médico' : 'Administrador'}`}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="section">
          <h3>Médicos Registrados</h3>
          {loadingDoctors ? (
            <p>Cargando...</p>
          ) : doctors.length > 0 ? (
            <div className="card-grid">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="mini-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4>{doctor.name}</h4>
                    <p>{doctor.specialty}</p>
                    <p>{doctor.email}</p>
                    <p>Cédula: {doctor.licenseNumber}</p>
                  </div>
                  <button 
                    onClick={() => handleEdit(doctor)} 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      opacity: 0.5,
                      padding: '4px'
                    }}
                    title="Editar"
                  >
                    ✏️
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No hay médicos registrados</p>
          )}
        </div>

        <div className="info-card">
          <h3>Gestión de Usuarios</h3>
          <p>Desde este panel puedes crear médicos y administradores del sistema.</p>
          <ul>
            <li><strong>Médicos:</strong> Pueden atender citas y agregar historial clínico</li>
            <li><strong>Administradores:</strong> Pueden gestionar médicos y otros administradores</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
