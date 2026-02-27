export interface User {
  userId: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  patientId?: string;
  doctorId?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  address: string;
  phone: string;
  email: string;
  allergies?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  licenseNumber: string;
  phone: string;
  email: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  status: {
    value: 'RESERVED' | 'CONFIRMED' | 'CANCELLED';
  };
  notes?: string;
  clinicalNotes?: {
    observations: string;
    diagnosis: string | null;
    treatment: string | null;
    followUp: string | null;
  };
  createdAt: string;
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  startTime: string;
  notes?: string;
}

export interface CreatePatientRequest {
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  address: string;
  phone: string;
  email: string;
  allergies?: string;
}

export interface CreateDoctorRequest {
  name: string;
  specialty: string;
  licenseNumber: string;
  phone: string;
  email: string;
}
