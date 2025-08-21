import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <img className="h-10 w-10" src="https://bop20.edu.ar/wp-content/uploads/cropped-LOGO-BOP20-2023-126x130.jpg" alt="Logo" />
                        <div>
                            <h1 className="text-lg font-bold text-dark">Estudiantina B.O.P. N.º 20</h1>
                            <p className="text-xs text-gray-500">Semana del Estudiante</p>
                        </div>
                    </div>
                    {user && (
                         <div className="flex items-center">
                            <div className="text-right mr-4 hidden sm:block">
                                 <p className="text-sm font-medium text-dark">{user.name}</p>
                                 <p className="text-xs text-primary font-semibold uppercase">{user.role}{user.course ? ` - ${user.course}` : ''}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                                aria-label="Cerrar sesión"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;