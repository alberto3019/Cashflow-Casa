import { Transaction, MonthlySummary, UserSummary, User } from '@/types';
import { format, parseISO, startOfMonth, endOfMonth, addMonths } from 'date-fns';

const STORAGE_KEY = 'household-transactions';

export const getTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  
  // Si es una transacción en cuotas, generar las cuotas futuras
  if (transaction.isInstallment && transaction.totalInstallments && transaction.totalInstallments > 1) {
    const groupId = transaction.installmentGroupId || `installment-${Date.now()}`;
    const installmentAmount = transaction.installmentAmount || (transaction.amount / transaction.totalInstallments);
    
    // Marcar la primera cuota
    transaction.installmentGroupId = groupId;
    transaction.currentInstallment = 1;
    transaction.installmentAmount = installmentAmount;
    transaction.amount = installmentAmount; // El monto de la transacción es el monto por cuota
    
    transactions.push(transaction);
    
    // Generar las cuotas futuras
    for (let i = 2; i <= transaction.totalInstallments; i++) {
      const futureDate = addMonths(parseISO(transaction.date), i - 1);
      const futureTransaction: Transaction = {
        ...transaction,
        id: `${groupId}-${i}`,
        currentInstallment: i,
        date: futureDate.toISOString(),
      };
      transactions.push(futureTransaction);
    }
  } else {
    transactions.push(transaction);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

export const deleteTransaction = (id: string): void => {
  const transactions = getTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const updateTransaction = (id: string, updates: Partial<Transaction>): void => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === id);
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }
};

export const getTransactionById = (id: string): Transaction | undefined => {
  const transactions = getTransactions();
  return transactions.find(t => t.id === id);
};

export const getMonthlySummary = (month: string, currentUser?: User): MonthlySummary => {
  const transactions = getTransactions();
  let monthTransactions = transactions.filter(t => {
    const transactionMonth = format(parseISO(t.date), 'yyyy-MM');
    return transactionMonth === month;
  });
  
  // Filtrar por visibilidad si se proporciona el usuario
  if (currentUser) {
    monthTransactions = getVisibleTransactions(monthTransactions, currentUser);
  }

  const incomeTransactions = monthTransactions.filter(t => t.type === 'income');
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  const personalIncome = incomeTransactions
    .filter(t => t.incomeType === 'personal')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const houseIncome = incomeTransactions
    .filter(t => t.incomeType === 'house')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenseTransactions = monthTransactions.filter(t => t.type === 'expense');
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Gastos de la casa (no personales): gastos marcados como 'house' o sin expenseType (compartidos por defecto)
  const houseExpenses = expenseTransactions
    .filter(t => t.expenseType === 'house' || !t.expenseType) // Si no tiene expenseType, se considera compartido
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    month,
    totalIncome,
    personalIncome,
    houseIncome,
    totalExpenses,
    houseExpenses,
    balance: houseExpenses, // Valor de la casa: suma de gastos no personales (de la casa)
    transactions: monthTransactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
  };
};

export const getUserSummary = (user: User, month?: string): UserSummary => {
  const transactions = getTransactions();
  let userTransactions = transactions.filter(t => t.user === user);

  if (month) {
    userTransactions = userTransactions.filter(t => {
      const transactionMonth = format(parseISO(t.date), 'yyyy-MM');
      return transactionMonth === month;
    });
  }

  const incomeTransactions = userTransactions.filter(t => t.type === 'income');
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  const personalIncome = incomeTransactions
    .filter(t => t.incomeType === 'personal')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const houseIncome = incomeTransactions
    .filter(t => t.incomeType === 'house')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = userTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    user,
    totalIncome,
    personalIncome,
    houseIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    transactions: userTransactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
  };
};

export const getCurrentMonth = (): string => {
  return format(new Date(), 'yyyy-MM');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
};

// Obtener cuotas pendientes (futuras)
export const getPendingInstallments = (currentUser: User): Transaction[] => {
  const transactions = getTransactions();
  const now = new Date();
  
  return transactions.filter(t => {
    // Solo cuotas futuras
    const transactionDate = parseISO(t.date);
    if (transactionDate <= now) return false;
    
    // Solo cuotas
    if (!t.isInstallment || !t.installmentGroupId) return false;
    
    // Solo del usuario actual o de la casa
    if (t.type === 'income' && t.incomeType === 'personal' && t.user !== currentUser) {
      return false;
    }
    
    return true;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Filtrar transacciones según visibilidad: personales solo para el usuario, de la casa para ambos
export const getVisibleTransactions = (transactions: Transaction[], currentUser: User): Transaction[] => {
  return transactions.filter(t => {
    // Si es un ingreso personal, solo lo ve el usuario que lo creó
    if (t.type === 'income' && t.incomeType === 'personal') {
      return t.user === currentUser;
    }
    // Si es un gasto personal, solo lo ve el usuario que lo creó
    if (t.type === 'expense' && t.expenseType === 'personal') {
      return t.user === currentUser;
    }
    // Ingresos de la casa, gastos de la casa y gastos sin expenseType (compartidos por defecto) los ven ambos
    return true;
  });
};

