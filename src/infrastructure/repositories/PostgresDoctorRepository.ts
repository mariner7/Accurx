import { pool } from '../database/connection.js';
import { Doctor } from '../../contexts/doctor/domain/entities/Doctor.js';
import { DoctorId } from '../../contexts/doctor/domain/entities/DoctorId.js';

export class PostgresDoctorRepository {
  async save(doctor: Doctor): Promise<void> {
    const query = `
      INSERT INTO doctors (id, name, specialty, license_number, phone, email, active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        specialty = EXCLUDED.specialty,
        license_number = EXCLUDED.license_number,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        active = EXCLUDED.active,
        updated_at = EXCLUDED.updated_at
    `;

    const values = [
      doctor.id.value,
      doctor.name,
      doctor.specialty,
      doctor.licenseNumber,
      doctor.phone,
      doctor.email,
      true,
      new Date(),
      new Date()
    ];

    await pool.query(query, values);
  }

  async findById(id: string): Promise<Doctor | null> {
    const query = 'SELECT * FROM doctors WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToDoctor(result.rows[0]);
  }

  async findAll(): Promise<Doctor[]> {
    const query = 'SELECT * FROM doctors WHERE active = true ORDER BY name';
    const result = await pool.query(query);

    return result.rows.map(row => this.mapToDoctor(row));
  }

  private mapToDoctor(row: any): Doctor {
    return new Doctor({
      id: new DoctorId(row.id),
      name: row.name,
      specialty: row.specialty,
      licenseNumber: row.license_number,
      phone: row.phone,
      email: row.email
    });
  }
}
