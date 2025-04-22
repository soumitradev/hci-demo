import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useFinanceStore, type TimePeriod, type Category } from '@/lib/financeStore';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

ChartJS.register(ArcElement, Tooltip, Legend);

// Category colors for consistent styling
const categoryColors: Record<Category, { bg: string, text: string, chart: string }> = {
  'Food': { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-500 dark:text-red-400', chart: 'rgb(239, 68, 68)' },
  'Shopping': { bg: 'bg-amber-100 dark:bg-amber-900/20', text: 'text-amber-500 dark:text-amber-400', chart: 'rgb(245, 158, 11)' },
  'Transport': { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-500 dark:text-blue-400', chart: 'rgb(59, 130, 246)' },
  'Entertainment': { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-500 dark:text-purple-400', chart: 'rgb(168, 85, 247)' },
  'Others': { bg: 'bg-slate-100 dark:bg-slate-900/20', text: 'text-slate-500 dark:text-slate-400', chart: 'rgb(107, 114, 128)' }
};

export const Route = createFileRoute('/finances/report')({
  component: RouteComponent,
  staticData: {
    title: 'Finance Report',
  },
})

function RouteComponent() {
  
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">

        <h2 className="text-xl text-foreground">Statistics</h2>

        {/* Time Period Selector */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button 
            onClick={() => setSelectedPeriod('day')}
            variant="ghost"
            className={`w-full text-foreground hover:text-foreground ${selectedPeriod === 'day' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
          >
            Week
          </Button>
          <Button 
            onClick={() => setSelectedPeriod('week')}
            variant="ghost"
            className={`w-full text-foreground hover:text-foreground ${selectedPeriod === 'week' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
          >
            Month
          </Button>
          <Button 
            onClick={() => setSelectedPeriod('month')}
            variant="ghost"
            className={`w-full text-foreground hover:text-foreground ${selectedPeriod === 'month' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
          >
            Year
          </Button>
        </div>

        {/* Bar Chart */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-5 gap-4">
              {barData.map((item, index) => {
                const maxValue = Math.max(...barData.map(d => d.value));
                const heightPercent = maxValue === 0 ? 0 : (item.value / maxValue) * 100;
                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div className="h-32 w-full flex items-end">
                      <div 
                        className="w-full transition-all duration-300 bg-primary"
                        style={{ 
                          height: `${heightPercent}%`, 
                          minHeight: item.value > 0 ? '4px' : '0',
                        }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                    <div className="text-sm font-medium text-foreground">₹{item.value}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <div className="mt-12">
          <h3 className="text-lg font-medium text-foreground">Category wise Spending</h3>
          <p className="text-muted-foreground text-sm">This month's expenses</p>

          <div className="mt-8 flex flex-col items-center">
            {/* Donut Chart */}
            <div className="relative w-48 h-48 mb-8">
              <Doughnut data={chartData} options={chartOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-sm text-muted-foreground">Total Spent</div>
                <div className="text-2xl font-semibold text-foreground">₹{totalSpent}</div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-3 justify-center">
              {Object.entries(monthlyReport).map(([category, amount]) => (
                amount > 0 && (
                  <div 
                    key={category}
                    className={`${categoryColors[category as Category].bg} px-4 py-2 rounded-full flex items-center gap-2 border`}
                  >
                    <span className={`text-sm font-medium ${categoryColors[category as Category].text}`}>{category}</span>
                    <span className={`text-sm font-medium ${categoryColors[category as Category].text}`}>₹{amount}</span>
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
