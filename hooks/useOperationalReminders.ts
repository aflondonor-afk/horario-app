import { useEffect } from 'react';
import { ScheduleEvent, ClassroomStatus } from '../types';

export const useOperationalReminders = (
    events: ScheduleEvent[],
    statuses: Record<string, ClassroomStatus>
) => {
    useEffect(() => {
        const checkRegistrations = () => {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();

            events.forEach(event => {
                const [startH, startM] = event.startTime.split(':').map(Number);
                const startTotal = startH * 60 + startM;
                const diff = currentMinutes - startTotal;

                // If class started 15-20 mins ago and has no status
                if (diff >= 15 && diff <= 25 && (!statuses[event.id] || statuses[event.id] === 'NONE')) {
                    const message = `Registro pendiente: Aula ${event.columnId} (${event.title})`;

                    if (Notification.permission === 'granted') {
                        new Notification(message);
                    } else {
                        // Fallback for demo if no permission
                        console.warn('REMINDER:', message);
                    }
                }
            });
        };

        const interval = setInterval(checkRegistrations, 60000); // Check every minute

        // Request permission on mount
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => clearInterval(interval);
    }, [events, statuses]);
};
