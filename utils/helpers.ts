import { ScheduleEvent } from '../types';

// Helper to assign a consistent color based on a string (Subject name)
export const getColorForSubject = (subject: string): ScheduleEvent['color'] => {
    const colors: ScheduleEvent['color'][] = ['primary', 'indigo', 'pink', 'orange', 'teal', 'red', 'purple'];
    let hash = 0;
    for (let i = 0; i < subject.length; i++) {
        hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

// Helper to determine floor from Room ID 
// Logic: Looks for the hundreds digit in the room number (e.g., 101 -> 1, 33-204 -> 2, A102 -> 1, T502 -> 5)
export const getFloorFromRoom = (room: string): string => {
    // 1. Try to find a pattern like digit followed by two digits (e.g. 101, 205, 403)
    // This handles A102, T502, 33-201, etc.
    const match = room.match(/(\d)(\d{2})/);
    if (match) {
        return match[1];
    }

    // 2. Fallback: just look for the first digit in the string.
    const firstDigit = room.match(/\d/);
    return firstDigit ? firstDigit[0] : '1';
};

// Helper to generate a consistent avatar placeholder
export const getAvatarUrl = (name: string) => {
    const cleanName = name ? name.split('-')[0].trim() : 'Docente'; // Handle multiple names or empty
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=random&color=fff&size=64`;
};
