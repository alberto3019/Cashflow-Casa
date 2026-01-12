'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import ProfileSelector from '@/components/ProfileSelector';
import Dashboard from '@/components/Dashboard';
import { getCurrentMonth, loadFromFirestore } from '@/lib/storage';

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>(getCurrentMonth());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar datos desde Firestore al iniciar
    const initializeData = async () => {
      try {
        const firestoreData = await loadFromFirestore();
        if (firestoreData && firestoreData.length > 0) {
          // Si hay datos en Firestore, guardarlos en localStorage
          const serialized = JSON.stringify(firestoreData);
          localStorage.setItem('household-transactions', serialized);
          // Emitir evento para actualizar la UI
          window.dispatchEvent(new CustomEvent('localStorageChange', {
            detail: { key: 'household-transactions', newValue: serialized }
          }));
        }
      } catch (error) {
        console.warn('Error al cargar datos desde Firestore:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();

    // Check if there's a stored user preference
    const stored = localStorage.getItem('selected-user');
    if (stored && (stored === 'Alberto' || stored === 'Victoria')) {
      setSelectedUser(stored as User);
    }
  }, []);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    localStorage.setItem('selected-user', user);
  };

  const handleBackToSelector = () => {
    setSelectedUser(null);
    localStorage.removeItem('selected-user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <ProfileSelector onSelect={handleUserSelect} />
      </div>
    );
  }

  return (
    <Dashboard 
      user={selectedUser} 
      currentMonth={currentMonth}
      onMonthChange={setCurrentMonth}
      onBackToSelector={handleBackToSelector}
    />
  );
}

