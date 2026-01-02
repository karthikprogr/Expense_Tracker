import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addTransaction } from '../../services/transactionService';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';
import { FaFileExport, FaFileImport, FaFileDownload, FaFileCsv } from 'react-icons/fa';

function ExportImport({ transactions }) {
  const { currentUser } = useAuth();
  const [importing, setImporting] = useState(false);

  // Export to CSV
  const handleExport = () => {
    if (!transactions || transactions.length === 0) {
      toast.warning('No transactions to export');
      return;
    }

    try {
      // Create CSV header
      const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
      
      // Create CSV rows
      const rows = transactions.map(t => [
        t.date,
        t.type,
        t.category,
        t.amount,
        t.description,
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => 
          row.map(cell => 
            typeof cell === 'string' && cell.includes(',') 
              ? `"${cell}"` 
              : cell
          ).join(',')
        ),
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const filename = `expense-tracker-${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${transactions.length} transactions!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export transactions');
    }
  };

  // Import from CSV
  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    try {
      setImporting(true);
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());

      // Skip header row
      const dataLines = lines.slice(1);
      
      if (dataLines.length === 0) {
        toast.warning('CSV file is empty');
        setImporting(false);
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (const line of dataLines) {
        try {
          // Parse CSV line (handle quoted fields)
          const fields = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
          const cleanFields = fields.map(f => f.replace(/^"|"$/g, '').trim());

          const [date, type, category, amount, description] = cleanFields;

          // Validate required fields
          if (!date || !type || !category || !amount) {
            console.warn('Missing required fields:', { date, type, category, amount });
            errorCount++;
            continue;
          }

          // Validate type
          if (type !== 'income' && type !== 'expense') {
            console.warn('Invalid type:', type);
            errorCount++;
            continue;
          }

          // Create transaction data
          const transactionData = {
            date,
            type,
            category,
            amount: parseFloat(amount),
            description: description || '',
          };

          // Add transaction with userId parameter
          await addTransaction(currentUser.uid, transactionData);
          successCount++;
        } catch (err) {
          console.error('Error importing line:', line, err);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} transaction${successCount !== 1 ? 's' : ''}!`);
      }
      
      if (errorCount > 0) {
        toast.warning(`Failed to import ${errorCount} transaction${errorCount !== 1 ? 's' : ''}`);
      }

      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import transactions: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  // Export as JSON (bonus feature)
  const handleExportJSON = () => {
    if (!transactions || transactions.length === 0) {
      toast.warning('No transactions to export');
      return;
    }

    try {
      const jsonContent = JSON.stringify(transactions, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const filename = `expense-tracker-${new Date().toISOString().split('T')[0]}.json`;
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${transactions.length} transactions as JSON!`);
    } catch (error) {
      console.error('JSON export error:', error);
      toast.error('Failed to export as JSON');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        💾 Export & Import Data
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Section */}
        <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">📤</span>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                Export Transactions
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Download your data as CSV or JSON
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleExport}
              disabled={!transactions || transactions.length === 0}
              className="w-full btn-primary bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
            >
              <FaFileCsv className="inline mr-2" /> Export as CSV
            </button>
            
            <button
              onClick={handleExportJSON}
              disabled={!transactions || transactions.length === 0}
              className="w-full btn-secondary border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400"
            >
              <FaFileDownload className="inline mr-2" /> Export as JSON
            </button>
          </div>

          <div className="mt-4 text-xs text-green-700 dark:text-green-300">
            ✓ {transactions?.length || 0} transactions ready to export
          </div>
        </div>

        {/* Import Section */}
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">📥</span>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Import Transactions
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Upload CSV file to import data
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block">
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                disabled={importing}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className={`w-full btn-primary bg-blue-600 hover:bg-blue-700 cursor-pointer inline-block text-center ${
                  importing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {importing ? (
                  <><FaFileImport className="inline mr-2" /> Importing...</>
                ) : (
                  <><FaFileImport className="inline mr-2" /> Choose CSV File</>
                )}
              </label>
            </label>
          </div>

          <div className="mt-4 text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <p className="font-semibold">CSV Format:</p>
            <p>Date, Type, Category, Amount, Description</p>
            <p className="text-blue-600 dark:text-blue-400">
              Type must be 'income' or 'expense'
            </p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
          ℹ️ Important Notes:
        </h4>
        <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
          <li>• Export creates a backup of all your transactions</li>
          <li>• Import adds new transactions (doesn't replace existing ones)</li>
          <li>• Duplicate transactions may be created if you import the same file twice</li>
          <li>• CSV format: Date (YYYY-MM-DD), Type (income/expense), Category, Amount, Description</li>
        </ul>
      </div>
    </div>
  );
}

export default ExportImport;
