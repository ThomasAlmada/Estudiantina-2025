import React, { useState } from 'react';
import ScoreTable from '../components/ScoreTable';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import ScheduleCard from '../components/ScheduleCard';
import RulesCard from '../components/RulesCard';

const StudentWelcomeHeader: React.FC<{ name: string }> = ({ name }) => (
    <div className="bg-gradient-to-r from-primary to-blue-700 text-white p-6 rounded-lg mb-8 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold">¡Hola, {name}!</h2>
        <p className="mt-1 text-blue-100">Bienvenido/a a tu panel. Revisa tus puntajes, el cronograma y más.</p>
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
            
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-2 sm:space-x-6 overflow-x-auto" aria-label="Tabs">
                    <NavButton sectionKey="scores" label="Puntajes de mi Curso" />
                    {user?.course && <NavButton sectionKey="sanctions" label="Mis Sanciones" />}
                    <NavButton sectionKey="schedule" label="Cronograma" />
                    <NavButton sectionKey="rules" label="Reglamento" />
                </nav>
            </div>

            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default StudentPanel;