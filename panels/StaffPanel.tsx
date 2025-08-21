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
    <div className="bg-gradient-to-r from-gray-800 to-dark text-white p-6 rounded-lg mb-8 shadow-lg">
        <h2 className="text-3xl font-bold">Panel de Administración</h2>
        <p className="mt-1 text-gray-300">Bienvenido, {name}. Desde aquí puede supervisar puntajes, cronogramas y gestionar el sistema.</p>
    </div>
);


const StaffPanel: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('scores');
    const isAdmin = user?.role === UserRole.ADMIN;

    const TabButton:React.FC<{tabKey: string; label: string}> = ({ tabKey, label }) => (
        <button
           onClick={() => setActiveTab(tabKey)}
           className={`whitespace-nowrap py-4 px-2 sm:px-4 border-b-2 font-medium text-sm transition-colors ${
               activeTab === tabKey
               ? 'border-primary text-primary'
               : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
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
                <div className="border-b border-gray-200">
                     <nav className="-mb-px flex space-x-2 sm:space-x-6 overflow-x-auto" aria-label="Tabs">
                        <TabButton tabKey="scores" label="Puntajes" />
                        {isAdmin && <TabButton tabKey="sanctions" label="Sanciones" />}
                        <TabButton tabKey="sanctionsCatalog" label="Catálogo" />
                        <TabButton tabKey="schedule" label="Cronograma" />
                        {isAdmin && <TabButton tabKey="scheduleManagement" label="Gestionar Cronograma" />}
                        <TabButton tabKey="rules" label="Reglamento" />
                        {isAdmin && <TabButton tabKey="userManagement" label="Usuarios" />}
                    </nav>
                </div>
            </div>
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default StaffPanel;