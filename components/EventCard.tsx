import React from 'react';
import { ScheduleEvent } from '../types';
import { PIXELS_PER_MINUTE, START_HOUR } from '../constants';

interface EventCardProps {
  event: ScheduleEvent;
}

const colorStyles = {
  primary: 'border-primary bg-surface-dark hover:bg-[#1a3d2e]',
  indigo: 'border-indigo-500 bg-surface-dark hover:bg-[#1e1b4b]',
  pink: 'border-pink-500 bg-surface-dark hover:bg-[#500724]',
  orange: 'border-orange-500 bg-surface-dark hover:bg-[#431407]',
  teal: 'border-teal-500 bg-surface-dark hover:bg-[#042f2e]',
  red: 'border-red-500 bg-surface-dark hover:bg-[#450a0a]',
  purple: 'border-purple-500 bg-surface-dark hover:bg-[#3b0764]',
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const parseTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const startMinutes = parseTime(event.startTime);
  const endMinutes = parseTime(event.endTime);
  const durationMinutes = endMinutes - startMinutes;
  
  // Calculate relative position based on start hour of the grid
  const startOffset = (startMinutes - (START_HOUR * 60)) * PIXELS_PER_MINUTE;
  const height = durationMinutes * PIXELS_PER_MINUTE;

  return (
    <div
      className={`absolute left-1 right-1 rounded-lg border-l-[3px] ${colorStyles[event.color]} p-2.5 shadow-md hover:shadow-lg hover:z-20 transition-all cursor-pointer group flex flex-col overflow-hidden`}
      style={{
        top: `${startOffset}px`,
        height: `${height}px`,
        zIndex: 10
      }}
    >
      <div className="flex justify-between items-start mb-0.5">
        <h3 className="text-white font-bold text-[11px] leading-tight line-clamp-2 uppercase tracking-wide">{event.title}</h3>
      </div>
      
      <div className="flex items-center gap-1 text-text-muted text-[10px] mb-1">
        <span className="font-mono bg-white/5 px-1 rounded text-[9px]">{event.startTime} - {event.endTime}</span>
      </div>

      <div className="flex items-center gap-1 text-text-muted text-[10px] mb-auto">
        <span className="material-symbols-outlined text-[12px]">group</span>
        <span className="truncate">{event.subtitle}</span>
      </div>

      <div className="flex items-center gap-1.5 mt-1 pt-1 border-t border-white/5">
        <div 
          className="size-4 rounded-full bg-cover bg-center shrink-0 opacity-80" 
          style={{ backgroundImage: `url("${event.instructor.avatar}")` }}
        ></div>
        <span className="text-[9px] text-white/70 line-clamp-1 uppercase tracking-wider">{event.instructor.name}</span>
      </div>
    </div>
  );
};

export default EventCard;