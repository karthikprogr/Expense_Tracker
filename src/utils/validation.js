/**
 * Validate transaction data
 */
export const validateTransaction = (data) => {
  const errors = {};

  // Type validation
  if (!data.type || !['income', 'expense'].includes(data.type)) {
    errors.type = 'Please select a valid transaction type';
  }

  // Amount validation
  if (!data.amount) {
    errors.amount = 'Amount is required';
  } else if (isNaN(data.amount) || parseFloat(data.amount) <= 0) {
    errors.amount = 'Amount must be a positive number';
  }

  // Category validation
  if (!data.category || data.category.trim().length === 0) {
    errors.category = 'Please select a category';
  }

  // Description validation
  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'Description is required';
  } else if (data.description.trim().length > 200) {
    errors.description = 'Description must be less than 200 characters';
  }

  // Date validation
  if (!data.date) {
    errors.date = 'Date is required';
  } else {
    const selectedDate = new Date(data.date);
    const today = new Date();
    
    if (isNaN(selectedDate.getTime())) {
      errors.date = 'Invalid date format';
    } else if (selectedDate > today) {
      errors.date = 'Date cannot be in the future';
    }
  }

  const hasErrors = Object.keys(errors).length > 0;
  return {
    isValid: !hasErrors,
    error: hasErrors ? Object.values(errors)[0] : null,
    errors
  };
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return errors;
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
