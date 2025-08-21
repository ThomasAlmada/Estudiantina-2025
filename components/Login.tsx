import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [dni, setDni] = useState('');
  const { login, error, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni.trim() || loading) return;
    try {
        await login(dni);
    } catch (err) {
        // Error is handled in context
        console.error(err);
        setDni(''); // Clear DNI on failed login
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary via-blue-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <img src="https://bop20.edu.ar/wp-content/uploads/cropped-LOGO-BOP20-2023-126x130.jpg" alt="Logo Colegio" className="w-28 h-28 mx-auto mb-4 bg-white p-2 rounded-full shadow-lg"/>
            <h1 className="text-3xl font-bold text-white tracking-tight">Estudiantina B.O.P. N.º 20</h1>
            <p className="text-blue-200">Sistema de Gestión de Eventos</p>
        </div>
       <div className="w-full p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
            <h2 className="text-2xl font-semibold text-dark">Iniciar Sesión</h2>
            <p className="mt-1 text-sm text-gray-500">Ingrese su DNI para acceder al panel.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="dni" className="sr-only">
              DNI
            </label>
            <input
              id="dni"
              name="dni"
              type="text"
              inputMode="numeric"
              required
              className="relative block w-full px-4 py-3 text-center text-lg text-dark placeholder-gray-500 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Número de Documento"
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          
          {error && <p className="text-sm text-center text-danger bg-red-100 p-3 rounded-md">{error}</p>}
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex justify-center w-full py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8
 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Ingresar'
              )}
            </button>
          </div>
        </form>
      </div>
       <footer className="mt-8 text-center text-sm text-blue-300">
          <p>&copy; {new Date().getFullYear()} B.O.P. N.º 20. Desarrollo y sistema.</p>
      </footer>
    </div>
  );
};