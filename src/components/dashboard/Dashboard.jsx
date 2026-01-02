import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTransactions } from '../../services/transactionService';
import BalanceSummary from './BalanceSummary';
import TransactionForm from '../transaction/TransactionForm';
import TransactionList from '../transaction/TransactionList';
import Filters from '../filters/Filters';
import Charts from '../charts/Charts';
import ExportImport from '../settings/ExportImport';
import Settings from '../settings/Settings';
import { FaHome, FaChartBar, FaFileExport, FaCog, FaWallet, FaBriefcase } from 'react-icons/fa';

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    dateRange: 'all',
    startDate: '',
    endDate: '',
  });

  // Load transactions
  useEffect(() => {
    if (!currentUser) return;

    // Set a timeout to show offline message if data doesn't load
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        console.warn('Taking too long to load data - possible network issue');
      }
    }, 10000); // 10 seconds timeout

    const unsubscribe = getTransactions(currentUser.uid, (data) => {
      setTransactions(data);
      setLoading(false);
      clearTimeout(timeoutId);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [currentUser]);

  // Apply filters
  useEffect(() => {
    let filtered = [...transactions];

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(t => t.date >= filters.startDate);
    }
    if (filters.endDate) {
      filtered = filtered.filter(t => t.date <= filters.endDate);
    }

    setFilteredTransactions(filtered);
  }, [transactions, filters]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleTransactionSuccess = () => {
    setEditingTransaction(null);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome />, shortLabel: 'Dashboard', color: 'text-blue-600' },
    { id: 'analytics', label: 'Analytics', icon: <FaChartBar />, shortLabel: 'Analytics', color: 'text-green-600' },
    { id: 'export', label: 'Export/Import', icon: <FaFileExport />, shortLabel: 'Export', color: 'text-purple-600' },
    { id: 'settings', label: 'Settings', icon: <FaCog />, shortLabel: 'Settings', color: 'text-orange-600' },
  ];

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8 animate-bounce">
            <div className="inline-block bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-2xl shadow-2xl">
              <FaWallet className="text-6xl text-white" />
            </div>
          </div>
          
          {/* App Name */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Expense Tracker
          </h1>
          
          {/* Loading Spinner */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          
          {/* Loading Text */}
          <p className="text-gray-600 dark:text-gray-400 text-lg animate-pulse">
            Loading your financial data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 dark:bg-gray-900 shadow-xl sticky top-0 z-50 border-b-2 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-lg shadow-lg">
                <FaWallet className="text-2xl text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-white leading-tight">
                  Expense Tracker
                </h1>
                <p className="text-xs text-gray-400">
                  Track. Analyze. Save.
                </p>
              </div>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block bg-gray-700 px-4 py-2.5 rounded-lg">
                <p className="text-sm font-semibold text-white leading-tight">
                  {currentUser?.displayName || 'Seelam Karthik'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {currentUser?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-md whitespace-nowrap"
                title="Logout"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs - Desktop only */}
          <div className="hidden md:flex gap-2 overflow-x-auto pb-3 -mt-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Balance Summary */}
            <BalanceSummary transactions={filteredTransactions} />

            {/* Filters */}
            <Filters 
              onFilterChange={setFilters}
              currentFilters={filters}
            />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Transaction Form */}
              <div className="lg:col-span-1">
                <TransactionForm
                  editTransaction={editingTransaction}
                  onSuccess={handleTransactionSuccess}
                  onCancel={() => setEditingTransaction(null)}
                />
              </div>

              {/* Transaction List */}
              <div className="lg:col-span-2">
                <TransactionList
                  transactions={filteredTransactions}
                  onEdit={handleEditTransaction}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <Charts transactions={filteredTransactions} />
          </div>
        )}

        {activeTab === 'export' && (
          <ExportImport transactions={transactions} />
        )}

        {activeTab === 'settings' && (
          <Settings />
        )}
      </main>

      {/* Footer */}
      <footer className="hidden md:block bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              <FaBriefcase className="inline mr-2" />
              <strong>Expense Tracker</strong> - UM Internship Project
            </p>
            <p>
              Built with React + Firebase | Full Stack JavaScript (MERN)
            </p>
            <div className="mt-3 flex justify-center space-x-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
                ✓ {transactions.length} Transactions
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                ✓ Real-time Sync
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-xs">
                ✓ Secure
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-pb">
        <div className="grid grid-cols-4 h-16">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.shortLabel}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default Dashboard;
