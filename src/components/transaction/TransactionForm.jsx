import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addTransaction, updateTransaction } from '../../services/transactionService';
import { toast } from 'react-toastify';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, TRANSACTION_TYPES } from '../../utils/constants';
import { validateTransaction } from '../../utils/validation';
import { FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';

function TransactionForm({ editTransaction, onSuccess, onCancel }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    category: 'Food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        type: editTransaction.type,
        category: editTransaction.category,
        amount: editTransaction.amount,
        description: editTransaction.description,
        date: editTransaction.date,
      });
    } else {
      // Reset form when editTransaction is null (after cancel or success)
      setFormData({
        type: 'expense',
        category: 'Food',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [editTransaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Reset category if type changes
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        category: value === 'income' ? 'Salary' : 'Food',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔥 FORM SUBMITTED!');
    console.log('Form data:', formData);
    console.log('Current user:', currentUser);

    // Validation
    const validation = validateTransaction(formData);
    console.log('Validation result:', validation);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    try {
      setLoading(true);
      
      console.log('Adding transaction with data:', formData);
      console.log('User ID:', currentUser.uid);
      
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };
      
      console.log('Processed transaction data:', transactionData);

      if (editTransaction) {
        await updateTransaction(editTransaction.id, transactionData);
        toast.success('Transaction updated successfully!');
      } else {
        const result = await addTransaction(currentUser.uid, transactionData);
        console.log('Transaction added with ID:', result);
        toast.success('Transaction added successfully!');
      }

      // Reset form
      setFormData({
        type: 'expense',
        category: 'Food',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error(error.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  const availableCategories = formData.type === 'income' 
    ? INCOME_CATEGORIES 
    : EXPENSE_CATEGORIES;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          {editTransaction ? (
            <><span className="text-blue-600 dark:text-blue-400">✏️</span> Edit Transaction</>
          ) : (
            <><span className="text-green-600 dark:text-green-400">➕</span> Add Transaction</>
          )}
        </h2>
        {editTransaction && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            ✕ Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selection */}
        <div>
          <label className="input-label">Transaction Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense', category: 'Food' })}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${
                formData.type === 'expense'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <FaCreditCard className="inline mr-2 text-white" /> Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income', category: 'Salary' })}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${
                formData.type === 'income'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <FaMoneyBillWave className="inline mr-2 text-white" /> Income
            </button>
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="input-label">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
            required
          >
            {availableCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="input-label">
            Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="input-field"
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="input-label">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., Grocery shopping"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="input-label">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`btn-primary w-full ${
            formData.type === 'income' ? 'bg-green-600 hover:bg-green-700' : ''
          }`}
        >
          {loading 
            ? 'Saving...' 
            : editTransaction 
              ? <><FaMoneyBillWave className="inline mr-2" /> Update Transaction</> 
              : formData.type === 'income' 
                ? <><FaMoneyBillWave className="inline mr-2" /> Add Income</>
                : <><FaCreditCard className="inline mr-2" /> Add Expense</>
          }
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;
