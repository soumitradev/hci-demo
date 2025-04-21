import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fitnessStats } from '../data/fitnessData';

const getProgressMessage = (statType: string, value: number, goal: number): { message: string; subtext: string } => {
  const progress = (value / goal) * 100;
  
  switch (statType) {
    case 'sleep':
      if (progress >= 100) return { 
        message: "Perfect Sleep Schedule!", 
        subtext: "Keep maintaining 8 hours of sleep" 
      };
      if (progress >= 90) return { 
        message: "Almost There!", 
        subtext: "Just a few more minutes of sleep" 
      };
      return { 
        message: "Room for Improvement", 
        subtext: `${(goal - value).toFixed(1)} more hours for ideal sleep` 
      };

    case 'steps':
      if (progress >= 100) return { 
        message: "Goal Achieved!", 
        subtext: "You've hit your daily step goal" 
      };
      if (progress >= 75) return { 
        message: "Keep Going!", 
        subtext: `${goal - value} steps to go` 
      };
      return { 
        message: "Time to Move", 
        subtext: `${goal - value} steps remaining today` 
      };

    case 'water':
      if (progress >= 100) return { 
        message: "Well Hydrated!", 
        subtext: "You've met your water intake goal" 
      };
      if (progress >= 75) return { 
        message: "Almost There!", 
        subtext: `${(goal - value).toFixed(1)}L more to go` 
      };
      return { 
        message: "Stay Hydrated", 
        subtext: `${(goal - value).toFixed(1)}L remaining today` 
      };

    case 'heart':
      // For heart rate, we want to be within a healthy range (60-100 bpm)
      if (value >= 60 && value <= 100) return { 
        message: "Healthy Heart Rate", 
        subtext: "Your heart rate is in the normal range" 
      };
      if (value < 60) return { 
        message: "Athletic Heart Rate", 
        subtext: "Your heart rate is lower than average" 
      };
      return { 
        message: "Elevated Heart Rate", 
        subtext: "Consider some relaxation techniques" 
      };

    default:
      return { message: "", subtext: "" };
  }
};

const getProgressPercentage = (statType: string, value: number, goal: number): number => {
  switch (statType) {
    case 'heart':
      // For heart rate, calculate how close we are to the optimal range
      const minHealthy = 60;
      const maxHealthy = 100;
      if (value >= minHealthy && value <= maxHealthy) return 100;
      if (value < minHealthy) return (value / minHealthy) * 100;
      return Math.max(100 - ((value - maxHealthy) / 20) * 100, 0);
    default:
      // For other stats, calculate percentage of goal achieved
      return Math.min((value / goal) * 100, 100);
  }
};

const StatDetail: React.FC = () => {
  const navigate = useNavigate();
  const { statType } = useParams<{ statType: string }>();
  
  if (!statType || !fitnessStats[statType]) {
    return null;
  }

  const { title, data, unit, color, goal } = fitnessStats[statType];
  const progress = getProgressPercentage(statType, data.value, goal);
  const { message, subtext } = getProgressMessage(statType, data.value, goal);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-8">
          <button 
            onClick={() => navigate('/fitness')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Fitness</h1>
        </div>

        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {/* Main Stats Card */}
        <div className={`${color} rounded-xl p-6 text-white mb-6`}>
          <div className="text-center mb-4">
            <p className="text-lg font-medium">{message}</p>
            <p className="text-sm opacity-90">{subtext}</p>
          </div>

          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-white/20"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-white"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 251.2,
                  strokeDashoffset: 251.2 - (progress / 100) * 251.2,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold">{progress.toFixed(0)}%</span>
              <span className="text-sm mt-1">of goal</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-medium">
              {statType === 'steps' 
                ? `${(data.value / 1000).toFixed(1)}K / ${(goal / 1000).toFixed(1)}K`
                : statType === 'heart'
                ? `${Math.round(data.value)}${unit} / ${goal}${unit}`
                : statType === 'sleep'
                ? `${data.value.toFixed(1)}hrs / ${goal}hrs`
                : `${data.value.toFixed(1)}${unit} / ${goal}${unit}`
              }
            </p>
          </div>
        </div>

        {/* Overview Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600">Weekly Change</p>
              <p className={`text-xl font-bold ${data.weeklyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {data.weeklyChange >= 0 ? '+' : ''}{data.weeklyChange}%
              </p>
              <div className={`h-20 mt-2 ${data.weeklyChange >= 0 ? 'bg-green-50' : 'bg-red-50'} rounded-lg relative overflow-hidden`}>
                <div className={`absolute bottom-0 left-0 w-full h-12 ${data.weeklyChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    <path
                      d="M0,50 Q25,30 50,40 T100,30 V50 H0"
                      fill={data.weeklyChange >= 0 ? '#86efac' : '#fca5a5'}
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600">Monthly Change</p>
              <p className={`text-xl font-bold ${data.monthlyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {data.monthlyChange >= 0 ? '+' : ''}{data.monthlyChange}%
              </p>
              <div className={`h-20 mt-2 ${data.monthlyChange >= 0 ? 'bg-green-50' : 'bg-red-50'} rounded-lg relative overflow-hidden`}>
                <div className={`absolute bottom-0 left-0 w-full h-12 ${data.monthlyChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    <path
                      d="M0,50 Q25,30 50,40 T100,30 V50 H0"
                      fill={data.monthlyChange >= 0 ? '#86efac' : '#fca5a5'}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Overview */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Weekly Overview</h3>
          <div className="bg-white rounded-xl p-6">
            <div className="grid grid-cols-5 gap-4">
              {data.weekData.map((item, index) => {
                const maxValue = Math.max(...data.weekData.map(d => d.value));
                const heightPercent = maxValue === 0 ? 0 : (item.value / maxValue) * 100;
                const formattedValue = statType === 'steps' 
                  ? `${(item.value / 1000).toFixed(1)}`
                  : statType === 'heart'
                    ? Math.round(item.value)
                    : item.value.toFixed(1);

                // Format date to show "Apr 21"
                const date = new Date(item.date);
                const formattedDate = date.toLocaleDateString('en-US', { 
                  month: 'short',
                  day: 'numeric'
                });
                
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className="h-32 w-full flex items-end mb-2">
                      <div 
                        className="w-full bg-purple-600 rounded-t-lg transition-all duration-300"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-1">{formattedDate}</div>
                    <div className="text-sm text-gray-600">
                      {formattedValue}
                      {statType === 'steps' ? 'K' : 
                       statType === 'sleep' ? ' hrs' : 
                       unit}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatDetail; 