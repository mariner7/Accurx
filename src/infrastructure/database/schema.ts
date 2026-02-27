import { pool } from './connection.js';

export async function initializeDatabase(): Promise<void> {
  const createTables = `
    CREATE TABLE IF NOT EXISTS patients (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      age INTEGER NOT NULL,
      gender VARCHAR(10) NOT NULL CHECK (gender IN ('MALE', 'FEMALE')),
      address TEXT NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      allergies TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS doctors (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      specialty VARCHAR(255) NOT NULL,
      license_number VARCHAR(100) NOT NULL UNIQUE,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id UUID PRIMARY KEY,
      patient_id UUID NOT NULL REFERENCES patients(id),
      doctor_id UUID NOT NULL REFERENCES doctors(id),
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL,
      status VARCHAR(20) NOT NULL CHECK (status IN ('RESERVED', 'CONFIRMED', 'CANCELLED')),
      notes TEXT,
      clinical_observations TEXT,
      clinical_diagnosis VARCHAR(1000),
      clinical_treatment VARCHAR(1000),
      clinical_follow_up VARCHAR(1000),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('PATIENT', 'DOCTOR', 'ADMIN')),
      patient_id UUID REFERENCES patients(id),
      doctor_id UUID REFERENCES doctors(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
    CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
    CREATE INDEX IF NOT EXISTS idx_doctors_email ON doctors(email);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `;

  try {
    await pool.query(createTables);
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}
