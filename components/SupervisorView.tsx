import React, { useState, useEffect, useMemo } from 'react';
import Header from './Header';
import ScheduleGrid from './ScheduleGrid';
import { useScheduleData } from '../hooks/useScheduleData';
import { ApiService } from '../utils/ApiService';
import { OperationalLog, ClassroomStatus } from '../types';

interface SupervisorViewProps {
    onBack: () => void;
}

const SupervisorView: React.FC<SupervisorViewProps> = ({ onBack }) => {
    const [selectedBlock, setSelectedBlock] = useState('33');
    const [selectedFloor, setSelectedFloor] = useState('1');
    const [selectedDay, setSelectedDay] = useState('LUNES');
    const [logs, setLogs] = useState<OperationalLog[]>([]);

    const { events, loading, error } = useScheduleData();

    useEffect(() => {
        setLogs(ApiService.getTodayLogs());
        // In a real app, setup polling here
        const interval = setInterval(() => setLogs(ApiService.getTodayLogs()), 5000);
        return () => clearInterval(interval);
    }, []);

    const filteredEvents = useMemo(() => {
        if (loading || error) return [];
        return events.filter((event) => {
            const normalize = (str: string) => str.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            return event.block === selectedBlock &&
                event.floor === selectedFloor &&
                normalize(event.day) === normalize(selectedDay);
        });
    }, [selectedBlock, selectedFloor, selectedDay, events, loading, error]);

    const columns = useMemo(() => {
        const uniqueRoomIds = Array.from(new Set(filteredEvents.map(e => e.columnId))).sort();
        return uniqueRoomIds.map((roomId, index) => ({
            id: roomId,
            title: roomId,
            subtitle: `Bloque ${selectedBlock} - Piso ${selectedFloor}`,
            isAlternate: index % 2 !== 0
        }));
    }, [filteredEvents, selectedBlock, selectedFloor]);

    const eventStatuses = useMemo(() => {
        const map: Record<string, ClassroomStatus> = {};
        logs.forEach(l => {
            map[l.academicEventId] = l.status;
        });
        return map;
    }, [logs]);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background-dark text-white">
            <div className="bg-surface-dark border-b border-border-green/20 p-4 flex items-center gap-4">
                <button onClick={onBack} className="text-text-muted hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                    <h1 className="font-bold">Vista Supervisión</h1>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Tiempo Real • Solo Lectura</p>
                </div>
            </div>

            <Header
                selectedBlock={selectedBlock}
                setSelectedBlock={setSelectedBlock}
                selectedFloor={selectedFloor}
                setSelectedFloor={setSelectedFloor}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
            />

            <main className="flex-1 overflow-hidden relative flex flex-col">
                <ScheduleGrid
                    events={filteredEvents}
                    columns={columns}
                    eventStatuses={eventStatuses}
                    isAssistantMode={false}
                />
            </main>
        </div>
    );
};

export default SupervisorView;
