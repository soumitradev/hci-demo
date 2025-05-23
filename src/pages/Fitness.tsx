import { useState, useRef, useEffect } from 'react';
import { Footprints, Moon, Droplets, Flame, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fitnessStats } from '../data/fitnessData';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const Fitness: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayString);
  const dateScrollRef = useRef<HTMLDivElement>(null);

  // Get current stats based on selected date
  const getCurrentStats = () => {
    // Find the data for selected date from weeklyData
    const findDataForDate = (weeklyData: { date: string; value: number }[]) => {
      return weeklyData.find(day => day.date === selectedDate)?.value;
    };

    return {
      steps: findDataForDate(fitnessStats.steps.weeklyData) ?? fitnessStats.steps.data.value,
      sleep: findDataForDate(fitnessStats.sleep.weeklyData) ?? fitnessStats.sleep.data.value,
      water: findDataForDate(fitnessStats.water.weeklyData) ?? fitnessStats.water.data.value,
      heartRate: findDataForDate(fitnessStats.heart.weeklyData) ?? fitnessStats.heart.data.value
    };
  };

  // Generate dates for the date selector from the data
  const getDates = () => {
    // Use the dates from any of the stats (they all have the same dates)
    return fitnessStats.steps.weeklyData.map(day => ({
      date: day.date,
      day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      dayOfMonth: new Date(day.date).getDate(),
    }));
  };

  const dates = getDates();

  const currentStats = getCurrentStats();

  // Scroll to the latest date when component mounts
  useEffect(() => {
    if (dateScrollRef.current) {
      dateScrollRef.current.scrollLeft = dateScrollRef.current.scrollWidth;
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-8">
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full text-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-7 w-7" />
          </Button>
          <h1 className="text-4xl font-bold text-foreground">Fitness</h1>
        </div>
        <p className="text-xl text-muted-foreground mt-2 mb-8">Overview</p>

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
            <Button
              key={date}
              onClick={() => setSelectedDate(date)}
              variant="ghost"
              className={`flex flex-col items-center justify-center min-w-[4.5rem] p-3 h-auto text-foreground hover:text-foreground ${
                selectedDate === date 
                  ? 'bg-accent text-accent-foreground hover:bg-accent/90' 
                  : 'hover:bg-accent/50'
              }`}
            >
              <span className={`text-2xl font-semibold ${selectedDate === date ? 'text-accent-foreground' : 'text-foreground'}`}>{dayOfMonth}</span>
              <span className={`text-sm ${selectedDate === date ? 'text-accent-foreground/80' : 'text-muted-foreground'}`}>{day}</span>
            </Button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Steps Card */}
          <Card
            className="p-4 hover:bg-accent transition-colors cursor-pointer"
            onClick={() => navigate('/fitness/steps')}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-medium">Walk</span>
              <Footprints className="w-5 h-5 text-blue-500" />
            </div>
            <div className="relative w-full aspect-square mb-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[8] fill-none"
                  stroke="hsl(217 91% 60% / 0.2)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[8] fill-none stroke-blue-500"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (currentStats.steps / fitnessStats.steps.goal) * 251.2}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{(currentStats.steps / 1000).toFixed(1)}K</span>
                <span className="text-xs text-muted-foreground">Steps</span>
              </div>
            </div>
          </Card>

          {/* Sleep Card */}
          <Card
            className="p-4 hover:bg-accent transition-colors cursor-pointer"
            onClick={() => navigate('/fitness/sleep')}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-medium">Sleep</span>
              <Moon className="w-5 h-5 text-purple-500" />
            </div>
            <div className="relative w-full aspect-square mb-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[8] fill-none"
                  stroke="hsl(271 91% 65% / 0.2)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[8] fill-none stroke-purple-500"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (currentStats.sleep / fitnessStats.sleep.goal) * 251.2}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{currentStats.sleep}</span>
                <span className="text-xs text-muted-foreground">Hours</span>
              </div>
            </div>
          </Card>

          {/* Water Card */}
          <Card
            className="p-4 hover:bg-accent transition-colors cursor-pointer"
            onClick={() => navigate('/fitness/water')}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-medium">Water</span>
              <Droplets className="w-5 h-5 text-cyan-500" />
            </div>
            <div className="relative w-full aspect-square mb-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[8] fill-none"
                  stroke="hsl(186 91% 50% / 0.2)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[8] fill-none stroke-cyan-500"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (currentStats.water / fitnessStats.water.goal) * 251.2}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{currentStats.water}</span>
                <span className="text-xs text-muted-foreground">Litres</span>
              </div>
            </div>
          </Card>

          {/* Calories Card */}
          <Card
            className="p-4 hover:bg-accent transition-colors cursor-pointer"
            onClick={() => navigate('/fitness/heart')}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-medium">Calories</span>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="relative w-full aspect-square mb-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[8] fill-none"
                  stroke="hsl(24 95% 50% / 0.2)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[8] fill-none stroke-orange-500"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (currentStats.heartRate / fitnessStats.heart.goal) * 251.2}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{currentStats.heartRate}</span>
                <span className="text-xs text-muted-foreground">kcal</span>
              </div>
            </div>
          </Card>
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