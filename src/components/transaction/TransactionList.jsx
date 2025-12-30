import React, { useState } from 'react';
import TransactionItem from './TransactionItem';
import { deleteTransaction } from '../../services/transactionService';
import { toast } from 'react-toastify';

function TransactionList({ transactions, onEdit, loading }) {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      setDeleting(id);
      await deleteTransaction(id);
      toast.success('Transaction deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete transaction');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Transactions Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start by adding your first income or expense above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          📋 Recent Transactions
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {transactions.map(transaction => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default TransactionList;
