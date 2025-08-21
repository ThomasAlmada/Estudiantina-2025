import React, { useState } from 'react';
import SanctionsCatalogTable from '../components/SanctionsCatalogTable';
import ScheduleCard from '../components/ScheduleCard';
import RulesCard from '../components/RulesCard';

const VisitorPanel: React.FC = () => {
    const [activeSection, setActiveSection] = useState('schedule');

    const NavButton: React.FC<{ sectionKey: string; label: string }> = ({ sectionKey, label }) => (
        <button
           onClick={() => setActiveSection(sectionKey)}
           className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeSection === sectionKey ? 'bg-brand-primary text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
         >
           {label}
         </button>
     );

    const renderContent = () => {
        switch (activeSection) {
            case 'schedule':
                return <ScheduleCard />;
            case 'rules':
                return <RulesCard />;
            case 'sanctionsCatalog':
                return <SanctionsCatalogTable />;
            default:
                return <ScheduleCard />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Bienvenido/a a la Estudiantina 2024</h2>
                <p className="mt-2 text-lg text-gray-600">B.O.P. N.º 20 le da la bienvenida. Seleccione una sección para consultar la información.</p>
            </div>
            
             <div className="mb-6 bg-white p-2 rounded-lg shadow-sm">
                <div className="flex justify-center space-x-2">
                    <NavButton sectionKey="schedule" label="Cronograma" />
                    <NavButton sectionKey="rules" label="Reglamento" />
                    <NavButton sectionKey="sanctionsCatalog" label="Catálogo de Sanciones" />
                </div>
            </div>

            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default VisitorPanel;