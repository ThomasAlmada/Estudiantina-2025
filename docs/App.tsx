
import React from 'react';
import { useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import StudentPanel from './panels/StudentPanel';
import JuryPanel from './panels/JuryPanel';
import StaffPanel from './panels/StaffPanel';
import VisitorPanel from './panels/VisitorPanel';
import { UserRole } from './types';
import Header from './components/Header';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  const renderPanel = () => {
    if (!user) return <Login />;

    const panelContent = () => {
        switch (user.role) {
            case UserRole.ALUMNO:
            case UserRole.DELEGADO:
                return <StudentPanel />;
            case UserRole.JURADO:
                return <JuryPanel />;
            case UserRole.DOCENTE:
            case UserRole.PRECEPTOR:
            case UserRole.ADMIN:
                return <StaffPanel />;
            case UserRole.VISITANTE:
                return <VisitorPanel />;
            default:
                return <Login />;
        }
    };
    
    return (
        <div className="min-h-screen bg-light">
            <Header />
            <main>
                {panelContent()}
            </main>
        </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-secondary"></div>
      </div>
    );
  }

  return (
      <div className="App h-full">
          {renderPanel()}
      </div>
  );
};

export default App;