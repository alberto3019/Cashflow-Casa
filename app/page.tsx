'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import ProfileSelector from '@/components/ProfileSelector';
import Dashboard from '@/components/Dashboard';
import { getCurrentMonth } from '@/lib/storage';

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>(getCurrentMonth());

  useEffect(() => {
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

