import React, { useState, useEffect } from 'react';
import { ArrowLeft, Crown, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface LeaderboardEntry {
  id: number;
  name: string;
  weeklyPoints: number;
  allTimePoints: number;
  avatar: string;
}

const mockData: LeaderboardEntry[] = [
  {
    id: 1,
    name: "Davis Curtis",
    weeklyPoints: 2569,
    allTimePoints: 15420,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Davis"
  },
  {
    id: 2,
    name: "Alena Donin",
    weeklyPoints: 1469,
    allTimePoints: 12850,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alena"
  },
  {
    id: 3,
    name: "Craig Gouse",
    weeklyPoints: 1053,
    allTimePoints: 11230,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Craig"
  },
  {
    id: 4,
    name: "Madelyn Dias",
    weeklyPoints: 590,
    allTimePoints: 8940,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Madelyn"
  },
  {
    id: 5,
    name: "Zain Vaccaro",
    weeklyPoints: 448,
    allTimePoints: 7250,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zain"
  }
];

const getTimeUntilEndOfWeek = () => {
  const now = new Date();
  const endOfWeek = new Date();
  endOfWeek.setDate(now.getDate() + (6 - now.getDay())); // Set to Saturday
  endOfWeek.setHours(23, 59, 59, 999);

  const diff = endOfWeek.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
};

const Leaderboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'all'>('weekly');
  const [timeRemaining, setTimeRemaining] = useState(getTimeUntilEndOfWeek());
  const navigate = useNavigate();

  const top3 = mockData.slice(0, 3);
  const restOfList = mockData.slice(3);

  // Update timer every minute
  useEffect(() => {
    if (timeFilter === 'weekly') {
      const timer = setInterval(() => {
        setTimeRemaining(getTimeUntilEndOfWeek());
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [timeFilter]);

  const getPoints = (entry: LeaderboardEntry) => {
    return timeFilter === 'weekly' ? entry.weeklyPoints : entry.allTimePoints;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Leaderboard</h1>

        {/* Time Filter */}
        <div className="grid grid-cols-2 gap-2 mb-8">
          <button
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${
              timeFilter === 'weekly'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setTimeFilter('weekly')}
          >
            Weekly
          </button>
          <button
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${
              timeFilter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setTimeFilter('all')}
          >
            All Time
          </button>
        </div>

        {/* Performance Card */}
        <div className="bg-orange-400 rounded-xl p-4 text-white shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-semibold text-lg">#4</span>
            <p className="font-medium">You are doing better than</p>
          </div>
          <p className="text-lg font-bold">93% of other students!</p>
        </div>

        {/* Timer - Fixed height container */}
        <div className="h-8 flex items-center justify-end gap-2 text-gray-500 text-sm mb-14 -mt-6">
          {timeFilter === 'weekly' && (
            <><Clock className="h-4 w-4" /><span>{timeRemaining} remaining</span></>
          )}
        </div>

        {/* Top 3 Podium */}
        <div className="relative h-48 mb-8">
          {/* Second Place */}
          <div className="absolute left-4 bottom-0 flex flex-col items-center">
            <img
              src={top3[1].avatar}
              alt={top3[1].name}
              className="w-12 h-12 rounded-full mb-2 ring-2 ring-purple-100 shadow-md"
            />
            <div className="text-center">
              <p className="text-gray-900 font-medium">{top3[1].name}</p>
              <p className="text-purple-600 text-sm font-medium">{getPoints(top3[1]).toLocaleString()} QP</p>
            </div>
            <div className="relative h-24 w-20 bg-purple-100 rounded-t-lg mt-2">
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-purple-600 font-semibold">2</span>
            </div>
          </div>

          {/* First Place */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center">
            <Crown className="text-yellow-400 w-6 h-6 mb-1 drop-shadow" />
            <img
              src={top3[0].avatar}
              alt={top3[0].name}
              className="w-12 h-12 rounded-full mb-2 ring-2 ring-yellow-100 shadow-md"
            />
            <div className="text-center">
              <p className="text-gray-900 font-medium">{top3[0].name}</p>
              <p className="text-purple-600 text-sm font-medium">{getPoints(top3[0]).toLocaleString()} QP</p>
            </div>
            <div className="relative h-32 w-20 bg-yellow-100 rounded-t-lg mt-2">
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-yellow-600 font-semibold">1</span>
            </div>
          </div>

          {/* Third Place */}
          <div className="absolute right-4 bottom-0 flex flex-col items-center">
            <img
              src={top3[2].avatar}
              alt={top3[2].name}
              className="w-12 h-12 rounded-full mb-2 ring-2 ring-orange-100 shadow-md"
            />
            <div className="text-center">
              <p className="text-gray-900 font-medium">{top3[2].name}</p>
              <p className="text-purple-600 text-sm font-medium">{getPoints(top3[2]).toLocaleString()} QP</p>
            </div>
            <div className="relative h-16 w-20 bg-orange-100 rounded-t-lg mt-2">
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-orange-600 font-semibold">3</span>
            </div>
          </div>
        </div>

        {/* Rest of the List */}
        <div className="space-y-3">
          {restOfList.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm"
            >
              <span className="text-gray-400 font-medium w-6 text-center">{entry.id}</span>
              <img
                src={entry.avatar}
                alt={entry.name}
                className="w-10 h-10 rounded-full ring-2 ring-gray-100"
              />
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{entry.name}</p>
                <p className="text-purple-600 text-sm font-medium">{getPoints(entry).toLocaleString()} points</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Navbar />
    </div>
  );
};

export default Leaderboard; 