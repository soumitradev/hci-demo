import { ChevronDown, ChevronRight, ChevronUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFinanceStore } from '../stores/financeStore';
import TransactionCard from '../components/TransactionCard';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';

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
    <div className="min-h-screen bg-background pb-20">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-4xl font-bold text-foreground mb-6">Finances</h1>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Overview</h2>
          <Button 
            variant="secondary"
            onClick={() => navigate('/finance/report')}
            className="gap-2"
          >
            See Report
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Spending Card */}
        <Card className="mt-2 bg-gradient-to-br from-primary to-primary/80">
          <CardContent className="p-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-primary-foreground/80 text-sm">This Month</span>
                <div className="mt-0.5">
                  <span className="text-2xl text-primary-foreground font-medium">₹{currentMonthSpending.toLocaleString()}</span>
                  <span className="text-lg text-primary-foreground/60 ml-1">/ ₹{totalBudget.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  {percentageChange > 0 ? (
                    <>
                      <ChevronDown className="text-destructive w-4 h-4" />
                      <span className="text-destructive text-sm">+{Math.abs(percentageChange).toFixed(1)}%</span>
                    </>
                  ) : (
                    <>
                      <ChevronUp className="text-emerald-400 w-4 h-4" />
                      <span className="text-emerald-400 text-sm">-{Math.abs(percentageChange).toFixed(1)}%</span>
                    </>
                  )}
                </div>
                <span className="text-primary-foreground/60 text-xs">vs. last month</span>
              </div>
            </div>

            <div className="mt-2 text-primary-foreground/80 text-xs">
              Projected: ₹{Math.round(projectedMonthTotal).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-medium text-foreground">Recent Transactions</h3>
            <Button 
              onClick={() => navigate('/finance/transactions')}
              variant="secondary"
              size="sm"
            >
              See All
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {Object.entries(groupedTransactions).map(([date, transactions]) => (
              <div key={date} className="flex flex-col gap-2">
                <h4 className="text-sm font-medium text-muted-foreground px-1">
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
        <div className="mt-3">
          <Button 
            onClick={() => navigate('/finance/budget')}
            variant="secondary"
            className="w-full justify-between"
          >
            <span>See your budget</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </main>

      <Navbar />
    </div>
  );
} 