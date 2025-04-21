import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFinanceStore, TimePeriod, Category } from '../stores/financeStore';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// Category colors for consistent styling
const categoryColors: Record<Category, { bg: string, text: string, chart: string }> = {
  'Food': { bg: 'bg-red-200', text: 'text-red-500', chart: 'rgb(252, 165, 165)' },
  'Shopping': { bg: 'bg-amber-200', text: 'text-amber-500', chart: 'rgb(252, 211, 77)' },
  'Transport': { bg: 'bg-blue-200', text: 'text-blue-500', chart: 'rgb(147, 197, 253)' },
  'Entertainment': { bg: 'bg-purple-200', text: 'text-purple-500', chart: 'rgb(216, 180, 254)' },
  'Others': { bg: 'bg-gray-200', text: 'text-gray-500', chart: 'rgb(209, 213, 219)' }
};

export default function FinanceReport() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('day');

  const calculateBarGraphs = useFinanceStore(state => state.calculateBarGraphs);
  const calculateMonthlyReport = useFinanceStore(state => state.calculateMonthlyReport);

  const barData = calculateBarGraphs(selectedPeriod);
  const monthlyReport = calculateMonthlyReport(new Date());
  const totalSpent = Object.values(monthlyReport).reduce((sum, val) => sum + val, 0);

  // Prepare data for the donut chart
  const chartData = {
    labels: Object.entries(monthlyReport)
      .filter(([_, amount]) => amount > 0)
      .map(([category]) => category),
    datasets: [{
      data: Object.entries(monthlyReport)
        .filter(([_, amount]) => amount > 0)
        .map(([_, amount]) => amount),
      backgroundColor: Object.entries(monthlyReport)
        .filter(([_, amount]) => amount > 0)
        .map(([category]) => categoryColors[category as Category].chart),
      borderWidth: 0,
      spacing: 2
    }]
  };

  const chartOptions = {
    cutout: '75%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    responsive: true,
    maintainAspectRatio: true
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-8">
          <button 
            onClick={() => navigate('/finance')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Finances</h1>
        </div>

        <h2 className="text-xl text-gray-900">Statistics</h2>

        {/* Time Period Selector */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button 
            onClick={() => setSelectedPeriod('day')}
            className={selectedPeriod === 'day' 
              ? 'px-4 py-1.5 rounded-lg bg-[#613EF8] text-white text-sm w-full'
              : 'px-4 py-1.5 rounded-lg text-gray-600 text-sm w-full'
            }
          >
            Day
          </button>
          <button 
            onClick={() => setSelectedPeriod('week')}
            className={selectedPeriod === 'week'
              ? 'px-4 py-1.5 rounded-lg bg-[#613EF8] text-white text-sm w-full'
              : 'px-4 py-1.5 rounded-lg text-gray-600 text-sm w-full'
            }
          >
            Week
          </button>
          <button 
            onClick={() => setSelectedPeriod('month')}
            className={selectedPeriod === 'month'
              ? 'px-4 py-1.5 rounded-lg bg-[#613EF8] text-white text-sm w-full'
              : 'px-4 py-1.5 rounded-lg text-gray-600 text-sm w-full'
            }
          >
            Month
          </button>
        </div>

        {/* Bar Chart */}
        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-5 gap-4">
            {barData.map((item, index) => {
              const maxValue = Math.max(...barData.map(d => d.value));
              const heightPercent = maxValue === 0 ? 0 : (item.value / maxValue) * 100;
              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div className="h-32 w-full flex items-end">
                    <div 
                      className="w-full bg-[#613EF8] rounded-t-lg transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                  <div className="text-sm text-gray-600">₹{item.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="mt-12">
          <h3 className="text-lg font-medium text-gray-900">Category wise Spending</h3>
          <p className="text-gray-500 text-sm">This month's expenses</p>

          <div className="mt-8 flex flex-col items-center">
            {/* Donut Chart */}
            <div className="relative w-48 h-48 mb-8">
              <Doughnut data={chartData} options={chartOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-sm text-gray-600">Total Spent</div>
                <div className="text-2xl font-semibold">₹{totalSpent}</div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-3 justify-center">
              {Object.entries(monthlyReport).map(([category, amount]) => (
                amount > 0 && (
                  <div 
                    key={category}
                    className={`${categoryColors[category as Category].bg} px-4 py-2 rounded-full flex items-center gap-2`}
                  >
                    <span className="text-sm">{category}</span>
                    <span className="text-sm">₹{amount}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 