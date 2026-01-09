'use client';

import { UserSummary, MonthlySummary } from '@/types';
import { formatCurrency } from '@/lib/storage';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface ChartsProps {
  userSummary: UserSummary;
  monthlySummary: MonthlySummary;
}

const COLORS = {
  income: '#10b981',
  expense: '#ef4444',
  alberto: '#3b82f6',
  victoria: '#ec4899',
};

export default function Charts({ userSummary, monthlySummary }: ChartsProps) {
  // Prepare data for personal income vs expenses
  const personalData = [
    { name: 'Ingresos', value: userSummary.totalIncome, color: COLORS.income },
    { name: 'Gastos', value: userSummary.totalExpenses, color: COLORS.expense },
  ];

  // Prepare data for expenses by category
  const expensesByCategory = userSummary.transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category || 'Sin categoría';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const categoryData = Object.entries(expensesByCategory)
    .map(([name, value]) => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      value,
      fullName: name,
    }))
    .sort((a, b) => b.value - a.value);

  // Colores para las categorías
  const categoryColors = [
    '#ef4444', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'
  ];

  // Prepare data for house comparison (Alberto vs Victoria)
  const houseComparisonData = [
    {
      name: 'Ingresos',
      Alberto: monthlySummary.transactions
        .filter(t => t.user === 'Alberto' && t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
      Victoria: monthlySummary.transactions
        .filter(t => t.user === 'Victoria' && t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
    },
    {
      name: 'Gastos',
      Alberto: monthlySummary.transactions
        .filter(t => t.user === 'Alberto' && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
      Victoria: monthlySummary.transactions
        .filter(t => t.user === 'Victoria' && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
    },
  ];

  // Payment method distribution
  const paymentMethodData = [
    {
      name: 'Efectivo',
      value: userSummary.transactions.filter(t => t.paymentMethod === 'cash').length,
      amount: userSummary.transactions
        .filter(t => t.paymentMethod === 'cash')
        .reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0),
    },
    {
      name: 'Tarjeta',
      value: userSummary.transactions.filter(t => t.paymentMethod === 'card').length,
      amount: userSummary.transactions
        .filter(t => t.paymentMethod === 'card')
        .reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0),
    },
    {
      name: 'Transferencia',
      value: userSummary.transactions.filter(t => t.paymentMethod === 'transfer').length,
      amount: userSummary.transactions
        .filter(t => t.paymentMethod === 'transfer')
        .reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0),
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-blue-600">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Personal Income vs Expenses */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
          Mis Ingresos vs Gastos
        </h3>
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <PieChart>
            <Pie
              data={personalData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {personalData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Expenses by Category */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
          Gastos por Categoría
        </h3>
        {categoryData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={categoryColors[index % categoryColors.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-semibold">{data.fullName}</p>
                          <p className="text-red-600 font-bold">
                            {formatCurrency(data.value)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 text-sm max-h-32 overflow-y-auto">
              {categoryData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                    />
                    <span className="text-gray-600">{item.fullName}</span>
                  </div>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">📊</p>
              <p>No hay gastos con categorías</p>
              <p className="text-sm mt-1">Agrega categorías a tus gastos para ver el desglose</p>
            </div>
          </div>
        )}
      </div>

      {/* House Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
          Comparación Casa (Alberto vs Victoria)
        </h3>
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <BarChart data={houseComparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="Alberto" fill={COLORS.alberto} />
            <Bar dataKey="Victoria" fill={COLORS.victoria} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Method Distribution */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
          Distribución por Método de Pago
        </h3>
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <BarChart data={paymentMethodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="amount" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cashflow Trend */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
          Flujo de Caja Personal
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <span className="text-gray-700 font-medium">Total Ingresos</span>
            <span className="text-green-600 font-bold text-xl">
              {formatCurrency(userSummary.totalIncome)}
            </span>
          </div>
          <div className="pl-4 space-y-2 text-sm border-l-2 border-green-200">
            <div className="flex justify-between">
              <span className="text-gray-600">👤 Personal:</span>
              <span className="font-semibold text-purple-600">
                {formatCurrency(userSummary.personalIncome)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">🏠 Casa:</span>
              <span className="font-semibold text-amber-600">
                {formatCurrency(userSummary.houseIncome)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <span className="text-gray-700 font-medium">Total Gastos</span>
            <span className="text-red-600 font-bold text-xl">
              {formatCurrency(userSummary.totalExpenses)}
            </span>
          </div>
          <div className={`flex items-center justify-between p-4 rounded-lg ${
            userSummary.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'
          }`}>
            <span className="text-gray-700 font-medium">Balance Final</span>
            <span className={`font-bold text-xl ${
              userSummary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
            }`}>
              {formatCurrency(userSummary.balance)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

