/**
 * Calculate total income from transactions
 */
export const calculateTotalIncome = (transactions) => {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
};

/**
 * Calculate total expenses from transactions
 */
export const calculateTotalExpenses = (transactions) => {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
};

/**
 * Calculate net balance (income - expenses)
 */
export const calculateNetBalance = (transactions) => {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  return income - expenses;
};

/**
 * Group expenses by category
 */
export const groupByCategory = (transactions) => {
  const expenses = transactions.filter((t) => t.type === 'expense');

  return expenses.reduce((acc, t) => {
    const category = t.category;
    acc[category] = (acc[category] || 0) + parseFloat(t.amount || 0);
    return acc;
  }, {});
};

/**
 * Get monthly data for charts
 */
export const getMonthlyData = (transactions, year = new Date().getFullYear()) => {
  const monthlyData = Array(12)
    .fill(0)
    .map(() => ({
      income: 0,
      expenses: 0,
    }));

  transactions.forEach((t) => {
    const date = new Date(t.date);
    if (date.getFullYear() === year) {
      const month = date.getMonth();
      const amount = parseFloat(t.amount || 0);

      if (t.type === 'income') {
        monthlyData[month].income += amount;
      } else {
        monthlyData[month].expenses += amount;
      }
    }
  });

  return monthlyData;
};

/**
 * Get transaction statistics
 */
export const getTransactionStats = (transactions) => {
  const totalTransactions = transactions.length;
  const incomeTransactions = transactions.filter((t) => t.type === 'income').length;
  const expenseTransactions = transactions.filter((t) => t.type === 'expense').length;

  const averageIncome =
    incomeTransactions > 0
      ? calculateTotalIncome(transactions) / incomeTransactions
      : 0;

  const averageExpense =
    expenseTransactions > 0
      ? calculateTotalExpenses(transactions) / expenseTransactions
      : 0;

  return {
    totalTransactions,
    incomeTransactions,
    expenseTransactions,
    averageIncome,
    averageExpense,
  };
};
