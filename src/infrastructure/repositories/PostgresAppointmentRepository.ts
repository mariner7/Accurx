import { pool } from '../database/connection.js';
import { Appointment } from '../../contexts/scheduling/domain/entities/Appointment.js';
import { TimeSlot } from '../../contexts/scheduling/domain/value-objects/TimeSlot.js';
import { PatientId } from '../../contexts/patient/domain/entities/PatientId.js';
import { DoctorId } from '../../contexts/doctor/domain/entities/DoctorId.js';
import { AppointmentStatusEnum } from '../../contexts/scheduling/domain/value-objects/AppointmentStatus.js';

export class PostgresAppointmentRepository {
  async save(appointment: Appointment): Promise<void> {
    const clinicalNotes = appointment.clinicalNotes;
    
    const query = `
      INSERT INTO appointments (id, patient_id, doctor_id, start_time, end_time, status, notes, clinical_observations, clinical_diagnosis, clinical_treatment, clinical_follow_up, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO UPDATE SET
        patient_id = EXCLUDED.patient_id,
        doctor_id = EXCLUDED.doctor_id,
        start_time = EXCLUDED.start_time,
        end_time = EXCLUDED.end_time,
        status = EXCLUDED.status,
        notes = EXCLUDED.notes,
        clinical_observations = EXCLUDED.clinical_observations,
        clinical_diagnosis = EXCLUDED.clinical_diagnosis,
        clinical_treatment = EXCLUDED.clinical_treatment,
        clinical_follow_up = EXCLUDED.clinical_follow_up,
        updated_at = EXCLUDED.updated_at
    `;

    const values = [
      appointment.id,
      appointment.patientId.value,
      appointment.doctorId.value,
      appointment.timeSlot.startTime,
      appointment.timeSlot.endTime,
      appointment.status.value,
      appointment.notes,
      clinicalNotes?.observations || null,
      clinicalNotes?.diagnosis || null,
      clinicalNotes?.treatment || null,
      clinicalNotes?.followUp || null,
      appointment.createdAt,
      appointment.updatedAt
    ];

    await pool.query(query, values);
  }

  async findById(id: string): Promise<Appointment | null> {
    const query = 'SELECT * FROM appointments WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToAppointment(result.rows[0]);
  }

  async findByPatientId(patientId: string): Promise<Appointment[]> {
    const query = 'SELECT * FROM appointments WHERE patient_id = $1 ORDER BY start_time';
    const result = await pool.query(query, [patientId]);

    return result.rows.map(row => this.mapToAppointment(row));
  }

  async findByDoctorId(doctorId: string): Promise<Appointment[]> {
    const query = 'SELECT * FROM appointments WHERE doctor_id = $1 ORDER BY start_time';
    const result = await pool.query(query, [doctorId]);

    return result.rows.map(row => this.mapToAppointment(row));
  }

  async findByDoctorIdAndTimeRange(doctorId: string, startTime: Date, endTime: Date): Promise<Appointment[]> {
    const query = `
      SELECT * FROM appointments 
      WHERE doctor_id = $1 
        AND start_time < $3
        AND end_time > $2
        AND status != 'CANCELLED'
    `;
    const result = await pool.query(query, [doctorId, startTime, endTime]);

    return result.rows.map(row => this.mapToAppointment(row));
  }

  async findAll(): Promise<Appointment[]> {
    const query = 'SELECT * FROM appointments ORDER BY start_time';
    const result = await pool.query(query);

    return result.rows.map(row => this.mapToAppointment(row));
  }

  private mapToAppointment(row: any): Appointment {
    const clinicalNotes = row.clinical_observations ? {
      observations: row.clinical_observations,
      diagnosis: row.clinical_diagnosis,
      treatment: row.clinical_treatment,
      followUp: row.clinical_follow_up
    } : undefined;

    const status = row.status as AppointmentStatusEnum;

    const appointment = new Appointment({
      id: row.id,
      patientId: new PatientId(row.patient_id),
      doctorId: new DoctorId(row.doctor_id),
      timeSlot: new TimeSlot(new Date(row.start_time), true),
      notes: row.notes,
      clinicalNotes,
      status
    });

    return appointment;
  }
}
