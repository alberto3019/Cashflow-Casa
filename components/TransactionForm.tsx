'use client';

import { useState, useEffect } from 'react';
import { User, Transaction, TransactionType, PaymentMethod, IncomeType, ExpenseType } from '@/types';
import { saveTransaction, updateTransaction, formatCurrency } from '@/lib/storage';
import { format } from 'date-fns';

interface TransactionFormProps {
  user: User;
  transaction?: Transaction; // Si se proporciona, es modo edición
  onTransactionAdded: () => void;
  onCancel: () => void;
}

export default function TransactionForm({ user, transaction, onTransactionAdded, onCancel }: TransactionFormProps) {
  const isEditMode = !!transaction;
  
  const [type, setType] = useState<TransactionType>(transaction?.type || 'expense');
  const [amount, setAmount] = useState<string>(transaction?.amount.toString() || '');
  const [description, setDescription] = useState(transaction?.description || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(transaction?.paymentMethod || 'cash');
  const [category, setCategory] = useState(transaction?.category || '');
  const [date, setDate] = useState(transaction ? format(new Date(transaction.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
  const [incomeType, setIncomeType] = useState<IncomeType>(transaction?.incomeType || 'personal');
  const [expenseType, setExpenseType] = useState<ExpenseType>(transaction?.expenseType || 'house'); // Por defecto 'house' (compartido)
  const [isInstallment, setIsInstallment] = useState(transaction?.isInstallment || false);
  const [totalInstallments, setTotalInstallments] = useState<string>(transaction?.totalInstallments?.toString() || '1');
  
  // Si es modo edición y es una cuota, no permitir editar cuotas
  useEffect(() => {
    if (transaction?.isInstallment && transaction.installmentGroupId) {
      setIsInstallment(true);
      setTotalInstallments(transaction.totalInstallments?.toString() || '1');
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (isEditMode && transaction) {
      // Modo edición: actualizar transacción existente
      updateTransaction(transaction.id, {
        type,
        amount: parseFloat(amount),
        description,
        paymentMethod,
        date: new Date(date).toISOString(),
        category: category || undefined,
        incomeType: type === 'income' ? incomeType : undefined,
        expenseType: type === 'expense' ? (expenseType || 'house') : undefined, // Por defecto 'house' (compartido)
        // No actualizar campos de cuotas en modo edición
      });
    } else {
      // Modo creación: crear nueva transacción
      const newTransaction: Transaction = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        user,
        type,
        amount: parseFloat(amount),
        description,
        paymentMethod,
        date: new Date(date).toISOString(),
        category: category || undefined,
        incomeType: type === 'income' ? incomeType : undefined,
        expenseType: type === 'expense' ? (expenseType || 'house') : undefined, // Por defecto 'house' (compartido)
        isInstallment: type === 'expense' && isInstallment,
        totalInstallments: type === 'expense' && isInstallment ? parseInt(totalInstallments) : undefined,
        installmentAmount: type === 'expense' && isInstallment ? parseFloat(amount) / parseInt(totalInstallments) : undefined,
      };

      saveTransaction(newTransaction);
    }
    
    onTransactionAdded();
    
    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setIncomeType('personal');
    setIsInstallment(false);
    setTotalInstallments('1');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
        {isEditMode ? 'Editar Movimiento' : 'Nuevo Movimiento'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Movimiento
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                type === 'income'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💰 Ingreso
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                type === 'expense'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💸 Gasto
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="0.00"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Ej: Supermercado, Salario, etc."
            required
          />
        </div>

        {/* Income Type (only for income) */}
        {type === 'income' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Ingreso
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setIncomeType('personal')}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  incomeType === 'personal'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👤 Personal
              </button>
              <button
                type="button"
                onClick={() => setIncomeType('house')}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  incomeType === 'house'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🏠 Casa
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {incomeType === 'personal' 
                ? 'Ingreso personal (ej: salario, freelance)' 
                : 'Ingreso de la casa (ej: alquiler recibido, venta compartida)'}
            </p>
          </div>
        )}

        {/* Expense Type (only for expense) */}
        {type === 'expense' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Gasto
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setExpenseType('personal')}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  expenseType === 'personal'
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👤 Personal
              </button>
              <button
                type="button"
                onClick={() => setExpenseType('house')}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  expenseType === 'house'
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🏠 Casa
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {expenseType === 'personal' 
                ? 'Gasto personal (solo lo ves tú)' 
                : 'Gasto de la casa (lo ven ambos)'}
            </p>
          </div>
        )}

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Método de Pago
          </label>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                paymentMethod === 'cash'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💵 Efectivo
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                paymentMethod === 'card'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💳 Tarjeta
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('transfer')}
              className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                paymentMethod === 'transfer'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏦 Transferencia
            </button>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            required
          />
        </div>

        {/* Installments (only for expenses and not in edit mode) */}
        {type === 'expense' && !isEditMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Pago en cuotas?
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setIsInstallment(false)}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  !isInstallment
                    ? 'bg-gray-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pago único
              </button>
              <button
                type="button"
                onClick={() => setIsInstallment(true)}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  isInstallment
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                En cuotas
              </button>
            </div>
            {isInstallment && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad de cuotas
                </label>
                <input
                  type="number"
                  min="2"
                  max="24"
                  value={totalInstallments}
                  onChange={(e) => setTotalInstallments(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ej: 3, 6, 12"
                  required={isInstallment}
                />
                {amount && totalInstallments && parseInt(totalInstallments) > 1 && (
                  <p className="text-xs text-gray-600 mt-2">
                    💰 Monto por cuota: {formatCurrency(parseFloat(amount) / parseInt(totalInstallments))}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Show installment info in edit mode */}
        {type === 'expense' && isEditMode && transaction?.isInstallment && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              📅 Este es un pago en cuotas: {transaction.currentInstallment}/{transaction.totalInstallments}
            </p>
            <p className="text-xs text-orange-600 mt-1">
              Las cuotas no se pueden editar. Elimina y crea una nueva transacción si necesitas cambios.
            </p>
          </div>
        )}

        {/* Category (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría (Opcional)
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Ej: Comida, Servicios, Transporte, etc."
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            {isEditMode ? 'Guardar Cambios' : 'Guardar Movimiento'}
          </button>
        </div>
      </form>
    </div>
  );
}

