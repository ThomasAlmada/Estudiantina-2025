import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { COURSES } from '../constants';
import Card from './Card';

const UserManagement: React.FC = () => {
    const { users, addUser, deleteUser, user: currentUser } = useAuth();
    const [dni, setDni] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.ALUMNO);
    const [course, setCourse] = useState(COURSES[0]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [deletingDni, setDeletingDni] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    
    const rolesWithOptions = [UserRole.ALUMNO, UserRole.DELEGADO];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("El Nombre Completo es obligatorio.");
            return;
        }
        if (!dni.trim()) {
            setError("El DNI es obligatorio.");
            return;
        }
        setError(null);
        setSuccess(null);
        setSubmitting(true);
        try {
            const newUser = {
                dni,
                name,
                role,
                course: rolesWithOptions.includes(role) ? course : undefined,
            };
            await addUser(newUser);
            setSuccess(`¡Usuario ${name} (${dni}) creado exitosamente!`);
            setDni('');
            setName('');
            setRole(UserRole.ALUMNO);
            setCourse(COURSES[0]);
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al crear el usuario.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (dni: string) => {
        setIsDeleting(dni);
        try {
            await deleteUser(dni);
            setDeletingDni(null);
        } catch (e) {
            console.error(e);
            setError('Error al eliminar el usuario.');
        } finally {
            setIsDeleting(null);
        }
    }
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
                <Card title="Crear Nuevo Usuario">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                            <input
                              id="name"
                              type="text"
                              required
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                              placeholder="Ej: Juan Pérez"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                         <div>
                            <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">DNI del Usuario</label>
                            <input
                              id="dni"
                              type="text"
                              inputMode="numeric"
                              required
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                              placeholder="Ej: 40123456"
                              value={dni}
                              onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                            <select id="role" value={role} onChange={e => setRole(e.target.value as UserRole)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                {Object.values(UserRole).filter(r => r !== UserRole.PROHIBIDO).map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        {rolesWithOptions.includes(role) && (
                             <div>
                                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                                <select id="course" value={course} onChange={e => setCourse(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                    {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        )}
                        
                        <button type="submit" disabled={submitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400">
                            {submitting ? 'Creando...' : 'Crear Usuario'}
                        </button>
                        
                        {error && <p className="text-sm text-center text-danger bg-red-100 p-3 rounded-md">{error}</p>}
                        {success && <p className="text-sm text-center text-success bg-green-100 p-3 rounded-md">{success}</p>}
                    </form>
                </Card>
            </div>
            <div className="lg:col-span-2">
                 <Card title="Listado de Usuarios">
                    <div className="overflow-x-auto border rounded-lg max-h-[600px]">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.sort((a,b) => a.name.localeCompare(b.name)).map((user) => (
                                    <tr key={user.dni} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.dni}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.course || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {user.dni === currentUser?.dni ? (
                                                <span className="text-xs text-gray-500 italic">Usuario actual</span>
                                            ) : deletingDni === user.dni ? (
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button onClick={() => setDeletingDni(null)} className="text-sm text-gray-600 hover:text-gray-900">Cancelar</button>
                                                    <button onClick={() => handleDeleteUser(user.dni)} className="text-sm text-white bg-danger px-3 py-1 rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed" disabled={isDeleting === user.dni}>
                                                        {isDeleting === user.dni ? 'Borrando...' : 'Confirmar'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setDeletingDni(user.dni)} className="p-2 text-gray-500 hover:text-danger rounded-full hover:bg-red-100 transition-colors" aria-label={`Eliminar a ${user.name}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.length === 0 && <p className="text-center p-4 text-gray-500">No hay usuarios.</p>}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default UserManagement;