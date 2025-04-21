import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, AlertCircle, ArrowLeft, Pencil } from 'lucide-react';
import { useFinanceStore, Category } from '../stores/financeStore';
import EditBudgetModal from '../components/EditBudgetModal';

const categoryColors: Record<Category, { bg: string, dot: string }> = {
  'Food': { bg: 'bg-amber-100', dot: 'bg-amber-500' },
  'Entertainment': { bg: 'bg-purple-100', dot: 'bg-purple-500' },
  'Shopping': { bg: 'bg-blue-100', dot: 'bg-blue-500' },
  'Transport': { bg: 'bg-green-100', dot: 'bg-green-500' },
  'Others': { bg: 'bg-gray-100', dot: 'bg-gray-500' }
};

export default function Budget() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [currentBudget, setCurrentBudget] = useState(0);
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

  const handleEditBudget = (category: Category) => {
    setEditingCategory(category);
    setCurrentBudget(categoryBudgets[category]);
    setIsModalOpen(true);
  };

  const handleUpdateBudget = (category: Category, newBudget: number) => {
    // Update the budget in the store
    useFinanceStore.getState().setCategoryBudget(category, newBudget);
  };

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
          <h1 className="text-4xl font-bold text-gray-900">Finances</h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Budget</h2>

        {/* Month Selector */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={prevMonth}
            className="p-2 text-[#7F3DFF] hover:bg-purple-50 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-lg text-[#7F3DFF] font-medium">{monthName}</span>
          <button 
            onClick={nextMonth}
            className="p-2 text-[#7F3DFF] hover:bg-purple-50 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Budget Cards */}
        <div className="space-y-4">
          {Object.entries(categoryBudgets).map(([category, budget]) => {
            const spent = monthlyReport[category as Category];
            const remaining = budget - spent;
            const progress = (spent / budget) * 100;
            const isOverBudget = spent > budget;

            return (
              <div key={category} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${categoryColors[category as Category].bg}`}>
                    <div className={`w-3.5 h-3.5 rounded-full ${categoryColors[category as Category].dot}`} />
                    <span className="text-sm text-gray-900">{category}</span>
                  </div>
                  {isOverBudget && (
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  )}
                  <button 
                    onClick={() => handleEditBudget(category as Category)} 
                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-gray-900">
                    Remaining ₹{Math.max(0, remaining).toLocaleString()}
                  </h3>

                  {/* Progress Bar */}
                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${
                        isOverBudget ? 'bg-red-500' : categoryColors[category as Category].dot
                      }`}
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>

                  <div className="text-sm text-gray-500">
                    ₹{spent.toLocaleString()} of ₹{budget.toLocaleString()}
                  </div>

                  {isOverBudget && (
                    <p className="text-sm text-red-500">
                      You've exceeded the limit!
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Budget Modal */}
      <EditBudgetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        category={editingCategory || ''} 
        currentBudget={currentBudget} 
        onUpdate={handleUpdateBudget} 
      />
    </div>
  );
} 