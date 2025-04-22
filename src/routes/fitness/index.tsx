import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { Footprints, Moon, Droplets, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fitnessStats } from '@/lib/fitnessData';

export const Route = createFileRoute('/fitness/')({
  component: FitnessIndex,
  staticData: {
    title: 'Fitness',
  },
})

function FitnessIndex() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getCurrentStats = () => {
    return Object.entries(fitnessStats).map(([type, stat]) => ({
      type,
      ...stat,
    }));
  };

  const generateDateSelectors = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getAccentColor = (type: string) => {
    switch (type) {
      case 'steps':
        return 'rgb(59, 130, 246)'; // blue-500
      case 'sleep':
        return 'rgb(168, 85, 247)'; // purple-500
      case 'water':
        return 'rgb(6, 182, 212)';  // cyan-500
      case 'heart':
        return 'rgb(249, 115, 22)'; // orange-500
      default:
        return 'hsl(var(--primary))';
    }
  };

  const getAccentColorWithOpacity = (type: string) => {
    switch (type) {
      case 'steps':
        return 'rgba(59, 130, 246, 0.2)';
      case 'sleep':
        return 'rgba(168, 85, 247, 0.2)';
      case 'water':
        return 'rgba(6, 182, 212, 0.2)';
      case 'heart':
        return 'rgba(249, 115, 22, 0.2)';
      default:
        return 'hsl(var(--primary) / 0.2)';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'steps':
        return <Footprints className="w-5 h-5 text-blue-500" />;
      case 'sleep':
        return <Moon className="w-5 h-5 text-purple-500" />;
      case 'water':
        return <Droplets className="w-5 h-5 text-cyan-500" />;
      case 'heart':
        return <Flame className="w-5 h-5 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">

        {/* Date Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar">
          {generateDateSelectors().map((date, index) => (
            <Button
              key={index}
              variant={selectedDate.toDateString() === date.toDateString() ? "default" : "outline"}
              className="flex-shrink-0"
              onClick={() => setSelectedDate(date)}
            >
              {formatDate(date)}
            </Button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {getCurrentStats().map((stat) => {
            const progress = Math.min(Math.round((stat.data.value / stat.goal) * 100), 100);
            const accentColor = getAccentColor(stat.type);
            const accentColorBg = getAccentColorWithOpacity(stat.type);
            const unit = stat.type === 'sleep' ? 'hrs' : (stat.type === 'steps' ? '' : stat.unit);
            const formattedValue = stat.type === 'steps' 
              ? `${(stat.data.value / 1000).toFixed(1)}K`
              : stat.data.value.toString();

            return (
              <Card 
                key={stat.type}
                className="p-3 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate({ to: `/fitness/${stat.type}` })}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">{stat.title}</h3>
                  {getIcon(stat.type)}
                </div>
                
                <div className="relative w-full aspect-square mb-2">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-[8] fill-none"
                      style={{ stroke: accentColorBg }}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-[8] fill-none"
                      style={{ stroke: accentColor }}
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (progress / 100) * 251.2}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-foreground">{formattedValue}</span>
                    <span className="text-xs text-muted-foreground">{unit}</span>
                  </div>
                </div>
                
                <div className="mt-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{progress}%</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// Add CSS to hide scrollbar for Webkit browsers
const style = document.createElement('style');
style.textContent = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;
document.head.appendChild(style);
