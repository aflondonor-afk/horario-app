import React from 'react';
import { ScheduleEvent, ClassroomStatus as StatusType } from '../types';
import { PIXELS_PER_MINUTE, START_HOUR } from '../constants';

interface EventCardProps {
  event: ScheduleEvent;
  status?: StatusType;
  onClick?: (eventId: string, status: StatusType) => void;
  isAssistantMode?: boolean;
}

const colorStyles = {
  primary: 'border-primary',
  indigo: 'border-indigo-500',
  pink: 'border-pink-500',
  orange: 'border-orange-500',
  teal: 'border-teal-500',
  red: 'border-red-500',
  purple: 'border-purple-500',
};

const EventCard: React.FC<EventCardProps> = ({ event, status = 'NONE', onClick, isAssistantMode = false }) => {
  const parseTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const startMinutes = parseTime(event.startTime);
  const endMinutes = parseTime(event.endTime);
  const durationMinutes = endMinutes - startMinutes;

  const startOffset = (startMinutes - (START_HOUR * 60)) * PIXELS_PER_MINUTE;
  const height = durationMinutes * PIXELS_PER_MINUTE;

  const getStatusStyles = () => {
    switch (status) {
      case 'IN_USE': return 'bg-green-500/20 border-green-500 !opacity-100';
      case 'FREE': return 'bg-red-500/20 border-red-500 !opacity-100';
      default: return 'bg-surface-dark border-white/10 opacity-40';
    }
  };

  const handleClick = () => {
    if (!isAssistantMode || !onClick) return;
    const nextStatus: StatusType = status === 'NONE' ? 'IN_USE' : status === 'IN_USE' ? 'FREE' : 'NONE';
    onClick(event.id, nextStatus);
  };

  return (
    <div
      onClick={handleClick}
      className={`absolute left-1 right-1 rounded-lg border-l-[3px] p-2.5 shadow-md transition-all flex flex-col overflow-hidden ${getStatusStyles()} ${isAssistantMode ? 'cursor-pointer active:scale-95 hover:z-30' : 'pointer-events-none'}`}
      style={{
        top: `${startOffset}px`,
        height: `${height}px`,
        zIndex: status !== 'NONE' ? 15 : 10
      }}
    >
      <div className="flex justify-between items-start mb-0.5">
        <h3 className="text-white font-bold text-[11px] leading-tight line-clamp-2 uppercase tracking-wide">{event.title}</h3>
        {status !== 'NONE' && (
          <span className={`size-2 rounded-full ${status === 'IN_USE' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
        )}
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