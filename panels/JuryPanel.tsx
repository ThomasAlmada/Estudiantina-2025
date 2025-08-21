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
    <div className="bg-white p-6 rounded-lg mb-8 shadow-sm border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Panel de Jurado</h2>
        <p className="mt-1 text-gray-600">Bienvenido/a, {name}. Seleccione una sección para continuar.</p>
    </div>
);

const ScoreForm: React.FC = () => {
    const { addScore } = useData();
    const [course, setCourse] = useState(COURSES[0]);
    const [competition, setCompetition] = useState(COMPETITIONS[0]);
    const [score, setScore] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState<Score | null>(null);

     const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const scoreValue = parseInt(score, 10);
        if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 1000) {
            alert('Por favor ingrese un puntaje válido entre 0 y 1000.');
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
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card title="Cargar Puntaje">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                    <select id="course" value={course} onChange={e => setCourse(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                        {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="competition" className="block text-sm font-medium text-gray-700 mb-1">Competencia</label>
                    <select id="competition" value={competition} onChange={e => setCompetition(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                        {COMPETITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">Puntaje (0-1000)</label>
                    <input type="number" id="score" value={score} onChange={e => setScore(e.target.value)} required min="0" max="1000" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"/>
                </div>
                <button type="submit" disabled={submitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400">
                    {submitting ? 'Guardando...' : 'Guardar Puntaje'}
                </button>
                {submitted && (
                    <div className="mt-4 p-3 text-center text-green-800 bg-green-100 rounded-lg text-sm">
                        ¡Puntaje guardado! <br/> <strong>{submitted.course} - {submitted.competition}: {submitted.score} pts</strong>
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
                              <p className="font-semibold text-gray-800">{s.course}</p>
                              <p className="text-sm text-gray-500">{s.competition}</p>
                            </div>
                            <p className="text-lg font-bold text-brand-primary">{s.score} pts</p>
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

    const selectedSanction = useMemo(() => {
        return SANCTIONS_CATALOG.find(s => s.id === parseInt(sanctionId, 10));
    }, [sanctionId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedSanction) return;

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
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card title="Registrar Sanción">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="course-sanction" className="block text-sm font-medium text-gray-700 mb-1">Curso Sancionado</label>
                    <select id="course-sanction" value={course} onChange={e => setCourse(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                        {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="sanction-type" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Infracción</label>
                    <select id="sanction-type" value={sanctionId} onChange={e => setSanctionId(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                        {SANCTIONS_CATALOG.map(s => <option key={s.id} value={s.id}>{s.infraction}</option>)}
                    </select>
                </div>
                
                {selectedSanction && (
                        <div className="p-4 bg-gray-50 rounded-lg border">
                        <p className="text-sm text-gray-600">{selectedSanction.description}</p>
                        <p className="mt-2 text-lg font-bold text-center text-red-600">-{selectedSanction.points} Puntos</p>
                    </div>
                )}
                
                <button type="submit" disabled={submitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-danger hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger disabled:bg-gray-400">
                    {submitting ? 'Registrando...' : 'Registrar Sanción'}
                </button>

                    {success && <p className="text-sm text-center text-success bg-green-100 p-3 rounded-md">{success}</p>}
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
           className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeSection === sectionKey ? 'bg-brand-primary text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
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

            <div className="mb-6 bg-white p-2 rounded-lg shadow-sm overflow-x-auto">
                <div className="flex justify-start sm:justify-center space-x-2">
                    <NavButton sectionKey="scores" label="Puntajes" />
                    <NavButton sectionKey="sanctions" label="Sanciones" />
                    <NavButton sectionKey="sanctionsCatalog" label="Catálogo de Sanciones" />
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

export default JuryPanel;