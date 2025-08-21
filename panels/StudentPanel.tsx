import React, { useState } from 'react';
import ScoreTable from '../components/ScoreTable';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import ScheduleCard from '../components/ScheduleCard';
import RulesCard from '../components/RulesCard';

const StudentWelcomeHeader: React.FC<{ name: string }> = ({ name }) => (
    <div className="bg-white p-6 rounded-lg mb-8 shadow-sm border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">¡Hola, {name}!</h2>
        <p className="mt-1 text-gray-600">Bienvenido/a a tu panel. Selecciona una sección para ver la información.</p>
    </div>
);

const SanctionsCard: React.FC<{ course: string }> = ({ course }) => {
    const { sanctions } = useData();
    const courseSanctions = sanctions.filter(s => s.course === course);

    return (
        <Card title="Sanciones del Curso">
            {courseSanctions.length === 0 ? (
                <p className="text-sm text-center text-gray-500 py-4">¡Felicitaciones! Tu curso no tiene sanciones.</p>
            ) : (
                <ul className="space-y-3">
                    {courseSanctions.map(s => (
                        <li key={s.id} className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <div className="flex justify-between items-center">
                                <p className="font-medium text-red-800">{s.reason}</p>
                                <p className="font-bold text-red-600">-{s.points} pts</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Registrado por: {s.registeredBy} - {new Date(s.timestamp).toLocaleDateString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
};

const StudentPanel: React.FC = () => {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState('scores');

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
            case 'scores':
                return <ScoreTable courseFilter={user?.course} />;
            case 'sanctions':
                return user?.course ? <SanctionsCard course={user.course} /> : null;
            case 'schedule':
                return <ScheduleCard />;
            case 'rules':
                return <RulesCard />;
            default:
                return <ScoreTable courseFilter={user?.course} />;
        }
    };
    
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {user && <StudentWelcomeHeader name={user.name.split(' ')[0]} />}
            
            <div className="mb-6 bg-white p-2 rounded-lg shadow-sm overflow-x-auto">
                <div className="flex justify-start sm:justify-center space-x-2">
                    <NavButton sectionKey="scores" label="Puntajes de mi Curso" />
                    {user?.course && <NavButton sectionKey="sanctions" label="Mis Sanciones" />}
                    <NavButton sectionKey="schedule" label="Cronograma" />
                    <NavButton sectionKey="rules" label="Reglamento" />
                </div>
            </div>

            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default StudentPanel;