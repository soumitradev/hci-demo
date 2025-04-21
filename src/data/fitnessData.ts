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
  data: {
    value: number;
  };
  unit: string;
  goal: number;
  weeklyData: DailyData[];
  monthlyData: {
    week: number;
    average: number;
  }[];
}

// Helper function to get the last 7 days
const getLast7Days = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const dates = getLast7Days();

// Sample progression data for sleep over the last 7 days
const sleepProgression = [5.0, 6.5, 7.0, 7.5, 7.8, 6.9, 7.8];

export const fitnessStats: Record<string, StatConfig> = {
  'sleep': {
    title: 'Sleep',
    data: {
      value: sleepProgression[6], // Latest value
    },
    unit: 'hours',
    goal: 8,
    weeklyData: dates.map((date, i) => ({
      date,
      value: sleepProgression[i]
    })),
    monthlyData: [
      { week: 1, average: 6.5 },
      { week: 2, average: 7.0 },
      { week: 3, average: 7.2 },
      { week: 4, average: 7.5 }
    ]
  },
  'steps': {
    title: 'Steps',
    data: {
      value: 8900, // Today's value
    },
    unit: 'steps',
    goal: 10000,
    weeklyData: dates.map((date, i) => ({
      date,
      value: [8500, 9200, 7800, 10500, 9800, 6500, 8900][i]
    })),
    monthlyData: [
      { week: 1, average: 8500 },
      { week: 2, average: 9200 },
      { week: 3, average: 8800 },
      { week: 4, average: 9500 }
    ]
  },
  'water': {
    title: 'Water',
    data: {
      value: 2.4, // Today's value
    },
    unit: 'L',
    goal: 3,
    weeklyData: dates.map((date, i) => ({
      date,
      value: [2.1, 2.5, 1.8, 2.8, 2.2, 1.9, 2.4][i]
    })),
    monthlyData: [
      { week: 1, average: 2.1 },
      { week: 2, average: 2.3 },
      { week: 3, average: 2.5 },
      { week: 4, average: 2.4 }
    ]
  },
  'heart': {
    title: 'Heart Rate',
    data: {
      value: 69, // Today's value
    },
    unit: 'bpm',
    goal: 100,
    weeklyData: dates.map((date, i) => ({
      date,
      value: [72, 75, 68, 70, 73, 71, 69][i]
    })),
    monthlyData: [
      { week: 1, average: 72 },
      { week: 2, average: 71 },
      { week: 3, average: 70 },
      { week: 4, average: 73 }
    ]
  }
}; 