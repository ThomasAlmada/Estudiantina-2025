import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { COMPETITIONS_BY_DAY, COMPETITIONS, COURSES } from '../constants';
import Card from './Card';

interface ScoreTableProps {
  courseFilter?: string;
}

const ScoreTable: React.FC<ScoreTableProps> = ({ courseFilter }) => {
    const { scores, sanctions } = useData();

    // Memoized calculation for the general podium
    const globalScores = useMemo(() => {
        const courseData: Record<string, { score: number, sanctions: number }> = {};
        
        COURSES.forEach(course => {
            courseData[course] = { score: 0, sanctions: 0 };
        });

        scores.forEach(score => {
            if (courseData[score.course]) {
                courseData[score.course].score += score.score;
            }
        });

        sanctions.forEach(sanction => {
            if (courseData[sanction.course]) {
                courseData[sanction.course].sanctions += sanction.points;
            }
        });

        return Object.entries(courseData)
            .map(([course, totals]) => ({
                course,
                totalScore: totals.score,
                totalSanctions: totals.sanctions,
                finalTotal: totals.score - totals.sanctions,
            }))
            .sort((a, b) => b.finalTotal - a.finalTotal);
    }, [scores, sanctions]);

    // Student-specific view: Personalized Planilla
    if (courseFilter) {
        const courseScores = useMemo(() => scores.filter(s => s.course === courseFilter), [scores, courseFilter]);
        const courseSanctions = useMemo(() => sanctions.filter(s => s.course === courseFilter), [sanctions, courseFilter]);
        const totalScore = useMemo(() => courseScores.reduce((sum, s) => sum + s.score, 0), [courseScores]);
        const totalSanctions = useMemo(() => courseSanctions.reduce((sum, s) => sum + s.points, 0), [courseSanctions]);
        const finalTotal = totalScore - totalSanctions;
        const scoresMap = useMemo(() => {
            const map = new Map<string, number>();
            courseScores.forEach(s => map.set(s.competition, s.score));
            return map;
        }, [courseScores]);

        return (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Planilla de Puntos: {courseFilter}</h2>
                {COMPETITIONS_BY_DAY.map(({ day, competitions }) => (
                    <Card key={day} title={day}>
                        <ul className="divide-y divide-gray-200">
                            {competitions.map(comp => (
                                <li key={comp} className="py-3 flex justify-between items-center">
                                    <span className="text-sm text-gray-600 flex-1 pr-4">{comp}</span>
                                    <span className="text-sm font-bold text-brand-primary bg-blue-50 px-2 py-1 rounded">{scoresMap.get(comp) ?? '-'}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                ))}
                 <Card title="Resumen Final">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Total Puntos Obtenidos</span>
                            <span className="font-semibold text-gray-800">{totalScore} pts</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Total Puntos por Sanciones</span>
                            <span className="font-semibold text-danger">-{totalSanctions} pts</span>
                        </div>
                        <hr className="my-2"/>
                        <div className="flex justify-between items-center text-base">
                            <span className="font-bold text-gray-800">Puntaje Final Neto</span>
                            <span className="font-extrabold text-brand-primary text-lg">{finalTotal} pts</span>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    const PodiumItem: React.FC<{rank: number; course: string; finalTotal: number; totalScore: number; totalSanctions: number;}> = ({rank, course, finalTotal, totalScore, totalSanctions}) => {
        const styles: {[key: number]: {bg: string, text: string, ring: string, icon: string}} = {
            1: { bg: 'bg-amber-400', text: 'text-amber-900', ring: 'ring-amber-500', icon: '🥇' },
            2: { bg: 'bg-slate-300', text: 'text-slate-800', ring: 'ring-slate-400', icon: '🥈' },
            3: { bg: 'bg-yellow-600', text: 'text-yellow-100', ring: 'ring-yellow-700', icon: '🥉' }
        };
        const style = styles[rank] || { bg: 'bg-gray-100', text: 'text-gray-800', ring: 'ring-gray-200', icon: '' };
        
        return (
             <div className={`p-4 rounded-lg text-center shadow-lg ring-2 flex flex-col justify-between h-full ${style.ring} ${style.bg}`}>
                <div>
                    <div className="text-4xl">{style.icon}</div>
                    <div className={`mt-2 text-xl font-bold ${style.text}`}>{course}</div>
                </div>
                <div>
                    <div className={`text-3xl font-bold ${style.text}`}>{finalTotal} pts</div>
                    <div className={`text-xs ${style.text} opacity-80 mt-1`}>
                        ({totalScore} pts - {totalSanctions} sanción)
                    </div>
                </div>
             </div>
        );
    }

    const scoresByCourseAndCompetition = useMemo(() => {
        const map = new Map<string, Map<string, number>>();
        scores.forEach(score => {
            if (!map.has(score.course)) {
                map.set(score.course, new Map<string, number>());
            }
            map.get(score.course)!.set(score.competition, score.score);
        });
        return map;
    }, [scores]);


    // General view: Podium + General Planilla
    return (
        <div className="space-y-8">
            <Card title="Podio General">
                {scores.length === 0 && sanctions.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Aún no hay puntajes ni sanciones cargados.</p>
                        <p className="text-gray-400 text-sm">¡La competencia está por comenzar!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {globalScores.slice(0, 3).map((item, index) => (
                            <PodiumItem key={item.course} rank={index+1} {...item} />
                        ))}
                    </div>
                )}
            </Card>

            <Card title="Planilla Oficial de Puntos">
                 <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider z-10 border-r">Curso</th>
                                {COMPETITIONS_BY_DAY.map(({ day, competitions }) => (
                                    <th key={day} colSpan={competitions.length} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-r">
                                        {day}
                                    </th>
                                ))}
                            </tr>
                            <tr>
                                <th scope="col" className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider z-10 border-r"></th>
                                {COMPETITIONS.map(comp => (
                                    <th key={comp} scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l" style={{ minWidth: '160px' }}>
                                        {comp}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {COURSES.map(course => (
                                <tr key={course} className="hover:bg-gray-50">
                                    <td className="sticky left-0 bg-white hover:bg-gray-50 px-4 py-3 whitespace-nowrap font-medium text-gray-900 z-10 border-r">{course}</td>
                                    {COMPETITIONS.map(comp => (
                                        <td key={comp} className="px-3 py-3 whitespace-nowrap text-center font-semibold border-l">
                                            {scoresByCourseAndCompetition.get(course)?.get(comp) ?? '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ScoreTable;