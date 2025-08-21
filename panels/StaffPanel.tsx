import React, { useState } from 'react';
import ScoreTable from '../components/ScoreTable';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import UserManagement from '../components/UserManagement';
import SanctionsPanel from '../components/SanctionsPanel';
import SanctionsCatalogTable from '../components/SanctionsCatalogTable';
import ScheduleCard from '../components/ScheduleCard';
import RulesCard from '../components/RulesCard';
import ScheduleManagement from '../components/ScheduleManagement';

const AdminWelcomeHeader: React.FC<{ name: string }> = ({ name }) => (
    <div className="bg-gradient-to-r from-brand-primary to-brand-dark text-white p-6 rounded-lg mb-8 shadow-lg">
        <h2 className="text-3xl font-bold">Panel de Administración</h2>
        <p className="mt-1 text-blue-100">Bienvenido, {name}. Desde aquí puede supervisar puntajes, cronogramas y gestionar el sistema.</p>
    </div>
);


const StaffPanel: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('scores');
    const isAdmin = user?.role === UserRole.DIRECTIVO;

    const TabButton:React.FC<{tabKey: string; label: string}> = ({ tabKey, label }) => (
        <button
           onClick={() => setActiveTab(tabKey)}
           className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === tabKey ? 'bg-brand-primary text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
         >
           {label}
         </button>
     );

     const renderContent = () => {
        switch (activeTab) {
            case 'scores':
                return <ScoreTable />;
            case 'sanctions':
                return isAdmin ? <SanctionsPanel /> : null;
            case 'sanctionsCatalog':
                return <SanctionsCatalogTable />;
            case 'schedule':
                return <ScheduleCard />;
            case 'scheduleManagement':
                return isAdmin ? <ScheduleManagement /> : null;
            case 'rules':
                 return <RulesCard />;
             case 'userManagement':
                return isAdmin ? <UserManagement /> : null;
            default:
                return <ScoreTable />;
        }
     };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {isAdmin && user && <AdminWelcomeHeader name={user.name} />}
            <div className="mb-6">
                <div className="bg-white p-2 rounded-lg shadow-sm overflow-x-auto">
                    <div className="flex justify-start sm:justify-center space-x-2">
                        <TabButton tabKey="scores" label="Puntajes" />
                        {isAdmin && <TabButton tabKey="sanctions" label="Sanciones" />}
                        <TabButton tabKey="sanctionsCatalog" label="Catálogo de Sanciones" />
                        <TabButton tabKey="schedule" label="Cronograma" />
                        {isAdmin && <TabButton tabKey="scheduleManagement" label="Gestionar Cronograma" />}
                        <TabButton tabKey="rules" label="Reglamento" />
                        {isAdmin && <TabButton tabKey="userManagement" label="Usuarios" />}
                    </div>
                </div>
            </div>
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default StaffPanel;