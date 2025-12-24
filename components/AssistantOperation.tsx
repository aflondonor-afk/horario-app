import React, { useState, useMemo, useEffect } from 'react';
import Header from './Header';
import ScheduleGrid from './ScheduleGrid';
import { useScheduleData } from '../hooks/useScheduleData';
import { useOperationalReminders } from '../hooks/useOperationalReminders';
import { Shift, OperationalLog, ClassroomStatus as StatusType } from '../types';
import { ApiService } from '../utils/ApiService';

interface AssistantOperationProps {
    initialShift: Shift;
    onBack: () => void;
}

const AssistantOperation: React.FC<AssistantOperationProps> = ({ initialShift, onBack }) => {
    const user = ApiService.getCurrentUser();
    const [activeShift, setActiveShift] = useState<Shift>(initialShift);
    const [allMyShifts, setAllMyShifts] = useState<Shift[]>([]);
    const [logs, setLogs] = useState<OperationalLog[]>([]);

    const { events, loading, error } = useScheduleData();

    useEffect(() => {
        if (user) {
            setAllMyShifts(ApiService.getShifts(user.id));
            setLogs(ApiService.getTodayLogs());
        }
    }, [user]);

    // Handle status update
    const handleStatusUpdate = (eventId: string, status: StatusType) => {
        if (!user) return;
        const newLog = ApiService.updateLog(eventId, status, user.id);
        setLogs(prev => {
            const idx = prev.findIndex(l => l.academicEventId === eventId);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = newLog;
                return next;
            }
            return [...prev, newLog];
        });
    };

    // Filter events based on active shift context
    const filteredEvents = useMemo(() => {
        if (loading || error) return [];
        return events.filter(e => {
            const normalize = (str: string) => str.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            return e.block === activeShift.block &&
                e.floor === activeShift.floor.toString() &&
                normalize(e.day) === normalize(activeShift.day);
        });
    }, [events, activeShift, loading, error]);

    const columns = useMemo(() => {
        const uniqueRoomIds = Array.from(new Set(filteredEvents.map(e => e.columnId))).sort();
        return uniqueRoomIds.map((roomId, index) => ({
            id: roomId,
            title: roomId,
            subtitle: `Bloque ${activeShift.block} - Piso ${activeShift.floor}`,
            isAlternate: index % 2 !== 0
        }));
    }, [filteredEvents, activeShift]);

    // Map logs to events for easy access in children
    const eventStatuses = useMemo(() => {
        const map: Record<string, StatusType> = {};
        logs.forEach(l => {
            map[l.academicEventId] = l.status;
        });
        return map;
    }, [logs]);

    // Handle auto-reminders
    useOperationalReminders(filteredEvents, eventStatuses);

    if (loading) return <div className="p-8 text-center text-text-muted">Iniciando operación...</div>;

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background-dark text-white">
            {/* Operation Nav */}
            <div className="bg-surface-dark border-b border-border-green/20 px-4 pt-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center gap-2 text-text-muted hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="font-bold text-sm">Dashboard</span>
                    </button>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-1">Operando en</p>
                        <p className="font-bold text-sm">Bloque {activeShift.block} • {activeShift.day}</p>
                    </div>
                </div>

                {/* Shift Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {allMyShifts
                        .filter(s => s.day === activeShift.day)
                        .map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveShift(s)}
                                className={`flex-none px-4 py-2 rounded-t-xl text-xs font-bold transition-all border-b-2 ${activeShift.id === s.id
                                    ? 'bg-primary/10 text-primary border-primary'
                                    : 'text-text-muted border-transparent hover:bg-white/5'
                                    }`}
                            >
                                Piso {s.floor} {s.isTemporal && '(Temp)'}
                            </button>
                        ))}
                </div>
            </div>

            <main className="flex-1 overflow-hidden relative flex flex-col">
                <ScheduleGrid
                    events={filteredEvents}
                    columns={columns}
                    eventStatuses={eventStatuses}
                    onEventClick={handleStatusUpdate}
                    isAssistantMode={true}
                />
            </main>
        </div>
    );
};

export default AssistantOperation;
