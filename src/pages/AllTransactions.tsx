import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFinanceStore } from '../stores/financeStore';
import TransactionCard from '../components/TransactionCard';
import Navbar from '../components/Navbar';

export default function AllTransactions() {
  const navigate = useNavigate();
  const transactions = useFinanceStore(state => state.transactions);

  // Sort transactions by date, most recent first
  const sortedTransactions = [...transactions].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

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
  const groupedTransactions = sortedTransactions.reduce((groups, transaction) => {
    const date = transaction.timestamp.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, typeof sortedTransactions>);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-2 mb-8">
          <button 
            onClick={() => navigate('/finance')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Transactions</h1>
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

      <Navbar />
    </div>
  );
} 