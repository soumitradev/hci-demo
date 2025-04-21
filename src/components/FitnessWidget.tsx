import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface FitnessWidgetProps {
  steps: number;
  goal: number;
}

export default function FitnessWidget({ steps, goal }: FitnessWidgetProps) {
  const navigate = useNavigate();
  const progress = Math.round((steps / goal) * 100);

  return (
    <div 
      className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate('/fitness')}
    >
      <h2 className="text-base font-medium text-gray-900">Fitness</h2>
      <div className="flex flex-col items-center mt-2">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#9333EA"
              strokeWidth="3"
              strokeDasharray={`${progress}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base font-medium text-gray-900">{progress}%</span>
            <span className="text-xs text-gray-500 mt-0.5">Steps</span>
          </div>
        </div>
        <button 
          className="mt-3 text-xs text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/fitness');
          }}
        >
          View All
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
} 