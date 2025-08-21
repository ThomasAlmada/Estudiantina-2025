import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Score, Sanction, ScheduleItem } from '../types';
import { MOCK_INITIAL_SCORES } from '../services/dataService';
import { SCHEDULE as INITIAL_SCHEDULE } from '../constants';

interface DataContextType {
  scores: Score[];
  addScore: (score: Omit<Score, 'id' | 'timestamp'>) => Promise<void>;
  sanctions: Sanction[];
  addSanction: (sanction: Omit<Sanction, 'id' | 'timestamp'>) => Promise<void>;
  schedule: ScheduleItem[];
  addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => Promise<void>;
  updateScheduleItem: (item: ScheduleItem) => Promise<void>;
  deleteScheduleItem: (itemId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scores, setScores] = useState<Score[]>(MOCK_INITIAL_SCORES);
  const [sanctions, setSanctions] = useState<Sanction[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);

  const addScore = useCallback(async (newScoreData: Omit<Score, 'id' | 'timestamp'>) => {
    // Simulate API call
    await new Promise(res => setTimeout(res, 300));
    setScores(prevScores => {
      const newScore: Score = {
        ...newScoreData,
        id: Date.now(),
        timestamp: new Date(),
      };
      // Sort by score descending, then by course name
      return [...prevScores, newScore].sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return a.course.localeCompare(b.course);
      });
    });
  }, []);

  const addSanction = useCallback(async (newSanctionData: Omit<Sanction, 'id' | 'timestamp'>) => {
    await new Promise(res => setTimeout(res, 300));
    setSanctions(prevSanctions => {
        const newSanction: Sanction = {
            ...newSanctionData,
            id: Date.now(),
            timestamp: new Date(),
        };
        return [...prevSanctions, newSanction].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
    });
  }, []);

  const addScheduleItem = useCallback(async (newItemData: Omit<ScheduleItem, 'id'>) => {
    await new Promise(res => setTimeout(res, 300));
    setSchedule(prevSchedule => {
      const newItem: ScheduleItem = {
        ...newItemData,
        id: `sch-${Date.now()}`,
      };
      return [...prevSchedule, newItem];
    });
  }, []);

  const updateScheduleItem = useCallback(async (updatedItem: ScheduleItem) => {
    await new Promise(res => setTimeout(res, 300));
    setSchedule(prevSchedule => 
      prevSchedule.map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
  }, []);

  const deleteScheduleItem = useCallback(async (itemId: string) => {
    await new Promise(res => setTimeout(res, 300));
    setSchedule(prevSchedule => prevSchedule.filter(item => item.id !== itemId));
  }, []);


  return (
    <DataContext.Provider value={{ scores, addScore, sanctions, addSanction, schedule, addScheduleItem, updateScheduleItem, deleteScheduleItem }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};