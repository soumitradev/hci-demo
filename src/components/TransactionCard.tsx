import React from 'react';
import { ShoppingBag, Receipt, Bus, Film, Coffee } from 'lucide-react';
import { Category } from '../stores/financeStore';

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
  'Food': { bg: 'bg-red-100', icon: 'text-red-500' },
  'Shopping': { bg: 'bg-amber-100', icon: 'text-amber-500' },
  'Transport': { bg: 'bg-blue-100', icon: 'text-blue-500' },
  'Entertainment': { bg: 'bg-purple-100', icon: 'text-purple-500' },
  'Others': { bg: 'bg-gray-100', icon: 'text-gray-500' },
};

export default function TransactionCard({ category, title, secondParty, amount, time }: TransactionCardProps) {
  const Icon = categoryIcons[category];
  const colors = categoryColors[category];

  return (
    <div className="bg-[#FCFCFC] rounded-2xl p-3">
      <div className="flex items-center gap-2">
        <div className={`w-[48px] h-[48px] ${colors.bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${colors.icon}`} />
        </div>
        
        <div className="flex-1 flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-[#2A2B2D] font-medium text-sm">{title}</span>
            <span className="text-[#919399] text-xs">{secondParty}</span>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <span className="text-red-500 font-medium text-sm">- ₹{amount}</span>
            <span className="text-[#919399] text-xs">{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 