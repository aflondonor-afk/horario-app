import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ScheduleGrid from './components/ScheduleGrid';
import { useScheduleData } from './hooks/useScheduleData';
import { Column } from './types';

const App: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState('33');
  const [selectedFloor, setSelectedFloor] = useState('1');
  const [selectedDay, setSelectedDay] = useState('LUNES');

  const { events, loading, error } = useScheduleData();

  // Filter events based on selected block, floor, and day
  const filteredEvents = useMemo(() => {
    if (loading || error) return [];

    return events.filter((event) => {
      // Robust day normalization to handle accents and casing
      // e.g. "MIÉRCOLES" in selector matches "MIERCOLES" or "MIÉRCOLES" in CSV
      const normalize = (str: string) => str.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

      const eventDay = normalize(event.day);
      const selectedDayNorm = normalize(selectedDay);

      const isBlockMatch = event.block === selectedBlock;
      const isFloorMatch = event.floor === selectedFloor;
      const isDayMatch = eventDay === selectedDayNorm;

      return isBlockMatch && isFloorMatch && isDayMatch;
    });
  }, [selectedBlock, selectedFloor, selectedDay, events, loading, error]);

  // Generate columns based on unique rooms in the filtered events
  const columns = useMemo(() => {
    const uniqueRoomIds = Array.from(new Set(filteredEvents.map(e => e.columnId))).sort();

    return uniqueRoomIds.map((roomId, index) => {
      return {
        id: roomId,
        title: roomId,
        subtitle: `Bloque ${selectedBlock} - Piso ${selectedFloor}`,
        isAlternate: index % 2 !== 0
      } as Column;
    });
  }, [filteredEvents, selectedBlock, selectedFloor]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-dark text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-text-muted">Cargando horarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-dark text-white">
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-sm text-text-muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden font-display bg-background-dark text-white">
      <Header
        selectedBlock={selectedBlock}
        setSelectedBlock={setSelectedBlock}
        selectedFloor={selectedFloor}
        setSelectedFloor={setSelectedFloor}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />
      <main className="flex-1 overflow-hidden relative flex flex-col">
        <ScheduleGrid events={filteredEvents} columns={columns} />

        {/* FAB */}
        <button
          className="fixed bottom-8 right-8 size-14 bg-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center text-background-dark hover:scale-110 active:scale-95 transition-transform z-50 group"
          aria-label="Add new class"
        >
          <span className="material-symbols-outlined text-[32px] group-hover:rotate-90 transition-transform">add</span>
        </button>
      </main>
    </div>
  );
};

export default App;