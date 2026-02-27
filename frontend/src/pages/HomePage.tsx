import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme, ThemeSelector } from '../context/ThemeContext';
import { apiService } from '../api/service';
import type { Appointment, Patient, Doctor } from '../types';
import Logo from '../assets/logo.png';
import { es } from '../i18n/es';

export function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const t = es;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentsData, doctorsData] = await Promise.all([
        apiService.getAppointments(),
        apiService.getDoctors()
      ]);
      setAppointments(appointmentsData);
      setDoctors(doctorsData);

      if (user?.role === 'DOCTOR' || user?.role === 'ADMIN') {
        const patientsData = await apiService.getPatients();
        setPatients(patientsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await apiService.cancelAppointment(id);
      loadData();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await apiService.confirmAppointment(id);
      loadData();
    } catch (error) {
      console.error('Error confirming appointment:', error);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'RESERVED': return t.appointments.reserved;
      case 'CONFIRMED': return t.appointments.confirmed;
      case 'CANCELLED': return t.appointments.cancelled;
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'RESERVED': return 'status-badge status-reserved';
      case 'CONFIRMED': return 'status-badge status-confirmed';
      case 'CANCELLED': return 'status-badge status-cancelled';
      default: return '';
    }
  };

  if (loading) return <div className="loading">{t.common.loading}</div>;

  return (
    <div className="app-layout" data-theme={theme}>
      <header className="app-header">
        <div className="container header-content">
          <div className="logo">
            <img src={Logo} alt="AccuRx" />
          </div>
          <div className="user-controls">
            <ThemeSelector />
            {user?.role === 'ADMIN' && (
              <button onClick={() => navigate('/admin')} className="btn btn-outline btn-sm">
                Admin
              </button>
            )}
            <div className="user-info">
              <span>{user?.email}</span>
              <span className="role-badge">{user?.role}</span>
              <button onClick={logout} className="btn btn-secondary">{t.home.logout}</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container main-content">
        {(user?.role === 'DOCTOR' || user?.role === 'ADMIN') && (
          <section className="section">
            <div className="section-header">
              <h2>{t.home.patients}</h2>
              <span className="count-badge">{patients.length}</span>
            </div>
            {patients.length > 0 ? (
              <div className="card-grid">
                {patients.map(p => (
                  <div key={p.id} className="mini-card">
                    <h4>{p.name}</h4>
                    <p>{p.email}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">{t.common.noData}</p>
            )}
          </section>
        )}

        <section className="section">
          <div className="section-header">
            <h2>{t.home.doctors}</h2>
            <span className="count-badge">{doctors.length}</span>
          </div>
          {doctors.length > 0 ? (
            <div className="card-grid">
              {doctors.map(d => (
                <div key={d.id} className="mini-card">
                  <h4>{d.name}</h4>
                  <p>{d.specialty}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">{t.common.noData}</p>
          )}
        </section>

        <section className="section">
          <div className="section-header">
            <h2>{t.home.appointments}</h2>
            <span className="count-badge">{appointments.length}</span>
          </div>
          {appointments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>{t.home.doctors}</th>
                  <th>{t.appointments.startTime}</th>
                  <th>{t.appointments.status}</th>
                  <th>{t.appointments.notes}</th>
                  <th>{t.common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(apt => (
                  <tr key={apt.id}>
                    <td>{doctors.find(d => d.id === apt.doctorId)?.name || apt.doctorId.substring(0, 8)}</td>
                    <td>{new Date(apt.startTime).toLocaleString()}</td>
                    <td><span className={getStatusClass(apt.status.value)}>{getStatusLabel(apt.status.value)}</span></td>
                    <td>{apt.notes || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        {apt.status.value === 'RESERVED' && user?.role === 'DOCTOR' && (
                          <button onClick={() => handleConfirm(apt.id)} className="btn btn-primary btn-sm">
                            {t.common.confirm}
                          </button>
                        )}
                        {apt.status.value !== 'CANCELLED' && (
                          <button onClick={() => handleCancel(apt.id)} className="btn btn-outline btn-sm">
                            {t.common.cancel}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-message">{t.common.noData}</p>
          )}
        </section>
      </main>
    </div>
  );
}
