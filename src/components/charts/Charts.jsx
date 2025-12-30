import React from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { groupByCategory, getMonthlyData } from '../../utils/calculations';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

function Charts({ transactions }) {
  // Filter only expenses for pie chart
  const expenses = transactions.filter(t => t.type === 'expense');
  const categoryData = groupByCategory(expenses);
  
  // Prepare pie chart data
  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(categoryData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
          'rgba(255, 99, 255, 0.8)',
        ],
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Prepare line chart data
  const monthlyData = getMonthlyData(transactions);
  
  const lineChartData = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(d => d.income),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: monthlyData.map(d => d.expenses),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          },
        },
      },
    },
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Data to Display
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add some transactions to see your financial charts
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Expense Distribution Pie Chart */}
      {expenses.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            📊 Expense Distribution by Category
          </h2>
          <div className="h-80">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      )}

      {/* Monthly Trends Line Chart */}
      {monthlyData.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            📈 Monthly Income vs Expenses
          </h2>
          <div className="h-80">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Income</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                ${(monthlyData.reduce((sum, d) => sum + d.income, 0) / monthlyData.length).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Expenses</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                ${(monthlyData.reduce((sum, d) => sum + d.expenses, 0) / monthlyData.length).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Best Month</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {monthlyData.reduce((max, d) => d.income > max.income ? d : max, monthlyData[0])?.month}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Tracking</p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {monthlyData.length} months
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Charts;
