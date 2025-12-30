import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';

function TransactionItem({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'income';
  
  const getCategoryIcon = (category) => {
    const icons = {
      // Income
      Salary: '💼',
      Freelance: '💻',
      Investment: '📈',
      Gift: '🎁',
      Other: '💵',
      
      // Expense
      Food: '🍔',
      Transport: '�',
      Transportation: '💰',
      Shopping: '🛍️',
      Entertainment: '🎮',
      Bills: '📄',
      Healthcare: '🏥',
      Education: '📚',
      Travel: '✈️',
      Rent: '🏠',
    };
    return icons[category] || '💰';
  };

  return (
    <div className={`flex items-start sm:items-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 ${
      isIncome ? 'border-green-500' : 'border-red-500'
    }`}>
      {/* Icon - Mobile & Desktop */}
      <div className="flex-shrink-0 mr-3">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl sm:text-3xl">
          {getCategoryIcon(transaction.category)}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0 mr-2">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white truncate">
          {transaction.description}
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {transaction.category}
          </span>
          <span className="hidden sm:inline text-sm text-gray-400 dark:text-gray-500">•</span>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {formatDate(transaction.date)}
          </span>
        </div>
      </div>

      {/* Amount & Actions Section */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 flex-shrink-0">
        <div className={`text-base sm:text-lg font-bold whitespace-nowrap ${
          isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={() => onEdit(transaction)}
            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
            title="Edit transaction"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
            title="Delete transaction"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionItem;
