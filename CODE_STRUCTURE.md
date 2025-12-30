# 🏗 CODE STRUCTURE DOCUMENTATION

## Overview
This document explains the architecture, code organization, and implementation details of the Expense Tracker application.

---

## 🎯 Application Architecture

### High-Level Architecture
```
┌─────────────────┐
│   React App     │
│   (Frontend)    │
└────────┬────────┘
         │
         │ Firebase SDK
         │
┌────────▼────────┐
│  Firebase Auth  │ ← User Authentication
└─────────────────┘
         │
┌────────▼────────┐
│   Firestore DB  │ ← Transaction Storage
└─────────────────┘
```

### Component Hierarchy
```
App
├── AuthContext.Provider
│   ├── Router
│   │   ├── Login
│   │   ├── Signup
│   │   └── PrivateRoute
│   │       └── Dashboard
│   │           ├── Header
│   │           ├── BalanceSummary
│   │           ├── TransactionForm
│   │           ├── Filters
│   │           ├── TransactionList
│   │           │   └── TransactionItem (multiple)
│   │           └── Charts
│   │               ├── ExpensePieChart
│   │               └── MonthlyTrendChart
└── ThemeContext.Provider
```

---

## 📂 Directory Structure Explained

### `/src/components/`
Houses all React components, organized by feature.

#### `auth/`
- **Login.jsx** - Email/password and Google login form
- **Signup.jsx** - User registration form
- **PrivateRoute.jsx** - Route protection wrapper

#### `dashboard/`
- **Dashboard.jsx** - Main container for authenticated users
- **BalanceSummary.jsx** - Displays income, expenses, net balance
- **Header.jsx** - Navigation bar with user info and logout

#### `transactions/`
- **TransactionForm.jsx** - Form to add/edit transactions
- **TransactionList.jsx** - Container for transaction items
- **TransactionItem.jsx** - Single transaction display with edit/delete
- **Filters.jsx** - Category, date, and type filters

#### `charts/`
- **ExpensePieChart.jsx** - Category-wise expense breakdown
- **MonthlyTrendChart.jsx** - Monthly income vs expense trends

#### `common/`
- **Button.jsx** - Reusable button component
- **Input.jsx** - Reusable input field with validation
- **Modal.jsx** - Reusable modal dialog

### `/src/context/`
Global state management using React Context API.

- **AuthContext.jsx** - User authentication state and methods
- **ThemeContext.jsx** - Dark/light mode toggle

### `/src/services/`
Backend integration and business logic.

- **firebase.js** - Firebase initialization and configuration
- **transactionService.js** - CRUD operations for transactions

### `/src/utils/`
Utility functions for data processing.

- **calculations.js** - Financial calculations (totals, balance)
- **validation.js** - Input validation logic
- **formatters.js** - Date and currency formatting

### `/src/hooks/`
Custom React hooks for reusable logic.

- **useAuth.js** - Authentication state and methods
- **useTransactions.js** - Transaction data fetching and management

---

## 🔧 Core Components Explained

### 1. App.js (Main Application)
```javascript
// Purpose: Root component with routing and context providers
// Key Responsibilities:
// - Set up React Router
// - Wrap app with AuthContext and ThemeContext
// - Define routes (login, signup, dashboard)
// - Handle global error boundary

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

---

### 2. AuthContext.jsx (Authentication Management)
```javascript
// Purpose: Manage user authentication state globally
// Key Responsibilities:
// - Handle login/signup/logout
// - Store current user data
// - Persist authentication across page refreshes
// - Provide auth methods to all components

import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login function
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Signup function
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Logout function
  const logout = () => {
    return signOut(auth);
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
```

**How it works:**
1. Creates a context for authentication
2. Listens to Firebase auth state changes
3. Provides login, signup, logout methods to all components
4. Stores current user information
5. Shows loading state during initialization

---

### 3. Dashboard.jsx (Main User Interface)
```javascript
// Purpose: Main screen after login
// Key Responsibilities:
// - Fetch user's transactions from Firestore
// - Display balance summary
// - Show transaction form and list
// - Render charts
// - Handle real-time updates

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { getTransactions } from '../../services/transactionService';
import BalanceSummary from './BalanceSummary';
import TransactionForm from '../transactions/TransactionForm';
import TransactionList from '../transactions/TransactionList';
import Charts from '../charts/Charts';

function Dashboard() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions on mount
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = getTransactions(
        currentUser.uid, 
        (data) => {
          setTransactions(data);
          setLoading(false);
        }
      );
      return unsubscribe;
    }
  }, [currentUser]);

  return (
    <div className="dashboard">
      <Header />
      <BalanceSummary transactions={transactions} />
      <TransactionForm />
      <Filters />
      <TransactionList transactions={transactions} />
      <Charts transactions={transactions} />
    </div>
  );
}
```

**Data Flow:**
1. Component mounts → fetch transactions
2. Firestore listener → real-time updates
3. State changes → UI re-renders
4. User action → update Firestore → triggers listener

---

### 4. transactionService.js (Firestore Operations)
```javascript
// Purpose: Handle all database operations
// Key Responsibilities:
// - Add new transactions
// - Update existing transactions
// - Delete transactions
// - Fetch transactions (real-time listener)
// - Query transactions with filters

import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

// Add transaction
export const addTransaction = async (userId, transactionData) => {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      userId,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

// Get transactions (real-time)
export const getTransactions = (userId, callback) => {
  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(transactions);
  });

  return unsubscribe; // Return to clean up listener
};

// Update transaction
export const updateTransaction = async (transactionId, updates) => {
  try {
    const docRef = doc(db, 'transactions', transactionId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

// Delete transaction
export const deleteTransaction = async (transactionId) => {
  try {
    await deleteDoc(doc(db, 'transactions', transactionId));
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};
```

**Key Concepts:**
- **Real-time listener**: `onSnapshot` automatically updates UI when data changes
- **Queries**: Filter transactions by userId to show only user's data
- **Error handling**: Wrap operations in try-catch blocks
- **Unsubscribe**: Return cleanup function to prevent memory leaks

---

### 5. calculations.js (Financial Logic)
```javascript
// Purpose: Calculate financial summaries
// Key Responsibilities:
// - Calculate total income
// - Calculate total expenses
// - Calculate net balance
// - Group by category
// - Monthly aggregation

// Calculate total income
export const calculateTotalIncome = (transactions) => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
};

// Calculate total expenses
export const calculateTotalExpenses = (transactions) => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
};

// Calculate net balance
export const calculateNetBalance = (transactions) => {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  return income - expenses;
};

// Group expenses by category
export const groupByCategory = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  
  return expenses.reduce((acc, t) => {
    const category = t.category;
    acc[category] = (acc[category] || 0) + Number(t.amount);
    return acc;
  }, {});
};

// Get monthly summary
export const getMonthlyData = (transactions, year) => {
  const monthlyData = Array(12).fill(0).map(() => ({
    income: 0,
    expenses: 0
  }));

  transactions.forEach(t => {
    const date = new Date(t.date);
    if (date.getFullYear() === year) {
      const month = date.getMonth();
      if (t.type === 'income') {
        monthlyData[month].income += Number(t.amount);
      } else {
        monthlyData[month].expenses += Number(t.amount);
      }
    }
  });

  return monthlyData;
};
```

**Why separate calculations?**
- Reusable across components
- Easier to test
- Keeps components focused on UI
- Can optimize with memoization

---

### 6. BalanceSummary.jsx (Financial Dashboard)
```javascript
// Purpose: Display financial summary
// Key Responsibilities:
// - Show total income (green)
// - Show total expenses (red)
// - Show net balance (green/red based on value)
// - Update in real-time

import { useMemo } from 'react';
import { 
  calculateTotalIncome, 
  calculateTotalExpenses, 
  calculateNetBalance 
} from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

function BalanceSummary({ transactions }) {
  // Memoize calculations for performance
  const totalIncome = useMemo(
    () => calculateTotalIncome(transactions), 
    [transactions]
  );
  
  const totalExpenses = useMemo(
    () => calculateTotalExpenses(transactions), 
    [transactions]
  );
  
  const netBalance = useMemo(
    () => calculateNetBalance(transactions), 
    [transactions]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Income Card */}
      <div className="bg-green-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800">
          Total Income
        </h3>
        <p className="text-3xl font-bold text-green-600">
          {formatCurrency(totalIncome)}
        </p>
      </div>

      {/* Expenses Card */}
      <div className="bg-red-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800">
          Total Expenses
        </h3>
        <p className="text-3xl font-bold text-red-600">
          {formatCurrency(totalExpenses)}
        </p>
      </div>

      {/* Net Balance Card */}
      <div className={`p-6 rounded-lg ${
        netBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'
      }`}>
        <h3 className={`text-lg font-semibold ${
          netBalance >= 0 ? 'text-blue-800' : 'text-orange-800'
        }`}>
          Net Balance
        </h3>
        <p className={`text-3xl font-bold ${
          netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
        }`}>
          {formatCurrency(netBalance)}
        </p>
      </div>
    </div>
  );
}
```

**Performance Optimization:**
- `useMemo` prevents recalculation on every render
- Only recalculates when transactions array changes
- Reduces CPU usage with large transaction lists

---

### 7. TransactionForm.jsx (Add/Edit Transactions)
```javascript
// Purpose: Form to add or edit transactions
// Key Responsibilities:
// - Input fields for all transaction data
// - Client-side validation
// - Submit to Firestore
// - Handle errors and success messages

import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { addTransaction, updateTransaction } from '../../services/transactionService';
import { toast } from 'react-toastify';
import { validateTransaction } from '../../utils/validation';

function TransactionForm({ transaction, onClose }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    type: transaction?.type || 'expense',
    category: transaction?.category || '',
    amount: transaction?.amount || '',
    description: transaction?.description || '',
    date: transaction?.date || new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
    'Food',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Bills',
    'Healthcare',
    'Education',
    'Travel',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const validationErrors = validateTransaction(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (transaction) {
        // Update existing
        await updateTransaction(transaction.id, formData);
        toast.success('Transaction updated successfully');
      } else {
        // Add new
        await addTransaction(currentUser.uid, formData);
        toast.success('Transaction added successfully');
      }
      
      // Reset form
      setFormData({
        type: 'expense',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      if (onClose) onClose();
    } catch (error) {
      toast.error('Failed to save transaction');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Type</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={handleChange}
              className="mr-2"
            />
            Income
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleChange}
              className="mr-2"
            />
            Expense
          </label>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium mb-2">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          className="w-full px-3 py-2 border rounded"
          required
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
          className="w-full px-3 py-2 border rounded"
          required
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium mb-2">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : transaction ? 'Update' : 'Add Transaction'}
      </button>
    </form>
  );
}
```

---

## 🔄 Data Flow Diagram

```
1. USER ACTION (Add Transaction)
   ↓
2. TransactionForm.handleSubmit()
   ↓
3. validateTransaction() → Check inputs
   ↓
4. transactionService.addTransaction()
   ↓
5. Firestore.addDoc() → Save to database
   ↓
6. Firestore triggers onSnapshot listener
   ↓
7. Dashboard receives updated transactions
   ↓
8. React re-renders components
   ↓
9. UI updates with new transaction
```

---

## 🎨 Styling Strategy

### Tailwind CSS Utilities
- **Layout**: `grid`, `flex`, `container`
- **Spacing**: `p-4`, `m-2`, `gap-4`
- **Colors**: `bg-blue-600`, `text-white`
- **Responsive**: `sm:`, `md:`, `lg:` prefixes
- **States**: `hover:`, `focus:`, `disabled:`

### Custom Classes (src/styles/index.css)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition;
  }
  
  .card {
    @apply bg-white shadow-md rounded-lg p-6;
  }
  
  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}
```

---

## 🔒 Security Implementation

### 1. Authentication Security
- Passwords never stored in state or localStorage
- Firebase handles password hashing
- Session tokens auto-refreshed

### 2. Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Transaction security
    match /transactions/{transactionId} {
      // Can only read own transactions
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      
      // Can only create with own userId
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      
      // Can only update/delete own transactions
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
  }
}
```

### 3. Input Validation
```javascript
// validation.js
export const validateTransaction = (data) => {
  const errors = {};
  
  // Amount validation
  if (!data.amount || data.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }
  
  // Description validation
  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'Description is required';
  }
  
  // Category validation
  if (!data.category) {
    errors.category = 'Please select a category';
  }
  
  // Date validation
  if (!data.date) {
    errors.date = 'Date is required';
  }
  
  return errors;
};
```

---

## 🚀 Performance Optimizations

### 1. React.memo
```javascript
export default React.memo(TransactionItem, (prevProps, nextProps) => {
  return prevProps.transaction.id === nextProps.transaction.id &&
         prevProps.transaction.amount === nextProps.transaction.amount;
});
```

### 2. useMemo for Expensive Calculations
```javascript
const totalExpenses = useMemo(() => {
  return calculateTotalExpenses(transactions);
}, [transactions]);
```

### 3. Firestore Indexing
- Create composite indexes for queries
- Index on `userId` + `date` for filtering

### 4. Code Splitting
```javascript
const Charts = lazy(() => import('./components/charts/Charts'));

<Suspense fallback={<Loading />}>
  <Charts transactions={transactions} />
</Suspense>
```

---

## 🧪 Testing Strategy

### Unit Tests
- Test calculation functions
- Test validation logic
- Test formatters

### Integration Tests
- Test form submission
- Test Firestore operations
- Test authentication flow

### E2E Tests
- Login → Add transaction → View dashboard
- Edit transaction → Verify changes
- Delete transaction → Verify removal

---

## 📦 Build and Deployment

### Development Build
```bash
npm start
```
- Runs on localhost:3000
- Hot reload enabled
- Source maps for debugging

### Production Build
```bash
npm run build
```
- Minified JavaScript
- Optimized images
- Environment variables baked in
- Output in `build/` folder

### Firebase Deployment
```bash
firebase deploy
```
- Deploys to Firebase Hosting
- CDN distribution worldwide
- HTTPS by default
- Custom domain support

---

## 🎓 Key Learning Points

1. **Component Architecture**: Breaking UI into reusable pieces
2. **State Management**: Using Context API for global state
3. **Real-time Data**: Firestore listeners for instant updates
4. **Security**: Protecting data with authentication and rules
5. **Performance**: Optimizing with memoization and lazy loading
6. **Code Organization**: Separating concerns (UI, logic, data)

---

**This application demonstrates production-ready Full Stack JavaScript development with modern best practices.**

---

*Last Updated: December 27, 2025*
