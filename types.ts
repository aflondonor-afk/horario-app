export interface Instructor {
  name: string;
  avatar: string; // We will generate a placeholder avatar
}

export interface ScheduleEvent {
  id: string;
  title: string; // ASIGNATURA
  subtitle: string; // GRUPO
  subtitleIcon: string;
  instructor: Instructor; // DOCENTE
  columnId: string; // AULA
  startTime: string; // HORA_INICIO
  endTime: string;   // HORA_FINAL
  color: 'primary' | 'indigo' | 'pink' | 'orange' | 'teal' | 'red' | 'purple';
  
  // Fields for filtering
  block: string; // BLOQUE
  day: string;   // DIA
  floor: string; // Derived from AULA
}

export interface Column {
  id: string; // AULA
  title: string; // AULA name
  subtitle: string; // Capacity or extra info
  isAlternate?: boolean;
}

// Phase 2: Operational Models
export interface User {
  id: string;
  username: string;
  password?: string; // Only for local auth simulation
}

export type DayName = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';

export interface Shift {
  id: string;
  userId: string;
  block: string;
  floor: number;
  day: DayName;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  isTemporal: boolean;
}

export type ClassroomStatus = 'IN_USE' | 'FREE' | 'NONE';

export interface OperationalLog {
  id: string;
  academicEventId: string;
  date: string; // YYYY-MM-DD
  status: ClassroomStatus;
  updatedBy: string; // User ID
  timestamp: number;
}