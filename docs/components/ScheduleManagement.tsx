import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { ScheduleItem } from '../types';
import Card from './Card';

const ScheduleManagement: React.FC = () => {
    const { schedule, addScheduleItem, updateScheduleItem, deleteScheduleItem } = useData();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
    const [formData, setFormData] = useState({ time: '', activity: '', location: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (editingItem) {
            setFormData({
                time: editingItem.time,
                activity: editingItem.activity,
                location: editingItem.location,
            });
            setIsFormVisible(true);
        } else {
            setFormData({ time: '', activity: '', location: '' });
        }
    }, [editingItem]);
    
    const handleAddNew = () => {
        setEditingItem(null);
        setError(null);
        setDeletingId(null);
        setFormData({ time: '', activity: '', location: '' });
        setIsFormVisible(true);
    };

    const handleCancel = () => {
        setEditingItem(null);
        setError(null);
        setIsFormVisible(false);
    };

    const handleEdit = (item: ScheduleItem) => {
        setDeletingId(null);
        setEditingItem(item);
    };

    const handleDeleteClick = (itemId: string) => {
        if (deletingId === itemId) {
            // Confirm delete
            deleteScheduleItem(itemId);
            setDeletingId(null);
        } else {
            // Ask for confirmation
            setEditingItem(null);
            setIsFormVisible(false);
            setDeletingId(itemId);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!formData.time.trim() || !formData.activity.trim() || !formData.location.trim()) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        setSubmitting(true);
        try {
            if (editingItem) {
                await updateScheduleItem({ ...editingItem, ...formData });
            } else {
                await addScheduleItem(formData);
            }
            handleCancel();
        } catch (error) {
            console.error('Failed to save schedule item', error);
            setError('Ocurrió un error al guardar.');
        } finally {
            setSubmitting(false);
        }
    };
    
    return (
        <Card title="Gestionar Cronograma">
            <div className="mb-4 text-right">
                {!isFormVisible && (
                     <button onClick={handleAddNew} className="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary-dark transition-colors">
                        Agregar Actividad
                    </button>
                )}
            </div>

            {isFormVisible && (
                <div className="p-4 border rounded-lg bg-gray-50 mb-6">
                    <h3 className="text-lg font-medium mb-4">{editingItem ? 'Editando Actividad' : 'Nueva Actividad'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
                                <input id="time" type="text" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Ej: 09:00 - 10:00" />
                            </div>
                            <div>
                                <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-1">Actividad</label>
                                <input id="activity" type="text" value={formData.activity} onChange={e => setFormData({...formData, activity: e.target.value})} className="block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Nombre de la actividad"/>
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                                <input id="location" type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Lugar del evento" />
                            </div>
                        </div>
                        {error && <p className="text-sm text-center text-danger mt-2">{error}</p>}
                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={handleCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                            <button type="submit" disabled={submitting} className="bg-success text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400">
                                {submitting ? 'Guardando...' : (editingItem ? 'Guardar Cambios' : 'Crear Actividad')}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            <div className="space-y-3">
                {schedule.map(item => (
                    <div key={item.id} className={`p-3 bg-white border rounded-lg flex items-center justify-between hover:shadow-md transition-shadow ${deletingId === item.id ? 'border-danger ring-2 ring-red-200' : ''}`}>
                        <div className="flex-1">
                            <p className="font-bold text-primary">{item.time}</p>
                            <p className="text-gray-800 font-medium">{item.activity}</p>
                            <p className="text-sm text-gray-500">{item.location}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                           {deletingId === item.id ? (
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => setDeletingId(null)} className="text-sm text-gray-600 px-3 py-1 rounded-md hover:bg-gray-200">Cancelar</button>
                                    <button onClick={() => handleDeleteClick(item.id)} className="text-sm text-white bg-danger px-3 py-1 rounded-md hover:bg-red-700">Confirmar</button>
                                </div>
                           ) : (
                            <>
                                <button onClick={() => handleEdit(item)} className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-blue-100" aria-label="Editar">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                </button>
                                <button onClick={() => handleDeleteClick(item.id)} className="p-2 text-gray-500 hover:text-danger rounded-full hover:bg-red-100" aria-label="Eliminar">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                </button>
                            </>
                           )}
                        </div>
                    </div>
                ))}
            </div>
             {schedule.length === 0 && <p className="text-center p-4 text-gray-500">No hay actividades en el cronograma.</p>}
        </Card>
    );
};

export default ScheduleManagement;