import React, { useState } from 'react';
import { ApiService } from '../utils/ApiService';

interface AssistantLoginProps {
    onLogin: () => void;
    onBack: () => void;
}

const AssistantLogin: React.FC<AssistantLoginProps> = ({ onLogin, onBack }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            ApiService.login(username.trim());
            onLogin();
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-background-dark p-6">
            <div className="max-w-sm w-full bg-surface-dark border border-border-green/30 p-8 rounded-3xl shadow-2xl relative">
                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 text-text-muted hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>

                <div className="text-center mb-8 pt-4">
                    <h2 className="text-2xl font-bold text-white">Acceso Asistente</h2>
                    <p className="text-sm text-text-muted mt-1">Ingresa tu usuario para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Usuario</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ej: jsmith"
                            className="w-full bg-background-dark border border-border-green/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-background-dark font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AssistantLogin;
