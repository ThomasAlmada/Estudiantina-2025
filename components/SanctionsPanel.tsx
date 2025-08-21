import React, { useState, useMemo } from 'react';
import Card from './Card';
import { COURSES, SANCTIONS_CATALOG } from '../constants';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const SanctionsPanel: React.FC = () => {
    const { user } = useAuth();
    const { sanctions, addSanction } = useData();
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
                <Card title="Registrar Nueva Sanción">
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
                        
                        <button type="submit" disabled={submitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-danger hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger disabled:bg-gray-400">
                            {submitting ? 'Registrando...' : 'Registrar Sanción'}
                        </button>

                         {success && <p className="text-sm text-center text-success bg-green-100 p-3 rounded-md">{success}</p>}
                    </form>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card title="Historial de Sanciones">
                    <div className="overflow-x-auto border rounded-lg max-h-[600px]">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Infracción</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Puntos</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sanctions.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.course}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.reason}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold text-right">-{s.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {sanctions.length === 0 && <p className="text-center p-4 text-gray-500">No hay sanciones registradas.</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SanctionsPanel;