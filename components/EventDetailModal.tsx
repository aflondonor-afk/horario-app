import React, { memo } from 'react';
import { ScheduleEvent, ClassroomStatus as StatusType } from '../types';

interface EventDetailModalProps {
    event: ScheduleEvent;
    status: StatusType;
    isOpen: boolean;
    onClose: () => void;
    onStatusChange?: (eventId: string, status: StatusType) => void;
    isAssistantMode?: boolean;
}

const EventDetailModal: React.FC<EventDetailModalProps> = memo(({
    event,
    status,
    isOpen,
    onClose,
    onStatusChange,
    isAssistantMode
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Content */}
            <div className="relative w-full max-w-md bg-surface-dark border border-border-green/30 rounded-t-3xl md:rounded-3xl shadow-2xl p-8 animate-in slide-in-from-bottom-full md:slide-in-from-bottom-4 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="flex flex-col gap-6">
                    <header>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`size-3 rounded-full ${status === 'IN_USE' ? 'bg-green-500' : status === 'FREE' ? 'bg-red-500' : 'bg-text-muted/30'}`}></span>
                            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
                                {status === 'IN_USE' ? 'En Uso' : status === 'FREE' ? 'Libre' : 'Sin Registro'}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-white leading-tight">{event.title}</h2>
                        <div className="flex items-center gap-2 mt-2 text-primary font-mono text-sm">
                            <span className="material-symbols-outlined text-[18px]">schedule</span>
                            {event.startTime} - {event.endTime}
                        </div>
                    </header>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-background-dark/50 rounded-2xl border border-white/5">
                            <div
                                className="size-12 rounded-full bg-cover bg-center shrink-0 border border-primary/20"
                                style={{ backgroundImage: `url("${event.instructor.avatar}")` }}
                            ></div>
                            <div>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Docente</p>
                                <p className="text-white font-bold">{event.instructor.name}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-background-dark/50 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Grupo</p>
                                <p className="text-sm font-bold text-white">{event.subtitle}</p>
                            </div>
                            <div className="p-3 bg-background-dark/50 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Aula</p>
                                <p className="text-sm font-bold text-white">{event.columnId} • P{event.floor}</p>
                            </div>
                        </div>
                    </div>

                    {isAssistantMode && onStatusChange && (
                        <div className="pt-4 space-y-3">
                            <p className="text-center text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Cambiar Estado</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => { onStatusChange(event.id, 'IN_USE'); onClose(); }}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${status === 'IN_USE' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
                                >
                                    <span className="material-symbols-outlined">check_circle</span>
                                    En Uso
                                </button>
                                <button
                                    onClick={() => { onStatusChange(event.id, 'FREE'); onClose(); }}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${status === 'FREE' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                                >
                                    <span className="material-symbols-outlined">cancel</span>
                                    Libre
                                </button>
                            </div>
                            <button
                                onClick={() => { onStatusChange(event.id, 'NONE'); onClose(); }}
                                className="w-full py-2 text-xs text-text-muted hover:text-white transition-colors"
                            >
                                Restablecer (Sin Registro)
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default EventDetailModal;
