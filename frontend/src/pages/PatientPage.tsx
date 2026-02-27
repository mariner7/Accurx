import { useState, useEffect } from 'react';
import { apiService } from '../api/service';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import type { Appointment, Doctor } from '../types';

export function PatientPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentsData, doctorsData] = await Promise.all([
        apiService.getAppointments(),
        apiService.getDoctors()
      ]);
      console.log('Doctors loaded:', doctorsData);
      setAppointments(appointmentsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const myAppointments = appointments.filter(apt => apt.patientId === user?.patientId);

  const getAvailableSlots = (doctorId: string, date: string): string[] => {
    const doctorAppointments = appointments.filter(
      apt => apt.doctorId === doctorId && 
             apt.status.value !== 'CANCELLED' &&
             new Date(apt.startTime).toISOString().split('T')[0] === date
    );

    const allSlots: string[] = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let min = 0; min < 60; min += 60) {
        allSlots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
      }
    }

    const bookedSlots = doctorAppointments.map(apt => {
      const time = new Date(apt.startTime);
      return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
    });

    return allSlots.filter(slot => !bookedSlots.includes(slot));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    const startTime = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();

    try {
      await apiService.createAppointment({
        patientId: user!.patientId!,
        doctorId: selectedDoctor,
        startTime,
        notes
      });
      setShowForm(false);
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedTime('');
      setNotes('');
      loadData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: { message?: string } } } };
      console.error('Error creating appointment:', error);
      const errorMessage = err.response?.data?.error?.message || 'Error al crear la cita';
      alert(errorMessage);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) return;
    
    try {
      await apiService.cancelAppointment(id);
      loadData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: { message?: string } } } };
      console.error('Error cancelling:', error);
      alert(err.response?.data?.error?.message || 'Error al cancelar la cita');
    }
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor?.name || doctorId.substring(0, 8);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'RESERVED': return 'Reservada';
      case 'CONFIRMED': return 'Confirmada';
      case 'CANCELLED': return 'Cancelada';
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

  const canModify = (appointment: Appointment) => {
    const hoursUntil = (new Date(appointment.startTime).getTime() - Date.now()) / (1000 * 60 * 60);
    return hoursUntil >= 24;
  };

  const availableSlots = selectedDoctor && selectedDate 
    ? getAvailableSlots(selectedDoctor, selectedDate)
    : [];

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <Layout>
      <div className="patient-page">
        <div className="page-header">
          <h2>Mis Citas</h2>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancelar' : 'Nueva Cita'}
          </button>
        </div>

        {showForm && (
          <div className="card form-card">
            <h3>Agendar Nueva Cita</h3>
            <form onSubmit={handleSubmit} className="appointment-form">
              <div className="form-group">
                <label>Médico</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => { setSelectedDoctor(e.target.value); setSelectedTime(''); }}
                  required
                >
                  <option value="">Seleccionar médico</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} - {d.specialty}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Hora</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                    disabled={!selectedDoctor || !selectedDate}
                  >
                    <option value="">Seleccionar hora</option>
                    {availableSlots.length > 0 ? (
                      availableSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))
                    ) : (
                      selectedDoctor && selectedDate && (
                        <option value="" disabled>No hay horarios disponibles</option>
                      )
                    )}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Notas (opcional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe tus síntomas o motivo de la consulta"
                  rows={3}
                />
              </div>
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!selectedDoctor || !selectedDate || !selectedTime || availableSlots.length === 0}
                >
                  Agendar Cita
                </button>
              </div>
            </form>
          </div>
        )}

        <section className="section">
          <h3>Próximas Citas</h3>
          {myAppointments.length === 0 ? (
            <div className="empty-message">No tienes citas programadas</div>
          ) : (
            <div className="appointments-list">
              {myAppointments
                .filter(apt => apt.status.value !== 'CANCELLED')
                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                .map(apt => (
                  <div key={apt.id} className="appointment-item">
                    <div className="appointment-info">
                      <div className="appointment-date">
                        {new Date(apt.startTime).toLocaleDateString()} - {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="appointment-doctor">Dr. {getDoctorName(apt.doctorId)}</div>
                      <span className={getStatusClass(apt.status.value)}>{getStatusLabel(apt.status.value)}</span>
                    </div>
                    {apt.clinicalNotes && (
                      <div className="appointment-notes">
                        <strong>Notas clínicas:</strong> {apt.clinicalNotes.observations}
                        {apt.clinicalNotes.diagnosis && <><br /><strong>Diagnóstico:</strong> {apt.clinicalNotes.diagnosis}</>}
                        {apt.clinicalNotes.treatment && <><br /><strong>Tratamiento:</strong> {apt.clinicalNotes.treatment}</>}
                      </div>
                    )}
                    <div className="appointment-actions">
                      {apt.status.value !== 'CANCELLED' && canModify(apt) && (
                        <button onClick={() => handleCancel(apt.id)} className="btn btn-outline btn-sm">
                          Cancelar
                        </button>
                      )}
                      {!canModify(apt) && apt.status.value !== 'CANCELLED' && (
                        <span className="empty-message" style={{ fontSize: '0.75rem' }}>
                          Cancelación disponible hasta 24h antes
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
