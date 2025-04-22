import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, Pencil } from 'lucide-react';
import { useFinanceStore, type Category } from '@/lib/financeStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const categoryColors: Record<Category, { bg: string, dot: string, text: string, progress: string }> = {
  'Food': { 
    bg: 'bg-red-100 dark:bg-red-900/20', 
    dot: 'bg-red-500 dark:bg-red-400',
    text: 'text-red-500 dark:text-red-400',
    progress: '[&>div]:bg-red-500 dark:[&>div]:bg-red-400'
  },
  'Entertainment': { 
    bg: 'bg-purple-100 dark:bg-purple-900/20', 
    dot: 'bg-purple-500 dark:bg-purple-400',
    text: 'text-purple-500 dark:text-purple-400',
    progress: '[&>div]:bg-purple-500 dark:[&>div]:bg-purple-400'
  },
  'Shopping': { 
    bg: 'bg-amber-100 dark:bg-amber-900/20', 
    dot: 'bg-amber-500 dark:bg-amber-400',
    text: 'text-amber-500 dark:text-amber-400',
    progress: '[&>div]:bg-amber-500 dark:[&>div]:bg-amber-400'
  },
  'Transport': { 
    bg: 'bg-blue-100 dark:bg-blue-900/20', 
    dot: 'bg-blue-500 dark:bg-blue-400',
    text: 'text-blue-500 dark:text-blue-400',
    progress: '[&>div]:bg-blue-500 dark:[&>div]:bg-blue-400'
  },
  'Others': { 
    bg: 'bg-slate-100 dark:bg-slate-900/20', 
    dot: 'bg-slate-500 dark:bg-slate-400',
    text: 'text-slate-500 dark:text-slate-400',
    progress: '[&>div]:bg-slate-500 dark:[&>div]:bg-slate-400'
  }
};

export const Route = createFileRoute('/finances/budget')({
  component: RouteComponent,
})

function RouteComponent() {
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const categoryBudgets = useFinanceStore(state => state.categoryBudgets);
  const calculateMonthlyReport = useFinanceStore(state => state.calculateMonthlyReport);
  
  const monthlyReport = useMemo(() => 
    calculateMonthlyReport(currentMonth),
    [calculateMonthlyReport, currentMonth]
  );

  const monthName = currentMonth.toLocaleString('default', { month: 'short' });

  const nextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const prevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };


  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Month Selector */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={prevMonth}
            variant="ghost"
            size="icon"
            className="rounded-full text-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <span className="text-lg font-medium text-foreground">{monthName}</span>
          <Button 
            onClick={nextMonth}
            variant="ghost"
            size="icon"
            className="rounded-full text-foreground hover:text-foreground"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Budget Cards */}
        <div className="space-y-4">
          {Object.entries(categoryBudgets).map(([category, budget]) => {
            const spent = monthlyReport[category as Category];
            const remaining = budget - spent;
            const progress = (spent / budget) * 100;
            const isOverBudget = spent > budget;

            return (
              <div key={category} className="bg-card rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${categoryColors[category as Category].bg}`}>
                    <div className={`w-3.5 h-3.5 rounded-full ${categoryColors[category as Category].dot}`} />
                    <span className="text-sm text-foreground">{category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOverBudget && (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                    <Button 
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-foreground hover:text-foreground"
                    >
                      <Pencil className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-foreground">
                    Remaining ₹{Math.max(0, remaining).toLocaleString()}
                  </h3>

                  {/* Progress Bar */}
                  <Progress 
                    value={Math.min(100, progress)}
                    className={`${isOverBudget ? 'bg-destructive/20' : categoryColors[category as Category].bg} ${isOverBudget ? '[&>div]:bg-destructive' : categoryColors[category as Category].progress}`}
                  />

                  <div className="text-sm text-muted-foreground">
                    ₹{spent.toLocaleString()} of ₹{budget.toLocaleString()}
                  </div>

                  {isOverBudget && (
                    <p className="text-sm text-destructive">
                      You've exceeded the limit!
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
