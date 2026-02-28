import { useState, useEffect } from 'react';
import { apiService } from '../api/service';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';
import { Layout } from '../components/Layout';
import type { Appointment, Patient } from '../types';

export function DoctorPage() {
  const { user } = useAuth();
  const { showDialog } = useDialog();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [showClinicalForm, setShowClinicalForm] = useState<string | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState({
    observations: '',
    diagnosis: '',
    treatment: '',
    followUp: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentsData, patientsData] = await Promise.all([
        apiService.getAppointments(),
        apiService.getPatients()
      ]);
      setAppointments(appointmentsData);
      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading data:', error);
      showDialog('Error', 'No se pudieron cargar los datos. Por favor, intente de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const myAppointments = appointments.filter(apt => apt.doctorId === user?.doctorId);

  const todayAppointments = myAppointments.filter(apt => {
    const aptDate = new Date(apt.startTime).toISOString().split('T')[0];
    return aptDate === selectedDate;
  });

  const handleConfirm = async (id: string) => {
    try {
      await apiService.confirmAppointment(id);
      loadData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: { message?: string } } } };
      console.error('Error confirming:', error);
      showDialog('Error', err.response?.data?.error?.message || 'Error al confirmar la cita');
    }
  };

  const handleCancel = async (id: string) => {
    // TODO: Implement a custom confirm dialog
    if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) return;
    
    try {
      await apiService.cancelAppointment(id, 'DOCTOR');
      loadData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: { message?: string } } } };
      console.error('Error cancelling:', error);
      showDialog('Error', err.response?.data?.error?.message || 'Error al cancelar la cita');
    }
  };

  const handleAddClinicalNotes = async (appointmentId: string) => {
    try {
      await apiService.addClinicalNotes(appointmentId, {
        observations: clinicalNotes.observations,
        diagnosis: clinicalNotes.diagnosis || null,
        treatment: clinicalNotes.treatment || null,
        followUp: clinicalNotes.followUp || null
      });
      setShowClinicalForm(null);
      setClinicalNotes({ observations: '', diagnosis: '', treatment: '', followUp: '' });
      loadData();
    } catch (error) {
      console.error('Error adding clinical notes:', error);
      showDialog('Error', 'Error al agregar notas clínicas');
    }
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.name || patientId.substring(0, 8);
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

  const canCancel = (appointment: Appointment) => {
    const hoursUntil = (new Date(appointment.startTime).getTime() - Date.now()) / (1000 * 60 * 60);
    return hoursUntil >= 1;
  };

  const canAddNotes = (appointment: Appointment) => {
    return appointment.status.value === 'CONFIRMED' && !appointment.clinicalNotes;
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <Layout>
      <div className="doctor-page">
        <div className="page-header">
          <h2>Agenda del Día</h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-picker"
            />
            <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
              {showForm ? 'Cancelar' : '+ Nueva Cita'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="card form-card">
            <h3>Crear Nueva Cita</h3>
            <CreateAppointmentForm 
              patients={patients} 
              doctorId={user?.doctorId || ''}
              onSuccess={() => { setShowForm(false); loadData(); }} 
            />
          </div>
        )}

        <div className="appointments-timeline">
          {todayAppointments.length === 0 ? (
            <div className="empty-state">
              <p>No hay citas programadas para esta fecha</p>
            </div>
          ) : (
            todayAppointments
              .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
              .map(apt => (
                <div key={apt.id} className="appointment-card">
                  <div className="appointment-time">
                    {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="appointment-content">
                    <div className="appointment-header">
                      <span className="patient-name">{getPatientName(apt.patientId)}</span>
                      <span className={getStatusClass(apt.status.value)}>{getStatusLabel(apt.status.value)}</span>
                    </div>
                    {apt.notes && (
                      <div className="appointment-notes">
                        <strong>Notas:</strong> {apt.notes}
                      </div>
                    )}
                    {apt.clinicalNotes && (
                      <div className="appointment-notes">
                        <strong>Historia Clínica:</strong><br />
                        <strong>Observaciones:</strong> {apt.clinicalNotes.observations}<br />
                        {apt.clinicalNotes.diagnosis && <><strong>Diagnóstico:</strong> {apt.clinicalNotes.diagnosis}<br /></>}
                        {apt.clinicalNotes.treatment && <><strong>Tratamiento:</strong> {apt.clinicalNotes.treatment}<br /></>}
                        {apt.clinicalNotes.followUp && <><strong>Seguimiento:</strong> {apt.clinicalNotes.followUp}</>}
                      </div>
                    )}
                    <div className="appointment-actions">
                      {apt.status.value === 'RESERVED' && (
                        <button onClick={() => handleConfirm(apt.id)} className="btn btn-primary btn-sm">
                          Confirmar
                        </button>
                      )}
                      {apt.status.value !== 'CANCELLED' && canCancel(apt) && (
                        <button onClick={() => handleCancel(apt.id)} className="btn btn-outline btn-sm">
                          Cancelar
                        </button>
                      )}
                      {!canCancel(apt) && apt.status.value !== 'CANCELLED' && (
                        <span className="empty-message" style={{ fontSize: '0.75rem' }}>
                          Cancelación disponible hasta 1h antes
                        </span>
                      )}
                      {canAddNotes(apt) && (
                        <button onClick={() => setShowClinicalForm(apt.id)} className="btn btn-outline btn-sm">
                          Agregar Historia Clínica
                        </button>
                      )}
                    </div>

                    {showClinicalForm === apt.id && (
                      <div className="card" style={{ marginTop: '12px', padding: '16px' }}>
                        <h4>Historia Clínica</h4>
                        <div className="form-group" style={{ marginTop: '12px' }}>
                          <label>Observaciones *</label>
                          <textarea
                            value={clinicalNotes.observations}
                            onChange={(e) => setClinicalNotes({ ...clinicalNotes, observations: e.target.value })}
                            required
                            rows={3}
                            placeholder="Describe las observaciones de la consulta"
                          />
                        </div>
                        <div className="form-group">
                          <label>Diagnóstico</label>
                          <input
                            type="text"
                            value={clinicalNotes.diagnosis}
                            onChange={(e) => setClinicalNotes({ ...clinicalNotes, diagnosis: e.target.value })}
                            placeholder="Diagnóstico"
                          />
                        </div>
                        <div className="form-group">
                          <label>Tratamiento</label>
                          <input
                            type="text"
                            value={clinicalNotes.treatment}
                            onChange={(e) => setClinicalNotes({ ...clinicalNotes, treatment: e.target.value })}
                            placeholder="Tratamiento recomendado"
                          />
                        </div>
                        <div className="form-group">
                          <label>Seguimiento/Alta</label>
                          <input
                            type="text"
                            value={clinicalNotes.followUp}
                            onChange={(e) => setClinicalNotes({ ...clinicalNotes, followUp: e.target.value })}
                            placeholder="Próxima cita o alta"
                          />
                        </div>
                        <div className="form-actions" style={{ marginTop: '12px' }}>
                          <button 
                            onClick={() => handleAddClinicalNotes(apt.id)} 
                            className="btn btn-primary"
                            disabled={!clinicalNotes.observations}
                          >
                            Guardar Historia Clínica
                          </button>
                          <button 
                            onClick={() => setShowClinicalForm(null)} 
                            className="btn btn-secondary"
                            style={{ marginLeft: '8px' }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </Layout>
  );
}

function CreateAppointmentForm({ patients, doctorId, onSuccess }: { 
  patients: Patient[]; 
  doctorId: string;
  onSuccess: () => void;
}) {
  const { showDialog } = useDialog();
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !date || !time) return;

    console.log('Creating appointment with:', { patientId, doctorId, date, time });

    const startTime = new Date(`${date}T${time}:00`).toISOString();

    try {
      await apiService.createAppointment({
        patientId,
        doctorId,
        startTime,
        notes
      });
      setPatientId('');
      setDate('');
      setTime('');
      setNotes('');
      onSuccess();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: { message?: string } } } };
      console.error('Error creating appointment:', error);
      const errorMessage = err.response?.data?.error?.message || 'Error al crear la cita';
      showDialog('Error', errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="appointment-form">
      <div className="form-group">
        <label>Paciente</label>
        <select
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          required
        >
          <option value="">Seleccionar paciente</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} - {p.email}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div className="form-group">
          <label>Hora</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          >
            <option value="">Seleccionar hora</option>
            {Array.from({ length: 9 }, (_, i) => i + 9).map(hour => (
              <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                {hour.toString().padStart(2, '0')}:00
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Notas (opcional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Notas de la cita"
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Crear Cita
        </button>
      </div>
    </form>
  );
}
