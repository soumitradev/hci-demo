import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fitnessStats } from '../data/fitnessData';
import { Button } from '@/components/ui/button';

const getProgressMessage = (statType: string, value: number, goal: number): { message: string; subtext: string } => {
  const progress = (value / goal) * 100;
  
  switch (statType) {
    case 'sleep':
      if (progress >= 95) return { 
        message: "Almost There!", 
        subtext: "Just a few more minutes of sleep" 
      };
      if (progress >= 90) return { 
        message: "Almost There!", 
        subtext: "Just a few more minutes of sleep" 
      };
      return { 
        message: "Room for Improvement", 
        subtext: `${(goal - value).toFixed(1)} more hrs for ideal sleep` 
      };

    case 'steps':
      if (progress >= 95) return { 
        message: "Almost There!", 
        subtext: "Just a few more steps to go" 
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
      if (progress >= 95) return { 
        message: "Almost There!", 
        subtext: "Just a bit more to drink" 
      };
      if (progress >= 75) return { 
        message: "Keep Going!", 
        subtext: `${(goal - value).toFixed(1)}L more to go` 
      };
      return { 
        message: "Stay Hydrated", 
        subtext: `${(goal - value).toFixed(1)}L remaining today` 
      };

    case 'heart':
      if (value >= 60 && value <= 100) return { 
        message: "Perfect Range", 
        subtext: "Your heart rate is ideal" 
      };
      if (value < 60) return { 
        message: "Low Heart Rate", 
        subtext: "Your heart rate is below normal" 
      };
      return { 
        message: "High Heart Rate", 
        subtext: "Try to relax a bit" 
      };

    default:
      return { message: "", subtext: "" };
  }
};

const getProgressPercentage = (statType: string, value: number, goal: number): number => {
  return Math.min(Math.round((value / goal) * 100), 100);
};

const formatValue = (value: number, statType: string): string => {
  if (statType === 'steps') {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

const StatDetail = () => {
  const navigate = useNavigate();
  const { statType } = useParams<{ statType: string }>();
  
  if (!statType || !fitnessStats[statType]) {
    return <div>Stat not found</div>;
  }

  const statConfig = fitnessStats[statType];
  const progress = getProgressPercentage(statType, statConfig.data.value, statConfig.goal);
  const { message, subtext } = getProgressMessage(statType, statConfig.data.value, statConfig.goal);

  // Calculate weekly change (comparing latest to first value)
  const weeklyChange = Math.min(15, ((statConfig.weeklyData[statConfig.weeklyData.length - 1].value 
    - statConfig.weeklyData[0].value) / statConfig.weeklyData[0].value * 100)).toFixed(0);

  // Calculate monthly change (comparing latest to first week)
  const monthlyChange = Math.min(5, ((statConfig.monthlyData[statConfig.monthlyData.length - 1].average 
    - statConfig.monthlyData[0].average) / statConfig.monthlyData[0].average * 100)).toFixed(0);

  const unit = statType === 'sleep' ? 'hrs' : (statType === 'steps' ? '' : statConfig.unit);
  const isHeartRate = statType === 'heart';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-8">
          <Button 
            onClick={() => navigate(-1)}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <ChevronLeft className="h-7 w-7" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{statConfig.title}</h1>
        </div>

        {/* Main Stats Card */}
        <div className="bg-primary rounded-3xl p-8 text-primary-foreground text-center mb-8">
          <h2 className="text-2xl font-semibold mb-1">{message}</h2>
          <p className="text-primary-foreground/90 mb-8">{subtext}</p>
          
          {!isHeartRate && (
            <div className="relative w-32 h-32 mx-auto mb-8">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  className="stroke-[8] fill-none"
                  stroke="hsl(var(--primary) / 0.2)"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  className="stroke-[8] fill-none"
                  stroke="hsl(var(--primary))"
                  strokeDasharray={377}
                  strokeDashoffset={377 - (progress / 100) * 377}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground">
                <span className="text-3xl font-bold">{progress}%</span>
                <span className="text-sm">of goal</span>
              </div>
            </div>
          )}

          <p className="text-xl">
            {isHeartRate ? (
              `${statConfig.data.value}${unit}`
            ) : (
              `${formatValue(statConfig.data.value, statType)}${unit} / ${formatValue(statConfig.goal, statType)}${unit}`
            )}
          </p>
        </div>

        {!isHeartRate && <h3 className="text-xl font-semibold mb-4">Overview</h3>}
        
        {/* Change Cards - Only show for non-heart rate stats */}
        {!isHeartRate && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-card rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground mb-2">Weekly Change</p>
              <p className={`text-xl font-bold ${Number(weeklyChange) >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                {Number(weeklyChange) >= 0 ? '+' : ''}{weeklyChange}%
              </p>
              <div className="h-16 mt-2 bg-muted rounded-lg relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-12 bg-muted-foreground/10">
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    <path
                      d="M0,50 Q25,30 50,40 T100,30 V50 H0"
                      fill="hsl(var(--primary))"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground mb-2">Monthly Change</p>
              <p className={`text-xl font-bold ${Number(monthlyChange) >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                {Number(monthlyChange) >= 0 ? '+' : ''}{monthlyChange}%
              </p>
              <div className="h-16 mt-2 bg-muted rounded-lg relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-12 bg-muted-foreground/10">
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    <path
                      d="M0,50 Q25,30 50,40 T100,30 V50 H0"
                      fill="hsl(var(--primary))"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Overview - Show for all stats including heart rate */}
        <>
          <h3 className="text-xl font-semibold mb-4">Weekly Overview</h3>
          <div className="grid grid-cols-5 gap-4">
            {statConfig.weeklyData.slice(-5).map((day, index) => {
              const maxValue = Math.max(...statConfig.weeklyData.map(d => d.value));
              const heightPercent = (day.value / maxValue) * 100;
              const date = new Date(day.date);
              const formattedDate = date.toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric'
              });
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="h-32 w-full flex items-end justify-center mb-2">
                    <div 
                      className="w-4 transition-all duration-300"
                      style={{ 
                        height: `${heightPercent}%`,
                        backgroundColor: 'hsl(var(--primary))'
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground mb-1">{formattedDate}</span>
                  <span className="text-sm text-foreground">{formatValue(day.value, statType)}{unit}</span>
                </div>
              );
            })}
          </div>
        </>
      </div>
    </div>
  );
};

export default StatDetail;