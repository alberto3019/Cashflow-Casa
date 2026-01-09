'use client';

import { useState, useEffect } from 'react';
import { User, Transaction } from '@/types';
import { 
  getMonthlySummary, 
  getUserSummary, 
  getCurrentMonth,
  formatCurrency,
  getPendingInstallments
} from '@/lib/storage';
import { format, parseISO, subMonths, addMonths } from 'date-fns';
import es from 'date-fns/locale/es';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import Charts from './Charts';
import SummaryCards from './SummaryCards';
import PendingInstallments from './PendingInstallments';

interface DashboardProps {
  user: User;
  currentMonth: string;
  onMonthChange: (month: string) => void;
  onBackToSelector: () => void;
}

export default function Dashboard({ 
  user, 
  currentMonth, 
  onMonthChange,
  onBackToSelector 
}: DashboardProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [monthlySummary, setMonthlySummary] = useState(getMonthlySummary(currentMonth, user));
  const [userSummary, setUserSummary] = useState(getUserSummary(user, currentMonth));

  const refreshData = () => {
    setMonthlySummary(getMonthlySummary(currentMonth, user));
    setUserSummary(getUserSummary(user, currentMonth));
  };

  useEffect(() => {
    refreshData();
  }, [currentMonth, user]);

  const handleTransactionAdded = () => {
    refreshData();
    setShowForm(false);
    setEditingTransaction(undefined);
  };
  
  const handleTransactionEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTransaction(undefined);
  };

  const handleTransactionDeleted = () => {
    refreshData();
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const current = parseISO(`${currentMonth}-01`);
    const newMonth = direction === 'prev' 
      ? subMonths(current, 1)
      : addMonths(current, 1);
    onMonthChange(format(newMonth, 'yyyy-MM'));
  };

  const monthDisplay = format(parseISO(`${currentMonth}-01`), 'MMMM yyyy', { locale: es });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={onBackToSelector}
                className="text-gray-600 hover:text-gray-800 transition-colors flex-shrink-0"
                aria-label="Cambiar perfil"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
                  {user === 'Alberto' ? '👤 Alberto' : '👤 Victoria'}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">Dashboard Personal</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Month Navigation */}
              <div className="flex items-center justify-between sm:justify-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => changeMonth('prev')}
                  className="p-1.5 sm:p-2 hover:bg-white rounded transition-colors flex-shrink-0"
                  aria-label="Mes anterior"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="px-2 sm:px-4 py-1 text-xs sm:text-sm font-medium text-gray-700 capitalize whitespace-nowrap">
                  {monthDisplay}
                </span>
                <button
                  onClick={() => changeMonth('next')}
                  className="p-1.5 sm:p-2 hover:bg-white rounded transition-colors flex-shrink-0 disabled:opacity-50"
                  aria-label="Mes siguiente"
                  disabled={currentMonth >= getCurrentMonth()}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
              >
                {showForm ? 'Cancelar' : '+ Nuevo Movimiento'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Transaction Form */}
        {showForm && (
          <div className="mb-8">
            <TransactionForm 
              user={user}
              transaction={editingTransaction}
              onTransactionAdded={handleTransactionAdded}
              onCancel={handleCancelForm}
            />
          </div>
        )}

        {/* Summary Cards */}
        <SummaryCards 
          userSummary={userSummary}
          monthlySummary={monthlySummary}
        />

        {/* Charts */}
        <Charts 
          userSummary={userSummary}
          monthlySummary={monthlySummary}
        />

        {/* Pending Installments */}
        <PendingInstallments 
          key={`installments-${user}-${currentMonth}`}
          currentUser={user}
          onTransactionDeleted={handleTransactionDeleted}
        />

        {/* Transaction List */}
        <TransactionList 
          transactions={monthlySummary.transactions}
          currentUser={user}
          onTransactionDeleted={handleTransactionDeleted}
          onTransactionEdit={handleTransactionEdit}
        />
      </main>
    </div>
  );
}

