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
      if (progress >= 95) return { 
        message: "Great Progress!", 
        subtext: "You're crushing your calorie goal" 
      };
      if (progress >= 75) return { 
        message: "Keep Going!", 
        subtext: `${goal - value} more calories to burn` 
      };
      return { 
        message: "Time to Move", 
        subtext: `${goal - value} calories remaining today` 
      };

    default:
      return { message: "", subtext: "" };
  }
};

const getProgressPercentage = (value: number, goal: number): number => {
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
  const progress = getProgressPercentage(statConfig.data.value, statConfig.goal);
  const { message, subtext } = getProgressMessage(statType, statConfig.data.value, statConfig.goal);

  // Calculate weekly change (comparing latest to first value)
  const weeklyChange = Math.min(15, ((statConfig.weeklyData[statConfig.weeklyData.length - 1].value 
    - statConfig.weeklyData[0].value) / statConfig.weeklyData[0].value * 100)).toFixed(0);

  // Calculate monthly change (comparing latest to first week)
  const monthlyChange = Math.min(5, ((statConfig.monthlyData[statConfig.monthlyData.length - 1].average 
    - statConfig.monthlyData[0].average) / statConfig.monthlyData[0].average * 100)).toFixed(0);

  const unit = statType === 'sleep' ? 'hrs' : (statType === 'steps' ? '' : statConfig.unit);

  // Get accent color based on stat type
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

  const accentColor = getAccentColor(statType);
  const accentColorBg = getAccentColorWithOpacity(statType);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-8">
          <Button 
            onClick={() => navigate(-1)}
            variant="ghost"
            size="icon"
            className="rounded-full text-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-7 w-7" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{statConfig.title}</h1>
        </div>

        {/* Main Stats Card */}
        <div className="bg-card rounded-3xl p-8 text-center mb-8 border">
          <h2 className="text-2xl font-semibold mb-1 text-foreground">{message}</h2>
          <p className="text-muted-foreground mb-8">{subtext}</p>
          
          <div className="relative w-32 h-32 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="60"
                className="stroke-[8] fill-none"
                style={{ stroke: accentColorBg }}
              />
              <circle
                cx="64"
                cy="64"
                r="60"
                className="stroke-[8] fill-none"
                style={{ stroke: accentColor }}
                strokeDasharray={377}
                strokeDashoffset={377 - (progress / 100) * 377}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">{progress}%</span>
              <span className="text-sm text-muted-foreground">of goal</span>
            </div>
          </div>

          <p className="text-xl text-foreground">
            {`${formatValue(statConfig.data.value, statType)}${unit} / ${formatValue(statConfig.goal, statType)}${unit}`}
          </p>
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-4">Overview</h3>
        
        {/* Change Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 shadow-sm">
            <p className="text-sm text-muted-foreground mb-2">Weekly Change</p>
            <p className={`text-xl font-bold ${Number(weeklyChange) >= 0 ? 'text-green-500' : 'text-destructive'}`}>
              {Number(weeklyChange) >= 0 ? '+' : ''}{weeklyChange}%
            </p>
            <div className="h-16 mt-2 bg-muted rounded-lg relative overflow-hidden">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <path
                  d="M0,50 Q25,30 50,40 T100,30 V50 H0"
                  className={`${Number(weeklyChange) >= 0 ? 'fill-green-500' : 'fill-destructive'}`}
                />
              </svg>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 shadow-sm">
            <p className="text-sm text-muted-foreground mb-2">Monthly Change</p>
            <p className={`text-xl font-bold ${Number(monthlyChange) >= 0 ? 'text-green-500' : 'text-destructive'}`}>
              {Number(monthlyChange) >= 0 ? '+' : ''}{monthlyChange}%
            </p>
            <div className="h-16 mt-2 bg-muted rounded-lg relative overflow-hidden">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <path
                  d="M0,50 Q25,30 50,40 T100,30 V50 H0"
                  className={`${Number(monthlyChange) >= 0 ? 'fill-green-500' : 'fill-destructive'}`}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Weekly Overview */}
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
                        backgroundColor: accentColor
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