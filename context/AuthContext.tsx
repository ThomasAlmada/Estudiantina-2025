
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { User, UserRole } from '../types';
import { login as apiLogin, addUser as apiAddUser, getUsers as apiGetUsers } from '../services/authService';

interface AuthContextType {
  user: User | null;
  users: User[];
  loading: boolean;
  login: (dni: string) => Promise<void>;
  logout: () => void;
  addUser: (newUser: { dni: string; name: string; role: UserRole; course?: string }) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchUsers = useCallback(async () => {
    try {
        const userList = await apiGetUsers();
        setUsers(userList);
    } catch (e) {
        console.error("Failed to fetch users", e);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchUsers().finally(() => setLoading(false));
  }, [fetchUsers]);

  const login = useCallback(async (dni: string) => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await apiLogin(dni);
      if (loggedInUser.role === UserRole.PROHIBIDO) {
          throw new Error('Este usuario no tiene permitido el acceso.');
      }
      setUser(loggedInUser);
    } catch (err: any) {
      setError(err.message || 'Error de autenticación');
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const addUser = useCallback(async (newUser: { dni: string; name: string; role: UserRole; course?: string }) => {
    await apiAddUser(newUser);
    await fetchUsers(); // Refresh user list after adding a new one
  }, [fetchUsers]);

  return (
    <AuthContext.Provider value={{ user, users, loading, login, logout, addUser, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};