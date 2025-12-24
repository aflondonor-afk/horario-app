import { User, Shift, OperationalLog } from './types';

const STORAGE_KEYS = {
    USERS: 'horario_users',
    SHIFTS: 'horario_shifts',
    LOGS: 'horario_logs',
    SESSION: 'horario_session'
};

export const ApiService = {
    // --- AUTH ---
    getCurrentUser: (): User | null => {
        const data = localStorage.getItem(STORAGE_KEYS.SESSION);
        return data ? JSON.parse(data) : null;
    },

    login: (username: string): User => {
        const users = ApiService.getUsers();
        let user = users.find(u => u.username === username);
        if (!user) {
            user = { id: crypto.randomUUID(), username };
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...users, user]));
        }
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
        return user;
    },

    logout: () => {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
    },

    getUsers: (): User[] => {
        const data = localStorage.getItem(STORAGE_KEYS.USERS);
        return data ? JSON.parse(data) : [];
    },

    // --- SHIFTS ---
    getShifts: (userId: string): Shift[] => {
        const data = localStorage.getItem(STORAGE_KEYS.SHIFTS);
        const allShifts: Shift[] = data ? JSON.parse(data) : [];
        return allShifts.filter(s => s.userId === userId);
    },

    saveShift: (shift: Omit<Shift, 'id'>): Shift => {
        const allShifts = ApiService.getAllShifts();
        const newShift = { ...shift, id: crypto.randomUUID() };

        // Simple collision check (can be expanded)
        const hasCollision = allShifts.some(s =>
            s.block === shift.block &&
            s.floor === shift.floor &&
            s.day === shift.day &&
            ((shift.startTime >= s.startTime && shift.startTime < s.endTime) ||
                (shift.endTime > s.startTime && shift.endTime <= s.endTime))
        );

        if (hasCollision && !shift.isTemporal) {
            throw new Error('Ya existe un asistente asignado a este bloque/piso en este horario.');
        }

        localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify([...allShifts, newShift]));
        return newShift;
    },

    deleteShift: (id: string) => {
        const allShifts = ApiService.getAllShifts();
        localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(allShifts.filter(s => s.id !== id)));
    },

    getAllShifts: (): Shift[] => {
        const data = localStorage.getItem(STORAGE_KEYS.SHIFTS);
        return data ? JSON.parse(data) : [];
    },

    // --- LOGS ---
    getTodayLogs: (): OperationalLog[] => {
        const today = new Date().toISOString().split('T')[0];
        const data = localStorage.getItem(STORAGE_KEYS.LOGS);
        const allLogs: OperationalLog[] = data ? JSON.parse(data) : [];
        return allLogs.filter(l => l.date === today);
    },

    updateLog: (academicEventId: string, status: OperationalLog['status'], userId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const allLogs = ApiService.getAllLogs();
        const existingIndex = allLogs.findIndex(l => l.academicEventId === academicEventId && l.date === today);

        const newLog: OperationalLog = {
            id: existingIndex >= 0 ? allLogs[existingIndex].id : crypto.randomUUID(),
            academicEventId,
            date: today,
            status,
            updatedBy: userId,
            timestamp: Date.now()
        };

        if (existingIndex >= 0) {
            allLogs[existingIndex] = newLog;
        } else {
            allLogs.push(newLog);
        }

        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(allLogs));
        return newLog;
    },

    getAllLogs: (): OperationalLog[] => {
        const data = localStorage.getItem(STORAGE_KEYS.LOGS);
        return data ? JSON.parse(data) : [];
    }
};
