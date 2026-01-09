'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getPendingInstallments, deleteTransaction, formatCurrency } from '@/lib/storage';
import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';

interface PendingInstallmentsProps {
  currentUser: User;
  onTransactionDeleted: () => void;
}

export default function PendingInstallments({ currentUser, onTransactionDeleted }: PendingInstallmentsProps) {
  const [pendingInstallments, setPendingInstallments] = useState(getPendingInstallments(currentUser));

  useEffect(() => {
    setPendingInstallments(getPendingInstallments(currentUser));
  }, [currentUser]);

  // Actualizar cuando cambia el usuario
  useEffect(() => {
    setPendingInstallments(getPendingInstallments(currentUser));
  }, [currentUser]);

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta cuota pendiente?')) {
      deleteTransaction(id);
      const updated = getPendingInstallments(currentUser);
      setPendingInstallments(updated);
      onTransactionDeleted();
    }
  };
  
  const handleDeleteGroup = (group: typeof pendingInstallments) => {
    if (confirm(`¿Estás seguro de que quieres eliminar todas las ${group.length} cuotas pendientes de "${group[0].description}"?`)) {
      group.forEach(i => deleteTransaction(i.id));
      const updated = getPendingInstallments(currentUser);
      setPendingInstallments(updated);
      onTransactionDeleted();
    }
  };

  // Agrupar por installmentGroupId
  const grouped = pendingInstallments.reduce((acc, installment) => {
    const groupId = installment.installmentGroupId || 'unknown';
    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId].push(installment);
    return acc;
  }, {} as Record<string, typeof pendingInstallments>);

  const groups = Object.values(grouped);

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 sm:mb-8">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center space-x-2">
          <span>📅</span>
          <span>Cuotas Pendientes</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Total: {pendingInstallments.length} cuota{pendingInstallments.length !== 1 ? 's' : ''} pendiente{pendingInstallments.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {groups.map((group, groupIndex) => {
          const firstInstallment = group[0];
          const totalAmount = group.reduce((sum, i) => sum + (i.installmentAmount || i.amount), 0);
          const remaining = group.length;
          
          return (
            <div key={groupIndex} className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start sm:items-center space-x-2 sm:space-x-3">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                      firstInstallment.user === 'Alberto' 
                        ? 'bg-blue-500' 
                        : 'bg-pink-500'
                    }`}>
                      {firstInstallment.user === 'Alberto' ? 'A' : 'V'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                          {firstInstallment.description}
                        </h3>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 sm:py-1 rounded-full font-medium whitespace-nowrap">
                          {remaining} cuota{remaining !== 1 ? 's' : ''} pendiente{remaining !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 sm:space-x-3 text-xs sm:text-sm text-gray-500 mt-1">
                        <span className="whitespace-nowrap">{firstInstallment.user}</span>
                        {firstInstallment.category && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                              {firstInstallment.category}
                            </span>
                          </>
                        )}
                        <span className="hidden sm:inline">•</span>
                        <span className="text-orange-600 font-medium whitespace-nowrap">
                          Total: {formatCurrency(totalAmount)}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        {group.slice(0, 3).map((installment) => (
                          <div key={installment.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs text-gray-600 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded">
                            <span className="truncate">
                              Cuota {installment.currentInstallment}/{firstInstallment.totalInstallments} - {format(parseISO(installment.date), 'dd MMM yyyy', { locale: es })}
                            </span>
                            <span className="font-semibold text-red-600 whitespace-nowrap">
                              {formatCurrency(installment.installmentAmount || installment.amount)}
                            </span>
                          </div>
                        ))}
                        {group.length > 3 && (
                          <div className="text-xs text-gray-500 px-2 sm:px-3 py-1">
                            + {group.length - 3} cuota{group.length - 3 !== 1 ? 's' : ''} más
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 flex-shrink-0 sm:flex-col sm:items-end">
                  <div className="text-right sm:text-right">
                    <p className="text-sm font-semibold text-orange-600">
                      {formatCurrency(totalAmount)}
                    </p>
                    <p className="text-xs text-gray-500 hidden sm:block">
                      Total pendiente
                    </p>
                  </div>
                  
                  {firstInstallment.user === currentUser && (
                    <button
                      onClick={() => handleDeleteGroup(group)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1.5 sm:p-2 flex-shrink-0"
                      aria-label="Eliminar cuotas"
                      title="Eliminar todas las cuotas pendientes"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

