export enum UserRole {
  ALUMNO = 'Alumno',
  DELEGADO = 'Delegado',
  JURADO = 'Jurado',
  DOCENTE = 'Docente',
  PRECEPTOR = 'Preceptor',
  DIRECTIVO = 'Directivo',
  VISITANTE = 'Visitante',
  PROHIBIDO = 'Prohibido',
}

export interface User {
  dni: string;
  name: string;
  role: UserRole;
  course?: string; // Optional: for students/delegates
}

export interface Score {
  id: number;
  course: string;
  competition: string;
  score: number;
  timestamp: Date;
}

export interface ScheduleItem {
  id: string;
  time: string;
  activity: string;
  location: string;
}

export interface Sanction {
  id: number;
  course: string;
  reason: string;
  points: number; // Stored as a positive number, represents a deduction
  timestamp: Date;
  registeredBy: string; // Name of the staff/admin who registered it
}

export interface SanctionCatalogItem {
  id: number;
  infraction: string;
  description: string;
  points: number;
}