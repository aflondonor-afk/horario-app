import { useState, useEffect } from 'react';
import { ScheduleEvent } from '../types';
import { getColorForSubject, getFloorFromRoom, getAvatarUrl } from '../utils/helpers';

export const useScheduleData = () => {
    const [events, setEvents] = useState<ScheduleEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.BASE_URL}data.csv`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const text = await response.text();

                // Parse CSV logic
                const parsedEvents: ScheduleEvent[] = text.trim().split('\n').slice(1).map((line, index) => {
                    // Use comma as delimiter, but handle cases where Subject (index 5) has commas
                    // Robust CSV splitting handling quotes could be better, but assuming simple structure for now
                    // If we encounter issues with commas in fields, we'll need a regex splitter.
                    const parts = line.split(',');

                    // Basic columns that are fixed
                    const bloque = parts[0];
                    const aula = parts[1];
                    const dia = parts[2];
                    const inicio = parts[3];
                    const fin = parts[4];

                    // Last two are always Group and Teacher
                    const docente = parts[parts.length - 1];
                    const grupo = parts[parts.length - 2];

                    // Subject is everything in between index 5 and length-2
                    const materia = parts.slice(5, parts.length - 2).join(',');

                    return {
                        id: `evt-${index}`,
                        title: materia,
                        subtitle: `Grupo ${grupo}`,
                        subtitleIcon: 'group',
                        instructor: {
                            name: docente,
                            avatar: getAvatarUrl(docente)
                        },
                        columnId: aula,
                        startTime: inicio,
                        endTime: fin,
                        color: getColorForSubject(materia),
                        block: bloque,
                        day: dia,
                        floor: getFloorFromRoom(aula)
                    };
                });

                setEvents(parsedEvents);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { events, loading, error };
};
