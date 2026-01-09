'use client';

import { Transaction, User } from '@/types';
import { deleteTransaction, formatCurrency, getVisibleTransactions } from '@/lib/storage';
import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';

interface TransactionListProps {
  transactions: Transaction[];
  currentUser: User;
  onTransactionDeleted: () => void;
  onTransactionEdit?: (transaction: Transaction) => void;
}

export default function TransactionList({ 
  transactions, 
  currentUser,
  onTransactionDeleted,
  onTransactionEdit
}: TransactionListProps) {
  // Filtrar transacciones según visibilidad
  const visibleTransactions = getVisibleTransactions(transactions, currentUser);

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      deleteTransaction(id);
      onTransactionDeleted();
    }
  };

  if (visibleTransactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No hay transacciones este mes
        </h3>
        <p className="text-gray-500">
          Agrega tu primer movimiento para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Movimientos del Mes</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {visibleTransactions.map((transaction) => {
          const isOwnTransaction = transaction.user === currentUser;
          const date = format(parseISO(transaction.date), 'dd MMM yyyy', { locale: es });
          
          return (
            <div
              key={transaction.id}
              className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors ${
                isOwnTransaction ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start sm:items-center space-x-2 sm:space-x-3">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                      transaction.user === 'Alberto' 
                        ? 'bg-blue-500' 
                        : 'bg-pink-500'
                    }`}>
                      {transaction.user === 'Alberto' ? 'A' : 'V'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                          {transaction.description}
                        </h3>
                        {isOwnTransaction && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                            Tuyo
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 sm:space-x-3 text-xs sm:text-sm text-gray-500 mt-1">
                        <span className="whitespace-nowrap">{transaction.user}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="whitespace-nowrap">{date}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center space-x-1">
                          {transaction.paymentMethod === 'cash' ? '💵' : transaction.paymentMethod === 'card' ? '💳' : '🏦'}
                          <span className="capitalize">
                            {transaction.paymentMethod === 'cash' ? 'Efectivo' : transaction.paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'}
                          </span>
                        </span>
                        {transaction.type === 'income' && transaction.incomeType && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                              transaction.incomeType === 'personal'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {transaction.incomeType === 'personal' ? '👤 Personal' : '🏠 Casa'}
                            </span>
                          </>
                        )}
                        {transaction.type === 'expense' && transaction.expenseType && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                              transaction.expenseType === 'personal'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {transaction.expenseType === 'personal' ? '👤 Personal' : '🏠 Casa'}
                            </span>
                          </>
                        )}
                        {transaction.isInstallment && transaction.currentInstallment && transaction.totalInstallments && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">
                              Cuota {transaction.currentInstallment}/{transaction.totalInstallments}
                            </span>
                          </>
                        )}
                        {transaction.category && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                              {transaction.category}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 flex-shrink-0">
                  <div className="text-right sm:text-right">
                    <p className={`text-base sm:text-lg font-bold ${
                      transaction.type === 'income' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  
                  {isOwnTransaction && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      {onTransactionEdit && !transaction.isInstallment && (
                        <button
                          onClick={() => onTransactionEdit(transaction)}
                          className="text-blue-500 hover:text-blue-700 transition-colors p-2"
                          aria-label="Editar transacción"
                          title="Editar transacción"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        aria-label="Eliminar transacción"
                        title="Eliminar transacción"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
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

