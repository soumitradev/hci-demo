export interface DailyData {
  value: number;
  date: string; // ISO date string
}

export interface StatData {
  value: number;
  weeklyChange: number;
  monthlyChange: number;
  weekData: DailyData[];
}

export interface StatConfig {
  title: string;
  data: StatData;
  unit: string;
  color: string;
  goal: number;
}

// Helper function to get the last 5 days
const getLast5Days = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 4; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const dates = getLast5Days();

// Sample progression data for sleep over the last 5 days
const sleepProgression = [5.0, 6.5, 7.0, 7.5, 7.8];

export const fitnessStats: Record<string, StatConfig> = {
  'sleep': {
    title: 'Sleep',
    data: {
      value: sleepProgression[4], // Latest value
      weeklyChange: 15,
      monthlyChange: 5,
      weekData: dates.map((date, index) => ({
        value: sleepProgression[index],
        date
      }))
    },
    unit: 'hours',
    color: 'bg-purple-600',
    goal: 8
  },
  'steps': {
    title: 'Steps',
    data: {
      value: 8234,
      weeklyChange: 15,
      monthlyChange: 5,
      weekData: dates.map((date, index) => ({
        value: [6500, 7800, 8200, 8234, 7500][index],
        date
      }))
    },
    unit: 'steps',
    color: 'bg-purple-600',
    goal: 10000
  },
  'water': {
    title: 'Water',
    data: {
      value: 2.5,
      weeklyChange: 15,
      monthlyChange: 5,
      weekData: dates.map((date, index) => ({
        value: [2.1, 2.3, 2.5, 2.4, 2.5][index],
        date
      }))
    },
    unit: 'L',
    color: 'bg-purple-600',
    goal: 3
  },
  'heart': {
    title: 'Heart Rate',
    data: {
      value: 74,
      weeklyChange: -5,
      monthlyChange: -2,
      weekData: dates.map((date, index) => ({
        value: [78, 76, 77, 75, 74][index],
        date
      }))
    },
    unit: 'bpm',
    color: 'bg-purple-600',
    goal: 80 // Target resting heart rate
  }
}; 