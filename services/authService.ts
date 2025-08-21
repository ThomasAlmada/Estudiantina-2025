import { User, UserRole } from '../types';

const DB_KEY = 'estudiantina_user_database';

// The initial set of users, only used if localStorage is empty.
const initialMockDatabase: Record<string, { name: string; role: UserRole; course?: string }> = {
  '1111': { name: 'Juan Pérez', role: UserRole.ALUMNO, course: '5° A' },
  '2222': { name: 'Maria Gonzalez', role: UserRole.DELEGADO, course: '4° B' },
  '3333': { name: 'Carlos Rodriguez', role: UserRole.JURADO },
  '4444': { name: 'Ana Martinez', role: UserRole.DOCENTE },
  '5555': { name: 'Luis Fernandez', role: UserRole.PRECEPTOR },
  '7777': { name: 'Visitante Genérico', role: UserRole.VISITANTE },
  '8888': { name: 'Usuario Bloqueado', role: UserRole.PROHIBIDO },
  '49993070': { name: 'Director/a Ejemplo', role: UserRole.DIRECTIVO },
};

const getDatabase = (): Record<string, { name: string; role: UserRole; course?: string }> => {
    try {
        const storedDb = localStorage.getItem(DB_KEY);
        if (storedDb) {
            return JSON.parse(storedDb);
        }
    } catch (error) {
        console.error("Failed to parse user database from localStorage", error);
    }
    // If nothing in localStorage, initialize with the mock data and save it.
    const initialDb = { ...initialMockDatabase };
    localStorage.setItem(DB_KEY, JSON.stringify(initialDb));
    return initialDb;
};

const saveDatabase = (db: Record<string, { name: string; role: UserRole; course?: string }>) => {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (error) {
        console.error("Failed to save user database to localStorage", error);
    }
};


export const login = (dni: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const db = getDatabase();
      const userData = db[dni];
      if (userData) {
        resolve({ dni, ...userData });
      } else {
        reject(new Error('DNI no válido. Intente de nuevo.'));
      }
    }, 500); // Simulate network delay
  });
};

export const addUser = (newUser: { dni: string; name: string; role: UserRole; course?: string }): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const db = getDatabase();
            if (db[newUser.dni]) {
                return reject(new Error('El DNI ingresado ya se encuentra registrado.'));
            }
            const { name, role, course } = newUser;
            db[newUser.dni] = { name, role, course };
            saveDatabase(db);
            resolve({ dni: newUser.dni, name, role, course });
        }, 300);
    });
};

export const getUsers = (): Promise<User[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const db = getDatabase();
            const userList = Object.entries(db).map(([dni, data]) => ({
                dni,
                ...data,
            }));
            resolve(userList);
        }, 300);
    });
};
