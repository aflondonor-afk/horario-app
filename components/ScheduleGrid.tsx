import React, { useEffect, useState } from 'react';
import { START_HOUR, END_HOUR, PIXELS_PER_HOUR, PIXELS_PER_MINUTE } from '../constants';
import EventCard from './EventCard';
import { ScheduleEvent, Column } from '../types';

interface ScheduleGridProps {
  events: ScheduleEvent[];
  columns: Column[];
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ events, columns }) => {
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(0);

  useEffect(() => {
    // Get real current time
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    setCurrentTimeMinutes(minutes);
    
    // Update every minute
    const interval = setInterval(() => {
      const n = new Date();
      setCurrentTimeMinutes(n.getHours() * 60 + n.getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
  const startOffsetMinutes = START_HOUR * 60;
  const currentTimeOffset = (currentTimeMinutes - startOffsetMinutes) * PIXELS_PER_MINUTE;
  
  // Format minutes into HH:mm
  const formatTime = (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 overflow-auto bg-background-dark relative" id="calendar-scroller">
      <div className="min-w-[1000px] relative">
        
        {/* Sticky Header Row (Room Names) */}
        <div className="sticky top-0 z-40 flex bg-background-dark border-b border-border-green h-14 shadow-sm">
          {/* Top Left Corner */}
          <div className="w-20 flex-none sticky left-0 z-50 bg-background-dark border-r border-border-green flex items-center justify-center shadow-[1px_0_0_0_#326747]">
            <span className="text-xs text-text-muted font-bold">GMT-5</span>
          </div>
          
          {/* Column Headers */}
          <div className="flex flex-1">
            {columns.length > 0 ? (
              columns.map((col) => (
                <div 
                  key={col.id} 
                  className={`flex-1 min-w-[180px] border-r border-border-green/30 flex flex-col justify-center items-center px-2 ${col.isAlternate ? 'bg-surface-dark/30' : ''}`}
                >
                  <span className="text-white font-bold text-sm truncate w-full text-center">{col.title}</span>
                  <span className="text-[10px] text-text-muted truncate w-full text-center">{col.subtitle}</span>
                </div>
              ))
            ) : (
               <div className="flex-1 flex items-center justify-center text-text-muted text-sm italic">
                  No hay clases programadas para este filtro.
               </div>
            )}
          </div>
        </div>

        <div className="flex relative">
          {/* Current Time Line */}
          {currentTimeMinutes >= startOffsetMinutes && currentTimeMinutes <= END_HOUR * 60 && (
             <div 
               className="absolute w-full z-20 flex items-center pointer-events-none" 
               style={{ top: `${currentTimeOffset}px` }}
             >
              <div className="w-20 text-right pr-2 sticky left-0 z-50">
                 <span className="text-[10px] font-bold text-primary bg-background-dark px-1 rounded inline-block">
                  {formatTime(currentTimeMinutes)}
                 </span>
              </div>
              <div className="flex-1 h-[2px] bg-primary shadow-[0_0_8px_rgba(43,238,121,0.6)] relative">
                <div className="absolute -left-[3px] -top-[3px] size-2 rounded-full bg-primary"></div>
              </div>
            </div>
          )}

          {/* Time Sidebar */}
          <div className="w-20 flex-none sticky left-0 z-30 bg-background-dark border-r border-border-green text-xs font-medium text-text-muted text-right select-none shadow-[1px_0_0_0_#326747]">
            {hours.map((hour) => (
              <div key={hour} className="relative" style={{ height: `${PIXELS_PER_HOUR}px` }}>
                <span className="absolute -top-2 right-3 leading-none">
                  {hour.toString().padStart(2, '0')}:00
                </span>
                {/* 30 min marker hidden by default as per image but structure exists */}
                <span className="absolute top-[50%] -translate-y-1/2 right-3 leading-none hidden">
                  {hour.toString().padStart(2, '0')}:30
                </span>
              </div>
            ))}
             {/* Extra space at bottom */}
             <div className="h-10"></div>
          </div>

          {/* Grid Background Lines & Content */}
          <div className="flex flex-1 relative bg-background-dark">
             {/* Horizontal grid lines */}
             <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
                {hours.map((hour) => (
                  <React.Fragment key={hour}>
                    <div className="border-b border-border-green/20 w-full" style={{ height: `${PIXELS_PER_HOUR / 2}px` }}></div>
                    <div className="border-b border-border-green/20 w-full border-dashed" style={{ height: `${PIXELS_PER_HOUR / 2}px` }}></div>
                  </React.Fragment>
                ))}
             </div>

             {/* Columns with Events */}
             {columns.map((col) => (
               <div 
                  key={col.id} 
                  className={`flex-1 min-w-[180px] border-r border-border-green/30 relative z-10 ${col.isAlternate ? 'bg-surface-dark/10' : ''}`}
                >
                  {events.filter(e => e.columnId === col.id).map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
               </div>
             ))}
             {/* Empty state filler if no columns */}
             {columns.length === 0 && (
                <div className="w-full h-[800px] flex items-center justify-center text-text-muted/50 text-4xl font-bold uppercase select-none">
                   Sin Datos
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleGrid;