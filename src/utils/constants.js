// Transaction Categories
export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Travel',
  'Rent',
  'Utilities',
  'Insurance',
  'Groceries',
  'Fitness',
  'Personal Care',
  'Gifts',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Business',
  'Rental Income',
  'Gift',
  'Bonus',
  'Refund',
  'Other',
];

// Transaction Types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

// Category Colors for Charts
export const CATEGORY_COLORS = {
  Food: '#ef4444',
  Transportation: '#f59e0b',
  Entertainment: '#8b5cf6',
  Shopping: '#ec4899',
  Bills: '#3b82f6',
  Healthcare: '#10b981',
  Education: '#06b6d4',
  Travel: '#f97316',
  Rent: '#6366f1',
  Utilities: '#14b8a6',
  Insurance: '#84cc16',
  Groceries: '#f43f5e',
  Fitness: '#22c55e',
  'Personal Care': '#a855f7',
  Gifts: '#f472b6',
  Other: '#6b7280',
};

// Chart Colors
export const CHART_COLORS = [
  '#ef4444', // red
  '#f59e0b', // orange
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#3b82f6', // blue
  '#10b981', // green
  '#06b6d4', // cyan
  '#f97316', // dark orange
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#84cc16', // lime
  '#f43f5e', // rose
];

// Date Ranges for Filters
export const DATE_RANGES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_YEAR: 'this_year',
  CUSTOM: 'custom',
};

// Currency Options
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

// Default Currency
export const DEFAULT_CURRENCY = 'USD';

// Month Names
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// App Constants
export const APP_NAME = 'Expense Tracker';
export const APP_VERSION = '1.0.0';
export const MAX_TRANSACTION_DESCRIPTION_LENGTH = 200;
export const TRANSACTIONS_PER_PAGE = 20;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  CURRENCY: 'currency',
  FILTERS: 'transaction_filters',
};
