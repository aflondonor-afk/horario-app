import React from 'react';

interface RoleSelectionProps {
    onSelectRole: (role: 'assistant' | 'preview') => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
    return (
        <div className="flex h-screen items-center justify-center bg-background-dark p-6">
            <div className="max-w-md w-full space-y-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="space-y-4">
                    <div className="inline-flex items-center justify-center size-20 bg-primary/10 rounded-2xl mb-4">
                        <span className="material-symbols-outlined text-primary text-5xl">school</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white">Horario Académico</h1>
                    <p className="text-text-muted">Gestión de aulas en tiempo real</p>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-8">
                    <button
                        onClick={() => onSelectRole('assistant')}
                        className="group relative flex flex-col items-center justify-center p-8 bg-surface-dark border border-border-green/30 rounded-2xl hover:border-primary/50 hover:bg-surface-dark/80 transition-all shadow-xl"
                    >
                        <div className="size-14 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-primary text-3xl">person</span>
                        </div>
                        <span className="text-xl font-bold text-white">Asistente</span>
                        <span className="text-sm text-text-muted mt-2">Gestionar turnos y reportar estados</span>
                    </button>

                    <button
                        onClick={() => onSelectRole('preview')}
                        className="group relative flex flex-col items-center justify-center p-8 bg-surface-dark border border-border-green/30 rounded-2xl hover:border-indigo-400/50 hover:bg-surface-dark/80 transition-all shadow-xl"
                    >
                        <div className="size-14 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-indigo-400 text-3xl">visibility</span>
                        </div>
                        <span className="text-xl font-bold text-white">Vista Previa</span>
                        <span className="text-sm text-text-muted mt-2">Consultar disponibilidad en tiempo real</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
