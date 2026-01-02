import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { 
  calculateTotalIncome, 
  calculateTotalExpenses, 
  calculateNetBalance 
} from '../../utils/calculations';
import { FaMoneyBillWave, FaArrowUp, FaArrowDown, FaCreditCard } from 'react-icons/fa';

function BalanceSummary({ transactions }) {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const netBalance = calculateNetBalance(transactions);

  const cards = [
    {
      title: 'Total Income',
      amount: totalIncome,
      icon: <FaMoneyBillWave className="text-green-600 dark:text-green-400" />,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900',
      textColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-700',
    },
    {
      title: 'Total Expenses',
      amount: totalExpenses,
      icon: <FaCreditCard className="text-red-600 dark:text-red-400" />,
      color: 'red',
      bgColor: 'bg-red-50 dark:bg-red-900',
      textColor: 'text-red-600 dark:text-red-400',
      borderColor: 'border-red-200 dark:border-red-700',
    },
    {
      title: 'Net Balance',
      amount: netBalance,
      icon: netBalance >= 0 ? <FaArrowUp className="text-blue-600 dark:text-blue-400" /> : <FaArrowDown className="text-orange-600 dark:text-orange-400" />,
      color: netBalance >= 0 ? 'blue' : 'orange',
      bgColor: netBalance >= 0 
        ? 'bg-blue-50 dark:bg-blue-900' 
        : 'bg-orange-50 dark:bg-orange-900',
      textColor: netBalance >= 0 
        ? 'text-blue-600 dark:text-blue-400' 
        : 'text-orange-600 dark:text-orange-400',
      borderColor: netBalance >= 0 
        ? 'border-blue-200 dark:border-blue-700' 
        : 'border-orange-200 dark:border-orange-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} ${card.borderColor} border-2 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h3 className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
              {card.title}
            </h3>
            <span className="text-2xl md:text-3xl">{card.icon}</span>
          </div>
          
          <div className={`text-2xl md:text-3xl font-extrabold ${card.textColor}`}>
            {formatCurrency(Math.abs(card.amount))}
          </div>

          {card.title === 'Net Balance' && (
            <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                {netBalance >= 0 
                  ? '✅ You\'re in positive balance!' 
                  : '⚠️ Expenses exceed income'
                }
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default BalanceSummary;
