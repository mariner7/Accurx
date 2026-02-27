import { pool } from '../database/connection.js';
import { Patient, Gender } from '../../contexts/patient/domain/entities/Patient.js';
import { PatientId } from '../../contexts/patient/domain/entities/PatientId.js';

export class PostgresPatientRepository {
  async save(patient: Patient): Promise<void> {
    const query = `
      INSERT INTO patients (id, name, age, gender, address, phone, email, allergies, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        age = EXCLUDED.age,
        gender = EXCLUDED.gender,
        address = EXCLUDED.address,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        allergies = EXCLUDED.allergies,
        updated_at = EXCLUDED.updated_at
    `;

    const values = [
      patient.id.value,
      patient.name,
      patient.age,
      patient.gender,
      patient.address,
      patient.phone,
      patient.email,
      patient.allergies,
      new Date(),
      new Date()
    ];

    await pool.query(query, values);
  }

  async findById(id: string): Promise<Patient | null> {
    const query = 'SELECT * FROM patients WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToPatient(result.rows[0]);
  }

  async findAll(): Promise<Patient[]> {
    const query = 'SELECT * FROM patients ORDER BY name';
    const result = await pool.query(query);

    return result.rows.map(row => this.mapToPatient(row));
  }

  private mapToPatient(row: any): Patient {
    return new Patient({
      id: new PatientId(row.id),
      name: row.name,
      age: row.age,
      gender: row.gender as Gender,
      address: row.address,
      phone: row.phone,
      email: row.email,
      allergies: row.allergies
    });
  }
}
