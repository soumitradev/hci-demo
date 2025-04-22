import React from 'react';
import { ShoppingBag, Receipt, Bus, Film, Coffee } from 'lucide-react';
import { type Category } from '@/lib/financeStore';
import { Card, CardContent } from './ui/card';

interface TransactionCardProps {
  category: Category;
  title: string;
  secondParty: string;
  amount: number;
  time: string;
}

const categoryIcons: Record<Category, React.ComponentType<any>> = {
  'Food': Coffee,
  'Shopping': ShoppingBag,
  'Transport': Bus,
  'Entertainment': Film,
  'Others': Receipt,
};

const categoryColors: Record<Category, { bg: string, icon: string }> = {
  'Food': { bg: 'bg-red-100 dark:bg-red-900/20', icon: 'text-red-500 dark:text-red-400' },
  'Shopping': { bg: 'bg-amber-100 dark:bg-amber-900/20', icon: 'text-amber-500 dark:text-amber-400' },
  'Transport': { bg: 'bg-blue-100 dark:bg-blue-900/20', icon: 'text-blue-500 dark:text-blue-400' },
  'Entertainment': { bg: 'bg-violet-100 dark:bg-violet-900/20', icon: 'text-violet-500 dark:text-violet-400' },
  'Others': { bg: 'bg-slate-100 dark:bg-slate-900/20', icon: 'text-slate-500 dark:text-slate-400' },
};

export default function TransactionCard({ category, title, secondParty, amount, time }: TransactionCardProps) {
  const Icon = categoryIcons[category];
  const colors = categoryColors[category];

  return (
    <Card className="bg-card">
      <CardContent className="p-2">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${colors.icon}`} />
          </div>
          
          <div className="flex-1 flex justify-between items-center">
            <div className="flex flex-col gap-0.5">
              <span className="text-foreground font-medium text-sm">{title}</span>
              <span className="text-muted-foreground text-xs">{secondParty}</span>
            </div>
            
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-destructive font-medium text-sm">- ₹{amount}</span>
              <span className="text-muted-foreground text-xs">{time}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}