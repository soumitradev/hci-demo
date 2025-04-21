import { ChevronDown, ChevronRight, ChevronUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFinanceStore } from '../stores/financeStore';
import TransactionCard from '../components/TransactionCard';
import Navbar from '../components/Navbar';

export default function Finance() {
  const navigate = useNavigate();
  const currentMonthSpending = useFinanceStore(state => state.calculateCurrentMonthSpending());
  const lastMonthSpending = useFinanceStore(state => state.calculateLastMonthSpending());
  const totalBudget = useFinanceStore(state => state.getTotalBudget());
  const transactions = useFinanceStore(state => state.transactions);

  // Calculate daily spending rates and projected monthly total
  const now = new Date();
  const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const currentDailyRate = currentMonthSpending / dayOfMonth;
  const projectedMonthTotal = currentDailyRate * daysInCurrentMonth;

  const daysInLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  const lastMonthDailyRate = lastMonthSpending / daysInLastMonth;

  // Calculate percentage change in daily spending rate
  const percentageChange = lastMonthDailyRate === 0 
    ? 100 // If last month was 0, treat as 100% increase
    : ((currentDailyRate - lastMonthDailyRate) / lastMonthDailyRate) * 100;

  // Get last 3 transactions, sorted by most recent
  const recentTransactions = [...transactions]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 3);

  // Format time to AM/PM
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Group transactions by date
  const groupedTransactions = recentTransactions.reduce((groups, transaction) => {
    const date = transaction.timestamp.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, typeof recentTransactions>);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Finances</h1>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
          <button 
            onClick={() => navigate('/finance/report')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            See Report
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Spending Card */}
        <div className="mt-4 bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-4 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[336px] h-[45px] bg-purple-500/30 blur-3xl" />
          
          <div className="relative">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-white/80 text-sm">This Month</span>
                <div className="mt-1">
                  <span className="text-2xl text-white font-medium">₹{currentMonthSpending.toLocaleString()}</span>
                  <span className="text-lg text-white/60 ml-1">/ ₹{totalBudget.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  {percentageChange > 0 ? (
                    <>
                      <ChevronDown className="text-red-200 w-4 h-4" />
                      <span className="text-red-200 text-sm">+{Math.abs(percentageChange).toFixed(1)}%</span>
                    </>
                  ) : (
                    <>
                      <ChevronUp className="text-green-200 w-4 h-4" />
                      <span className="text-green-200 text-sm">-{Math.abs(percentageChange).toFixed(1)}%</span>
                    </>
                  )}
                </div>
                <span className="text-white/60 text-xs">vs. last month</span>
              </div>
            </div>

            <div className="mt-3 text-white/80 text-xs">
              Projected: ₹{Math.round(projectedMonthTotal).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-medium text-[#2A2B2D]">Recent Transactions</h3>
            <button 
              onClick={() => navigate('/finance/transactions')}
              className="px-3 py-1.5 bg-purple-100 text-purple-600 rounded-full text-sm hover:bg-purple-200 transition-colors"
            >
              See All
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {Object.entries(groupedTransactions).map(([date, transactions]) => (
              <div key={date} className="flex flex-col gap-3">
                <h4 className="text-sm font-medium text-gray-500 px-1">
                  {formatDate(new Date(date))}
                </h4>
                {transactions.map(transaction => (
                  <TransactionCard
                    key={transaction.id}
                    category={transaction.category}
                    title={transaction.category}
                    secondParty={transaction.secondParty}
                    amount={transaction.amount}
                    time={formatTime(transaction.timestamp)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 flex flex-col gap-3">
          <button 
            onClick={() => navigate('/finance/budget')}
            className="w-full p-3 bg-purple-100 rounded-lg flex justify-between items-center hover:bg-purple-200 transition-colors"
          >
            <span className="text-purple-600">See your budget</span>
            <ChevronRight className="text-purple-600" />
          </button>
        </div>
      </div>

      <Navbar />
    </div>
  );
} 