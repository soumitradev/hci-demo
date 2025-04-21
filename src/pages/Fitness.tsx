import React, { useState, useRef, useEffect } from 'react';
import { Footprints, Moon, Droplets, Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fitnessStats } from '../data/fitnessData';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Fitness: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayString);
  const dateScrollRef = useRef<HTMLDivElement>(null);

  // Generate dates for the date selector
  const getDates = () => {
    const dates = [];
    for (let i = 14; i >= 0; i--) { // Show last 15 days
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: days[date.getDay()],
        dayOfMonth: date.getDate(),
      });
    }
    return dates;
  };

  const dates = getDates();

  // Get current stats based on selected date
  const getCurrentStats = () => {
    return {
      steps: fitnessStats.steps.data.value,
      sleep: fitnessStats.sleep.data.value,
      water: fitnessStats.water.data.value,
      heartRate: fitnessStats.heart.data.value
    };
  };

  const currentStats = getCurrentStats();

  // Scroll to the latest date when component mounts
  useEffect(() => {
    if (dateScrollRef.current) {
      dateScrollRef.current.scrollLeft = dateScrollRef.current.scrollWidth;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-8">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Fitness</h1>
        </div>
        <p className="text-xl text-gray-600 mt-2 mb-8">Overview</p>

        {/* Date Selector */}
        <div 
          ref={dateScrollRef}
          className="flex gap-2 mb-8 overflow-x-auto pb-2 scroll-smooth hide-scrollbar"
          style={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {dates.map(({ date, day, dayOfMonth }) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center justify-center min-w-[4.5rem] p-3 rounded-xl transition-colors flex-shrink-0 ${
                selectedDate === date
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl font-semibold">{dayOfMonth}</span>
              <span className="text-sm">{day}</span>
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Steps Card */}
          <div 
            className="bg-purple-600 rounded-xl p-4 text-white cursor-pointer hover:bg-purple-700 transition-colors"
            onClick={() => navigate('/fitness/steps')}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-medium">Walk</span>
              <Footprints className="w-5 h-5" />
            </div>
            <div className="relative w-full aspect-square mb-2">
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
                    strokeDashoffset: 251.2 - (currentStats.steps / fitnessStats.steps.goal) * 251.2,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{currentStats.steps}</span>
                <span className="text-xs opacity-80">Steps</span>
              </div>
            </div>
          </div>

          {/* Sleep Card */}
          <div 
            className="bg-purple-600 rounded-xl p-4 text-white cursor-pointer hover:bg-purple-700 transition-colors"
            onClick={() => navigate('/fitness/sleep')}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-medium">Sleep</span>
              <Moon className="w-5 h-5" />
            </div>
            <div className="h-24">
              <div className="flex items-end h-full space-x-2">
                {[0, 1, 2, 3, 4, 5, 6].map((hour) => (
                  <div
                    key={hour}
                    className="flex-1 bg-white/20 rounded-t"
                    style={{
                      height: `${(Math.min(hour, currentStats.sleep) / fitnessStats.sleep.goal) * 100}%`,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-2xl font-bold">{currentStats.sleep}</span>
              <span className="text-xs opacity-80 ml-1">Hours</span>
            </div>
          </div>

          {/* Water Card */}
          <div 
            className="bg-purple-600 rounded-xl p-4 text-white cursor-pointer hover:bg-purple-700 transition-colors"
            onClick={() => navigate('/fitness/water')}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-medium">Water</span>
              <Droplets className="w-5 h-5" />
            </div>
            <div className="h-24">
              <div className="flex items-end h-full space-x-2">
                {[0, 1, 2, 3, 4].map((litre) => (
                  <div
                    key={litre}
                    className="flex-1 bg-white/20 rounded-t"
                    style={{
                      height: `${(Math.min(litre, currentStats.water) / fitnessStats.water.goal) * 100}%`,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-2xl font-bold">{currentStats.water}</span>
              <span className="text-xs opacity-80 ml-1">Litres</span>
            </div>
          </div>

          {/* Heart Rate Card */}
          <div 
            className="bg-purple-600 rounded-xl p-4 text-white cursor-pointer hover:bg-purple-700 transition-colors"
            onClick={() => navigate('/fitness/heart')}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-medium">Heart</span>
              <Heart className="w-5 h-5" />
            </div>
            <div className="h-24 flex items-center justify-center overflow-hidden">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 25"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0,12 
                     L 15,12 
                     L 17,12 
                     L 18,2 
                     L 19,22 
                     L 20,2 
                     L 21,12 
                     L 23,12 
                     L 38,12 
                     L 40,12 
                     L 41,2 
                     L 42,22 
                     L 43,2 
                     L 44,12 
                     L 46,12 
                     L 61,12 
                     L 63,12 
                     L 64,2 
                     L 65,22 
                     L 66,2 
                     L 67,12 
                     L 69,12 
                     L 84,12 
                     L 86,12 
                     L 87,2 
                     L 88,22 
                     L 89,2 
                     L 90,12 
                     L 100,12"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <div className="mt-2 text-center">
              <span className="text-2xl font-bold">{Math.round(currentStats.heartRate)}</span>
              <span className="text-xs opacity-80 ml-1">bpm</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Add CSS to hide scrollbar for Webkit browsers
const style = document.createElement('style');
style.textContent = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;
document.head.appendChild(style);

export default Fitness; 