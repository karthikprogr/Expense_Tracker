import React, { useState } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants';

function Filters({ onFilterChange, currentFilters }) {
  const [showFilters, setShowFilters] = useState(false);

  const handleTypeChange = (type) => {
    onFilterChange({ ...currentFilters, type });
  };

  const handleCategoryChange = (category) => {
    onFilterChange({ ...currentFilters, category });
  };

  const handleDateRangeChange = (range) => {
    const today = new Date();
    let startDate = '';
    
    switch(range) {
      case 'today':
        startDate = today.toISOString().split('T')[0];
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        startDate = weekAgo.toISOString().split('T')[0];
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        startDate = monthAgo.toISOString().split('T')[0];
        break;
      case 'year':
        const yearAgo = new Date(today);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        startDate = yearAgo.toISOString().split('T')[0];
        break;
      default:
        startDate = '';
    }
    
    onFilterChange({ 
      ...currentFilters, 
      dateRange: range,
      startDate,
      endDate: today.toISOString().split('T')[0]
    });
  };

  const handleCustomDateChange = (field, value) => {
    onFilterChange({ 
      ...currentFilters, 
      [field]: value,
      dateRange: 'custom'
    });
  };

  const clearFilters = () => {
    onFilterChange({
      type: 'all',
      category: 'all',
      dateRange: 'all',
      startDate: '',
      endDate: '',
    });
  };

  const hasActiveFilters = 
    currentFilters.type !== 'all' || 
    currentFilters.category !== 'all' || 
    currentFilters.dateRange !== 'all';

  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          🔍 Filters
        </h2>
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {showFilters ? '▲ Hide' : '▼ Show'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="space-y-6">
          {/* Transaction Type Filter */}
          <div>
            <label className="input-label">Transaction Type</label>
            <div className="grid grid-cols-3 gap-3">
              {['all', 'income', 'expense'].map(type => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`py-2 px-4 rounded-lg font-medium transition-all ${
                    currentFilters.type === type
                      ? type === 'income'
                        ? 'bg-green-500 text-white'
                        : type === 'expense'
                        ? 'bg-red-500 text-white'
                        : 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {type === 'all' ? '📊 All' : type === 'income' ? '💰 Income' : '💸 Expense'}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category-filter" className="input-label">
              Category
            </label>
            <select
              id="category-filter"
              value={currentFilters.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              <optgroup label="Income">
                {INCOME_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </optgroup>
              <optgroup label="Expense">
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="input-label">Date Range</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
              {['all', 'today', 'week', 'month', 'year'].map(range => (
                <button
                  key={range}
                  onClick={() => handleDateRangeChange(range)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    currentFilters.dateRange === range
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {range === 'all' ? 'All Time' : 
                   range === 'today' ? 'Today' :
                   range === 'week' ? 'This Week' :
                   range === 'month' ? 'This Month' : 'This Year'}
                </button>
              ))}
            </div>

            {/* Custom Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="start-date" className="text-xs text-gray-600 dark:text-gray-400">
                  From
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={currentFilters.startDate}
                  onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label htmlFor="end-date" className="text-xs text-gray-600 dark:text-gray-400">
                  To
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={currentFilters.endDate}
                  onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Active Filters:
              </p>
              <div className="flex flex-wrap gap-2">
                {currentFilters.type !== 'all' && (
                  <span className="px-2 py-1 bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100 text-xs rounded">
                    Type: {currentFilters.type}
                  </span>
                )}
                {currentFilters.category !== 'all' && (
                  <span className="px-2 py-1 bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100 text-xs rounded">
                    Category: {currentFilters.category}
                  </span>
                )}
                {currentFilters.dateRange !== 'all' && (
                  <span className="px-2 py-1 bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100 text-xs rounded">
                    Date: {currentFilters.dateRange}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Filters;
