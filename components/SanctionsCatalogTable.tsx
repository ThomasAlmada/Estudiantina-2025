import React from 'react';
import Card from './Card';
import { SANCTIONS_CATALOG } from '../constants';

const SanctionsCatalogTable: React.FC = () => {
    return (
        <Card title="Catálogo Oficial de Sanciones">
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Infracción</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quita de Puntos</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {SANCTIONS_CATALOG.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.infraction}</td>
                                <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold text-right">-{item.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default SanctionsCatalogTable;
