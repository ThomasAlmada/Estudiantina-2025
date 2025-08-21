import React from 'react';
import Card from './Card';
import { useData } from '../context/DataContext';

const ScheduleCard: React.FC = () => {
    const { schedule } = useData();
    return (
        <Card title="Cronograma de Actividades">
        <ul className="space-y-4">
            {schedule.map((item) => (
                <li key={item.id} className="flex items-start">
                    <div className="w-28 text-sm font-semibold text-brand-primary flex-shrink-0">{item.time}</div>
                    <div className="ml-4 flex-1">
                        <p className="font-medium text-gray-900">{item.activity}</p>
                        <p className="text-sm text-gray-500">{item.location}</p>
                    </div>
                </li>
            ))}
        </ul>
        </Card>
    );
}

export default ScheduleCard;