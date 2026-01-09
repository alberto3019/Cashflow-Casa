'use client';

import { UserSummary, MonthlySummary } from '@/types';
import { formatCurrency } from '@/lib/storage';

interface SummaryCardsProps {
  userSummary: UserSummary;
  monthlySummary: MonthlySummary;
}

export default function SummaryCards({ userSummary, monthlySummary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Personal Balance */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Mi Balance</h3>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p className={`text-xl sm:text-2xl font-bold ${userSummary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(userSummary.balance)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {formatCurrency(userSummary.totalIncome)} ingresos - {formatCurrency(userSummary.totalExpenses)} gastos
        </p>
      </div>

      {/* Personal Income */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Mis Ingresos</h3>
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-green-600">
          {formatCurrency(userSummary.totalIncome)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          👤 {formatCurrency(userSummary.personalIncome)} personal
        </p>
        <p className="text-xs text-gray-500">
          🏠 {formatCurrency(userSummary.houseIncome)} casa
        </p>
      </div>

      {/* Personal Expenses */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Mis Gastos</h3>
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-red-600">
          {formatCurrency(userSummary.totalExpenses)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {userSummary.transactions.filter(t => t.type === 'expense').length} transacciones
        </p>
      </div>

      {/* House Value */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Valor de la Casa</h3>
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-purple-600">
          {formatCurrency(monthlySummary.balance)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          🏠 Gastos de la casa (no personales)
        </p>
        <p className="text-xs text-gray-400">
          Total: {formatCurrency(monthlySummary.houseExpenses || 0)}
        </p>
      </div>
    </div>
  );
}

