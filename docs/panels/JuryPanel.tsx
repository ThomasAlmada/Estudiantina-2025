import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { COURSES, COMPETITIONS, SANCTIONS_CATALOG } from '../constants';
import Card from '../components/Card';
import { Score, Sanction } from '../types';
import { useAuth } from '../context/AuthContext';
import SanctionsCatalogTable from '../components/SanctionsCatalogTable';
import ScheduleCard from '../components/ScheduleCard';
import RulesCard from '../components/RulesCard';


const JuryWelcomeHeader: React.FC<{ name: string }> = ({ name }) => (
    <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6 rounded-lg mb-8 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Panel de Jurado</h2>
        <p className="mt-1 text-slate-300">Bienvenido/a, {name}. Utilice las pestañas para gestionar el evento.</p>
    </div>
);

const ScoreForm: React.FC = () => {
    const { addScore } = useData();
    const [course, setCourse] = useState(COURSES[0]);
    const [competition, setCompetition] = useState(COMPETITIONS[0]);
    const [score, setScore] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState<Score | null>(null);
    const [error, setError] = useState<string | null>(null);


     const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const scoreValue = parseInt(score, 10);
        if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 1000) {
            setError('Por favor ingrese un puntaje válido entre 0 y 1000.');
            return;
        }
        setSubmitting(true);
        try {
            const newScore = { course, competition, score: scoreValue };
            await addScore(newScore);
            setSubmitted({ ...newScore, id: Date.now(), timestamp: new Date() });
            setScore('');
            setTimeout(() => setSubmitted(null), 5000);
        } catch (error) {
            console.error("Failed to add score", error);
            setError('Ocurrió un error al guardar el puntaje.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card title="Cargar Puntaje">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                    <select id="course" value={course} onChange={e => setCourse(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                        {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="competition" className="block text-sm font-medium text-gray-700 mb-1">Competencia</label>
                    <select id="competition" value={competition} onChange={e => setCompetition(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                        {COMPETITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">Puntaje (0-1000)</label>
                    <input type="number" id="score" value={score} onChange={e => setScore(e.target.value)} required min="0" max="1000" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>

                {error && <p className="text-sm text-center text-danger bg-red-100 p-3 rounded-md">{error}</p>}
                
                <button type="submit" disabled={submitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400">
                    {submitting ? 'Guardando...' : 'Guardar Puntaje'}
                </button>
                {submitted && (
                    <div className="mt-4 p-3 flex items-center justify-center space-x-2 text-green-800 bg-green-100 rounded-lg text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>¡Puntaje guardado! <strong>{submitted.course} - {submitted.competition}: {submitted.score} pts</strong></span>
                    </div>
                )}
            </form>
        </Card>
    );
}

const RecentScores: React.FC = () => {
    const { scores } = useData();
    const recentScores = scores.slice().sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);

    return (
         <Card title="Últimas Cargas de Puntajes">
             <div className="space-y-3">
                {recentScores.length > 0 ? (
                    recentScores.map(s => (
                         <div key={s.id} className="bg-gray-50 p-3 rounded-md border flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-dark">{s.course}</p>
                              <p className="text-sm text-gray-500">{s.competition}</p>
                            </div>
                            <p className="text-lg font-bold text-primary">{s.score} pts</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-center text-gray-500 py-4">Aún no se han cargado puntajes.</p>
                )}
            </div>
        </Card>
    );
}

const SanctionForm: React.FC = () => {
    const { user } = useAuth();
    const { addSanction } = useData();
    const [course, setCourse] = useState(COURSES[0]);
    const [sanctionId, setSanctionId] = useState(SANCTIONS_CATALOG[0].id.toString());
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);


    const selectedSanction = useMemo(() => {
        return SANCTIONS_CATALOG.find(s => s.id === parseInt(sanctionId, 10));
    }, [sanctionId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedSanction) return;
        
        setError(null);
        setSubmitting(true);
        setSuccess(null);
        try {
            await addSanction({
                course,
                reason: selectedSanction.infraction,
                points: selectedSanction.points,
                registeredBy: user.name,
            });
            setSuccess(`Sanción de ${selectedSanction.points} pts a ${course} registrada.`);
            setTimeout(() => setSuccess(null), 5000);
        } catch (err) {
            console.error("Failed to add sanction", err);
            setError("Ocurrió un error al registrar la sanción.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card title="Registrar Sanción">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="course-sanction" className="block text-sm font-medium text-gray-700 mb-1">Curso Sancionado</label>
                    <select id="course-sanction" value={course} onChange={e => setCourse(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                        {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="sanction-type" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Infracción</label>
                    <select id="sanction-type" value={sanctionId} onChange={e => setSanctionId(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                        {SANCTIONS_CATALOG.map(s => <option key={s.id} value={s.id}>{s.infraction}</option>)}
                    </select>
                </div>
                
                {selectedSanction && (
                        <div className="p-4 bg-gray-50 rounded-lg border">
                        <p className="text-sm text-gray-600">{selectedSanction.description}</p>
                        <p className="mt-2 text-lg font-bold text-center text-red-600">-{selectedSanction.points} Puntos</p>
                    </div>
                )}
                
                {error && <p className="text-sm text-center text-danger bg-red-100 p-3 rounded-md">{error}</p>}
                
                <button type="submit" disabled={submitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-danger hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger disabled:bg-gray-400">
                    {submitting ? 'Registrando...' : 'Registrar Sanción'}
                </button>

                {success && (
                    <div className="mt-4 p-3 flex items-center justify-center space-x-2 text-green-800 bg-green-100 rounded-lg text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{success}</span>
                    </div>
                )}
            </form>
        </Card>
    );
};

const RecentSanctions: React.FC = () => {
    const { sanctions } = useData();
    const recentSanctions = sanctions.slice(0, 10);

    return (
        <Card title="Últimas Sanciones Registradas">
            <div className="space-y-3">
                {recentSanctions.length > 0 ? (
                    recentSanctions.map(s => (
                        <div key={s.id} className="bg-red-50 p-3 rounded-md border border-red-200 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-red-800">{s.course}</p>
                                <p className="text-sm text-gray-600">{s.reason}</p>
                            </div>
                            <p className="text-lg font-bold text-danger">-{s.points} pts</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-center text-gray-500 py-4">No hay sanciones registradas.</p>
                )}
            </div>
        </Card>
    );
};


const JuryPanel: React.FC = () => {
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
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <ScoreForm />
                        <RecentScores />
                    </div>
                );
            case 'sanctions':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <SanctionForm />
                        <RecentSanctions />
                    </div>
                );
            case 'sanctionsCatalog':
                return <SanctionsCatalogTable />;
            case 'schedule':
                return <ScheduleCard />;
            case 'rules':
                return <RulesCard />;
            default:
                return null;
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {user && <JuryWelcomeHeader name={user.name} />}

            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-2 sm:space-x-6 overflow-x-auto" aria-label="Tabs">
                    <NavButton sectionKey="scores" label="Puntajes" />
                    <NavButton sectionKey="sanctions" label="Sanciones" />
                    <NavButton sectionKey="sanctionsCatalog" label="Catálogo" />
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

export default JuryPanel;