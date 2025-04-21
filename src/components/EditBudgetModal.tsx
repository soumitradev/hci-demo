import React, { useState } from 'react';
import { X } from 'lucide-react';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  currentBudget: number;
  onUpdate: (category: string, newBudget: number) => void;
}

const EditBudgetModal: React.FC<EditBudgetModalProps> = ({ isOpen, onClose, category, currentBudget, onUpdate }) => {
  const [newBudget, setNewBudget] = useState(currentBudget);
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [threshold, setThreshold] = useState(80);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(category, newBudget);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm rounded-xl bg-white/90 p-8 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Budget for {category}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                Budget Amount
              </label>
              <span className="text-sm text-gray-500">
                Current: ₹{currentBudget.toLocaleString()}
              </span>
            </div>
            <input
              type="number"
              id="budget"
              value={newBudget}
              onChange={(e) => setNewBudget(parseFloat(e.target.value))}
              className="block w-full rounded-lg border-gray-300 bg-white/50 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={alertEnabled}
                onChange={() => setAlertEnabled(!alertEnabled)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">Receive Alert</span>
            </label>
          </div>

          {alertEnabled && (
            <div className="space-y-2">
              <label htmlFor="threshold" className="block text-sm font-medium text-gray-700">
                Alert Threshold
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id="threshold"
                  min="0"
                  max="100"
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">{threshold}%</span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Update Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBudgetModal;