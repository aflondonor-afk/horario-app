import React, { useState, useEffect } from 'react';
import { ApiService } from '../utils/ApiService';
import { Shift, DayName } from '../types';

interface AssistantDashboardProps {
    onStartShift: (shift: Shift) => void;
    onLogout: () => void;
}

const AssistantDashboard: React.FC<AssistantDashboardProps> = ({ onStartShift, onLogout }) => {
    const user = ApiService.getCurrentUser();
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [showAdd, setShowAdd] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [newShift, setNewShift] = useState<Partial<Shift>>({
        block: '33',
        floor: 1,
        day: 'LUNES',
        startTime: '07:00',
        endTime: '13:00',
        isTemporal: false
    });

    useEffect(() => {
        if (user) {
            setShifts(ApiService.getShifts(user.id));
        }
    }, [user]);

    const handleAddShift = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setError('');

        try {
            const shift = ApiService.saveShift({
                ...newShift as Omit<Shift, 'id'>,
                userId: user.id
            });
            setShifts([...shifts, shift]);
            setShowAdd(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar');
        }
    };

    const handleDelete = (id: string) => {
        ApiService.deleteShift(id);
        setShifts(shifts.filter(s => s.id !== id));
    };

    return (
        <div className="flex flex-col h-screen bg-background-dark text-white p-6 max-w-4xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold capitalize">Hola, {user?.username}</h1>
                    <p className="text-text-muted">Gestiona tus turnos asignados</p>
                </div>
                <button
                    onClick={onLogout}
                    className="p-2 text-text-muted hover:text-red-400 transition-colors"
                >
                    <span className="material-symbols-outlined">logout</span>
                </button>
            </header>

            <div className="flex-1 space-y-4 overflow-auto pb-24">
                {shifts.length === 0 ? (
                    <div className="text-center p-12 border-2 border-dashed border-border-green/20 rounded-3xl">
                        <span className="material-symbols-outlined text-5xl text-text-muted mb-4 opacity-20">history</span>
                        <p className="text-text-muted">No tienes turnos configurados.</p>
                    </div>
                ) : (
                    shifts.map(shift => (
                        <div
                            key={shift.id}
                            className="bg-surface-dark border border-border-green/20 p-6 rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all shadow-lg"
                        >
                            <div
                                className="flex-1 cursor-pointer"
                                onClick={() => onStartShift(shift)}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-wider">
                                        {shift.isTemporal ? 'Temporal' : 'Base'}
                                    </span>
                                    <span className="text-xs text-text-muted">{shift.day}</span>
                                </div>
                                <h3 className="text-xl font-bold">Bloque {shift.block} - Piso {shift.floor}</h3>
                                <p className="text-sm text-text-muted">{shift.startTime} - {shift.endTime}</p>
                            </div>

                            <button
                                onClick={() => handleDelete(shift.id)}
                                className="size-10 flex items-center justify-center text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* FAB ADD */}
            <button
                onClick={() => setShowAdd(true)}
                className="fixed bottom-8 right-8 lg:right-[calc(50%-28rem)] size-14 bg-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center text-background-dark hover:scale-110 active:scale-95 transition-transform z-10"
            >
                <span className="material-symbols-outlined text-[32px]">add</span>
            </button>

            {/* MODAL ADD */}
            {showAdd && (
                <div className="fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <form
                        onSubmit={handleAddShift}
                        className="bg-surface-dark border border-border-green/30 w-full max-w-md p-8 rounded-3xl shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300"
                    >
                        <h2 className="text-2xl font-bold mb-6">Nuevo Horario</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Bloque</label>
                                    <select
                                        className="w-full bg-background-dark border border-border-green/20 rounded-xl p-3 focus:outline-none text-sm"
                                        value={newShift.block}
                                        onChange={e => setNewShift({ ...newShift, block: e.target.value })}
                                    >
                                        <option value="33">Bloque 33</option>
                                        <option value="32">Bloque 32</option>
                                        <option value="03">Bloque 03</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Piso</label>
                                    <select
                                        className="w-full bg-background-dark border border-border-green/20 rounded-xl p-3 focus:outline-none text-sm"
                                        value={newShift.floor}
                                        onChange={e => setNewShift({ ...newShift, floor: parseInt(e.target.value) })}
                                    >
                                        {[1, 2, 3, 4, 5].map(p => <option key={p} value={p}>Piso {p}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Día</label>
                                <select
                                    className="w-full bg-background-dark border border-border-green/20 rounded-xl p-3 focus:outline-none text-sm"
                                    value={newShift.day}
                                    onChange={e => setNewShift({ ...newShift, day: e.target.value as DayName })}
                                >
                                    <option value="LUNES">Lunes</option>
                                    <option value="MARTES">Martes</option>
                                    <option value="MIERCOLES">Miércoles</option>
                                    <option value="JUEVES">Jueves</option>
                                    <option value="VIERNES">Viernes</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Inicio (HH:mm)</label>
                                    <input
                                        type="time"
                                        className="w-full bg-background-dark border border-border-green/20 rounded-xl p-3 focus:outline-none text-sm"
                                        value={newShift.startTime}
                                        onChange={e => setNewShift({ ...newShift, startTime: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Fin (HH:mm)</label>
                                    <input
                                        type="time"
                                        className="w-full bg-background-dark border border-border-green/20 rounded-xl p-3 focus:outline-none text-sm"
                                        value={newShift.endTime}
                                        onChange={e => setNewShift({ ...newShift, endTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newShift.isTemporal}
                                    onChange={e => setNewShift({ ...newShift, isTemporal: e.target.checked })}
                                    className="size-5 accent-primary"
                                />
                                <span className="text-sm font-medium">Es un turno temporal</span>
                            </label>
                        </div>

                        {error && <p className="text-red-400 text-xs mt-4 text-center">{error}</p>}

                        <div className="flex gap-3 mt-8">
                            <button
                                type="button"
                                onClick={() => setShowAdd(false)}
                                className="flex-1 py-3 text-sm font-bold text-text-muted hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-primary text-background-dark py-3 rounded-xl font-bold text-sm"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AssistantDashboard;
