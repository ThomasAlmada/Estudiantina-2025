import React, { useState } from 'react';
import SanctionsCatalogTable from '../components/SanctionsCatalogTable';
import ScheduleCard from '../components/ScheduleCard';
import RulesCard from '../components/RulesCard';

const VisitorPanel: React.FC = () => {
    const [activeSection, setActiveSection] = useState('schedule');

    const NavButton: React.FC<{ sectionKey: string; label: string }> = ({ sectionKey, label }) => (
         <button
           onClick={() => setActiveSection(sectionKey)}
           className={`whitespace-nowrap py-4 px-2 sm:px-4 border-b-2 font-medium text-sm transition-colors ${
               activeSection === sectionKey
               ? 'border-primary text-primary'
               : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
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
                <h2 className="text-3xl font-extrabold text-dark">Bienvenido/a a la Estudiantina 2024</h2>
                <p className="mt-2 text-lg text-gray-600">B.O.P. N.º 20 le da la bienvenida. Seleccione una sección para consultar la información.</p>
            </div>
            
             <div className="mb-6 border-b border-gray-200">
                 <nav className="-mb-px flex justify-center space-x-2 sm:space-x-8" aria-label="Tabs">
                    <NavButton sectionKey="schedule" label="Cronograma" />
                    <NavButton sectionKey="rules" label="Reglamento" />
                    <NavButton sectionKey="sanctionsCatalog" label="Catálogo de Sanciones" />
                </nav>
            </div>

            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default VisitorPanel;