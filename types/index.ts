export type User = 'Alberto' | 'Victoria';

export type TransactionType = 'income' | 'expense';
export type PaymentMethod = 'cash' | 'card' | 'transfer';
export type IncomeType = 'personal' | 'house'; // personal = ingreso personal, house = ingreso de la casa
export type ExpenseType = 'personal' | 'house'; // personal = gasto personal, house = gasto de la casa

export interface Transaction {
  id: string;
  user: User;
  type: TransactionType;
  amount: number;
  description: string;
  paymentMethod: PaymentMethod;
  date: string; // ISO date string
  category?: string;
  isCreditCard?: boolean; // true si es tarjeta de crédito (gasto para el mes siguiente)
  incomeType?: IncomeType; // Solo para ingresos: 'personal' o 'house'
  expenseType?: ExpenseType; // Solo para gastos: 'personal' o 'house'
  // Campos para cuotas
  isInstallment?: boolean;
  totalInstallments?: number;
  currentInstallment?: number;
  installmentGroupId?: string; // ID del grupo de cuotas
  installmentAmount?: number; // Monto por cuota
}

export interface MonthlySummary {
  month: string; // YYYY-MM format
  totalIncome: number;
  personalIncome: number; // Ingresos personales
  houseIncome: number; // Ingresos de la casa
  totalExpenses: number;
  houseExpenses: number; // Gastos de la casa (no personales)
  balance: number;
  transactions: Transaction[];
}

export interface UserSummary {
  user: User;
  totalIncome: number;
  personalIncome: number; // Ingresos personales del usuario
  houseIncome: number; // Ingresos de la casa del usuario
  totalExpenses: number;
  balance: number;
  transactions: Transaction[];
}

