import React, { useState, useEffect } from 'react';
import RoleSelection from './components/RoleSelection';
import AssistantLogin from './components/AssistantLogin';
import AssistantDashboard from './components/AssistantDashboard';
import AssistantOperation from './components/AssistantOperation';
import SupervisorView from './components/SupervisorView';
import { ApiService } from './utils/ApiService';
import { Shift } from './types';

type ViewState = 'role-selection' | 'assistant-login' | 'assistant-dashboard' | 'assistant-operation' | 'supervisor';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('role-selection');
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [isUserAuth, setIsUserAuth] = useState(false);

  useEffect(() => {
    const user = ApiService.getCurrentUser();
    if (user) {
      setIsUserAuth(true);
    }
  }, []);

  const handleRoleSelect = (role: 'assistant' | 'preview') => {
    if (role === 'assistant') {
      setView(isUserAuth ? 'assistant-dashboard' : 'assistant-login');
    } else {
      setView('supervisor');
    }
  };

  const handleLogin = () => {
    setIsUserAuth(true);
    setView('assistant-dashboard');
  };

  const handleLogout = () => {
    ApiService.logout();
    setIsUserAuth(false);
    setView('role-selection');
  };

  const handleStartShift = (shift: Shift) => {
    setActiveShift(shift);
    setView('assistant-operation');
  };

  // Basic Router
  switch (view) {
    case 'assistant-login':
      return <AssistantLogin onLogin={handleLogin} onBack={() => setView('role-selection')} />;

    case 'assistant-dashboard':
      return <AssistantDashboard onStartShift={handleStartShift} onLogout={handleLogout} />;

    case 'assistant-operation':
      return activeShift ? (
        <AssistantOperation
          initialShift={activeShift}
          onBack={() => setView('assistant-dashboard')}
        />
      ) : null;

    case 'supervisor':
      return <SupervisorView onBack={() => setView('role-selection')} />;

    default:
      return <RoleSelection onSelectRole={handleRoleSelect} />;
  }
};

export default App;