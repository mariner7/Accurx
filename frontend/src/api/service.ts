import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type {
  AuthResponse,
  Patient,
  Doctor,
  Appointment,
  CreateAppointmentRequest,
  CreatePatientRequest,
  CreateDoctorRequest
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async register(data: { 
    email: string; 
    password: string; 
    role: string;
    name?: string;
    age?: number;
    gender?: 'MALE' | 'FEMALE';
    address?: string;
    phone?: string;
    allergies?: string;
  }): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    const response = await this.api.get<Appointment[]>('/appointments');
    return response.data;
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    const response = await this.api.get<Appointment>(`/appointments/${id}`);
    return response.data;
  }

  async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
    const response = await this.api.post<Appointment>('/appointments', data);
    return response.data;
  }

  async updateAppointment(id: string, data: { startTime: string }): Promise<Appointment> {
    const response = await this.api.put<Appointment>(`/appointments/${id}`, data);
    return response.data;
  }

  async confirmAppointment(id: string): Promise<Appointment> {
    const response = await this.api.post<Appointment>(`/appointments/${id}/confirm`, {});
    return response.data;
  }

  async cancelAppointment(id: string, actorType: string = 'PATIENT'): Promise<Appointment> {
    const response = await this.api.post<Appointment>(`/appointments/${id}/cancel`, { actorType });
    return response.data;
  }

  async addClinicalNotes(id: string, data: {
    observations: string;
    diagnosis: string | null;
    treatment: string | null;
    followUp: string | null;
  }): Promise<Appointment> {
    const response = await this.api.post<Appointment>(`/appointments/${id}/clinical-notes`, data);
    return response.data;
  }

  // Patients
  async getPatients(): Promise<Patient[]> {
    const response = await this.api.get<Patient[]>('/patients');
    return response.data;
  }

  async getPatientById(id: string): Promise<Patient> {
    const response = await this.api.get<Patient>(`/patients/${id}`);
    return response.data;
  }

  async createPatient(data: CreatePatientRequest): Promise<Patient> {
    const response = await this.api.post<Patient>('/patients', data);
    return response.data;
  }

  // Doctors
  async getDoctors(): Promise<Doctor[]> {
    const response = await this.api.get<Doctor[]>('/doctors');
    return response.data;
  }

  async getDoctorById(id: string): Promise<Doctor> {
    const response = await this.api.get<Doctor>(`/doctors/${id}`);
    return response.data;
  }

  async createDoctor(data: CreateDoctorRequest): Promise<Doctor> {
    const response = await this.api.post<Doctor>('/doctors', data);
    return response.data;
  }
}

export const apiService = new ApiService();
