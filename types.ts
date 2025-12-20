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
  subtitle: string; // Capacity or extra info (we might not have cap, so we'll use block info)
  isAlternate?: boolean;
}