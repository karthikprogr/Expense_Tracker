import { format, parseISO, isValid } from 'date-fns';

/**
 * Format currency amount
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date for display
 */
export const formatDate = (date) => {
  if (!date) return '';

  try {
    let dateObj = date;

    // Convert Firestore Timestamp to Date
    if (date.toDate && typeof date.toDate === 'function') {
      dateObj = date.toDate();
    }
    // Convert string to Date
    else if (typeof date === 'string') {
      dateObj = parseISO(date);
    }

    if (!isValid(dateObj)) {
      return '';
    }

    return format(dateObj, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format date for input field (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
  if (!date) return '';

  try {
    let dateObj = date;

    // Convert Firestore Timestamp to Date
    if (date.toDate && typeof date.toDate === 'function') {
      dateObj = date.toDate();
    }
    // Convert string to Date
    else if (typeof date === 'string') {
      dateObj = new Date(date);
    }

    if (!isValid(dateObj)) {
      return '';
    }

    return format(dateObj, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Format large numbers with K, M suffixes
 */
export const formatCompactNumber = (number) => {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  } else if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  return number.toFixed(2);
};

/**
 * Get month name from month number
 */
export const getMonthName = (monthNumber) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber] || '';
};

/**
 * Get short month name
 */
export const getShortMonthName = (monthNumber) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthNumber] || '';
};

/**
 * Format transaction type for display
 */
export const formatTransactionType = (type) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
