import { useState, useEffect } from 'react';
import { Crown, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

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
    name: "N. Nilekani",
    weeklyPoints: 2569,
    allTimePoints: 15420,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nandan"
  },
  {
    id: 2,
    name: "K. M. Shaw",
    weeklyPoints: 1469,
    allTimePoints: 12850,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kiran"
  },
  {
    id: 3,
    name: "R. Bhatia",
    weeklyPoints: 1053,
    allTimePoints: 11230,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
  },
  {
    id: 4,
    name: "Rakesh Jhunjhunwala",
    weeklyPoints: 590,
    allTimePoints: 8940,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rakesh"
  },
  {
    id: 5,
    name: "Ritesh Agarwal",
    weeklyPoints: 448,
    allTimePoints: 7250,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ritesh"
  },
  {
    id: 6,
    name: "Bhavish Aggarwal",
    weeklyPoints: 420,
    allTimePoints: 7100,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bhavish"
  },
  {
    id: 7,
    name: "Kunal Shah",
    weeklyPoints: 380,
    allTimePoints: 6800,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kunal"
  },
  {
    id: 8,
    name: "Sachin Bansal",
    weeklyPoints: 350,
    allTimePoints: 6500,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sachin"
  },
  {
    id: 9,
    name: "Binny Bansal",
    weeklyPoints: 320,
    allTimePoints: 6200,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Binny"
  },
  {
    id: 10,
    name: "Deepinder Goyal",
    weeklyPoints: 290,
    allTimePoints: 5900,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Deepinder"
  },
  {
    id: 11,
    name: "Vijay Shekhar Sharma",
    weeklyPoints: 275,
    allTimePoints: 5700,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vijay"
  },
  {
    id: 12,
    name: "Sanjay Mehta",
    weeklyPoints: 260,
    allTimePoints: 5500,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanjay"
  },
  {
    id: 13,
    name: "Rajesh Sawhney",
    weeklyPoints: 245,
    allTimePoints: 5300,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh"
  },
  {
    id: 14,
    name: "Amit Gupta",
    weeklyPoints: 230,
    allTimePoints: 5100,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit"
  },
  {
    id: 15,
    name: "Naveen Tewari",
    weeklyPoints: 215,
    allTimePoints: 4900,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Naveen"
  },
  {
    id: 16,
    name: "Krishna Kumar",
    weeklyPoints: 200,
    allTimePoints: 4700,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Krishna"
  },
  {
    id: 17,
    name: "Rahul Sharma",
    weeklyPoints: 190,
    allTimePoints: 4500,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RahulS"
  },
  {
    id: 18,
    name: "Vikram Chopra",
    weeklyPoints: 180,
    allTimePoints: 4300,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram"
  },
  {
    id: 19,
    name: "Ankit Bhati",
    weeklyPoints: 170,
    allTimePoints: 4100,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ankit"
  },
  {
    id: 20,
    name: "Varun Khaitan",
    weeklyPoints: 160,
    allTimePoints: 3900,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Varun"
  },
  {
    id: 21,
    name: "Gaurav Munjal",
    weeklyPoints: 150,
    allTimePoints: 3700,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gaurav"
  },
  {
    id: 22,
    name: "Roman Saini",
    weeklyPoints: 140,
    allTimePoints: 3500,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roman"
  },
  {
    id: 23,
    name: "Prateek Shukla",
    weeklyPoints: 130,
    allTimePoints: 3300,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prateek"
  },
  {
    id: 24,
    name: "Amit Ranjan",
    weeklyPoints: 120,
    allTimePoints: 3100,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AmitR"
  },
  {
    id: 25,
    name: "Sachin Gupta",
    weeklyPoints: 110,
    allTimePoints: 2900,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SachinG"
  },
  {
    id: 26,
    name: "Rahul Yadav",
    weeklyPoints: 100,
    allTimePoints: 2700,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RahulY"
  },
  {
    id: 27,
    name: "Amit Agarwal",
    weeklyPoints: 95,
    allTimePoints: 2500,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AmitA"
  },
  {
    id: 28,
    name: "Kunal Bahl",
    weeklyPoints: 90,
    allTimePoints: 2300,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KunalB"
  },
  {
    id: 29,
    name: "Rohit Bansal",
    weeklyPoints: 85,
    allTimePoints: 2100,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit"
  },
  {
    id: 30,
    name: "Sachin Bhatia",
    weeklyPoints: 80,
    allTimePoints: 1900,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SachinB"
  },
  {
    id: 31,
    name: "Rahul Chari",
    weeklyPoints: 75,
    allTimePoints: 1700,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RahulC"
  },
  {
    id: 32,
    name: "Amit Jain",
    weeklyPoints: 70,
    allTimePoints: 1500,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AmitJ"
  },
  {
    id: 33,
    name: "Kunal Shah",
    weeklyPoints: 65,
    allTimePoints: 1300,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KunalS"
  },
  {
    id: 34,
    name: "Rahul Garg",
    weeklyPoints: 60,
    allTimePoints: 1100,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RahulG"
  },
  {
    id: 35,
    name: "Amit Gupta",
    weeklyPoints: 55,
    allTimePoints: 900,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AmitG"
  },
  {
    id: 36,
    name: "Kunal Bahl",
    weeklyPoints: 50,
    allTimePoints: 800,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KunalB2"
  },
  {
    id: 37,
    name: "Rahul Yadav",
    weeklyPoints: 45,
    allTimePoints: 700,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RahulY2"
  },
  {
    id: 38,
    name: "Amit Jain",
    weeklyPoints: 40,
    allTimePoints: 600,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AmitJ2"
  },
  {
    id: 39,
    name: "Kunal Shah",
    weeklyPoints: 35,
    allTimePoints: 500,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KunalS2"
  },
  {
    id: 40,
    name: "Rahul Garg",
    weeklyPoints: 30,
    allTimePoints: 400,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RahulG2"
  },
  {
    id: 41,
    name: "Amit Gupta",
    weeklyPoints: 25,
    allTimePoints: 300,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AmitG2"
  },
  {
    id: 42,
    name: "Kunal Bahl",
    weeklyPoints: 20,
    allTimePoints: 200,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KunalB3"
  },
  {
    id: 43,
    name: "Rahul Yadav",
    weeklyPoints: 15,
    allTimePoints: 150,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RahulY3"
  },
  {
    id: 44,
    name: "Amit Jain",
    weeklyPoints: 10,
    allTimePoints: 100,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AmitJ3"
  },
  {
    id: 45,
    name: "Kunal Shah",
    weeklyPoints: 5,
    allTimePoints: 50,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KunalS3"
  },
  {
    id: 46,
    name: "Rahul Garg",
    weeklyPoints: 4,
    allTimePoints: 40,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RahulG3"
  },
  {
    id: 47,
    name: "Amit Gupta",
    weeklyPoints: 3,
    allTimePoints: 30,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AmitG3"
  },
  {
    id: 48,
    name: "Kunal Bahl",
    weeklyPoints: 2,
    allTimePoints: 20,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KunalB4"
  },
  {
    id: 49,
    name: "Rahul Yadav",
    weeklyPoints: 1,
    allTimePoints: 10,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RahulY4"
  },
  {
    id: 50,
    name: "Amit Jain",
    weeklyPoints: 0,
    allTimePoints: 0,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AmitJ4"
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

  const top3 = mockData.slice(0, 3);
  const restOfList = mockData.slice(3);

  useEffect(() => {
    if (timeFilter === 'weekly') {
      const timer = setInterval(() => {
        setTimeRemaining(getTimeUntilEndOfWeek());
      }, 60000);

      return () => clearInterval(timer);
    }
  }, [timeFilter]);

  const getPoints = (entry: LeaderboardEntry) => {
    return timeFilter === 'weekly' ? entry.weeklyPoints : entry.allTimePoints;
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-4xl font-bold text-foreground mb-6">Leaderboard</h1>

        {/* Time Filter */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Button
            variant="ghost"
            onClick={() => setTimeFilter('weekly')}
            className={`w-full text-foreground hover:text-foreground ${timeFilter === 'weekly' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
          >
            Weekly
          </Button>
          <Button
            variant="ghost"
            onClick={() => setTimeFilter('all')}
            className={`w-full text-foreground hover:text-foreground ${timeFilter === 'all' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
          >
            All Time
          </Button>
        </div>

        {/* Performance Card */}
        <Card className="bg-primary p-4 text-primary-foreground mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-base">#4</span>
              <p className="font-medium text-sm">You are doing better than <span className="font-bold">93% of other students!</span></p>
            </div>
          </div>
        </Card>

        {/* Timer */}
        <div className="h-4 relative mb-4">
          <div className="absolute right-0 flex items-center justify-end gap-1 text-muted-foreground text-sm">
            {timeFilter === 'weekly' && (
              <><Clock className="h-3 w-3" /><span>{timeRemaining} remaining</span></>
            )}
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="relative h-48 mb-6">
          {/* Second Place */}
          <div className="absolute left-4 bottom-0 w-24 flex flex-col items-center">
            <img
              src={top3[1].avatar}
              alt={top3[1].name}
              className="w-14 h-14 rounded-full mb-1 ring-2 ring-muted shadow-md"
            />
            <div className="text-center mb-1">
              <p className="text-foreground font-medium">{top3[1].name}</p>
              <p className="text-primary text-sm font-medium">{getPoints(top3[1]).toLocaleString()} points</p>
            </div>
            <div className="w-full h-20 bg-muted rounded-t-lg relative">
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-muted-foreground font-semibold">2</span>
            </div>
          </div>

          {/* First Place */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-24 flex flex-col items-center">
            <Crown className="text-yellow-400 w-5 h-5 mb-0.5 drop-shadow" />
            <img
              src={top3[0].avatar}
              alt={top3[0].name}
              className="w-14 h-14 rounded-full mb-1 ring-2 ring-yellow-100 shadow-md"
            />
            <div className="text-center mb-1">
              <p className="text-foreground font-medium">{top3[0].name}</p>
              <p className="text-primary text-sm font-medium">{getPoints(top3[0]).toLocaleString()} points</p>
            </div>
            <div className="w-full h-24 bg-yellow-100 rounded-t-lg relative">
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-yellow-600 font-semibold">1</span>
            </div>
          </div>

          {/* Third Place */}
          <div className="absolute right-4 bottom-0 w-24 flex flex-col items-center">
            <img
              src={top3[2].avatar}
              alt={top3[2].name}
              className="w-14 h-14 rounded-full mb-1 ring-2 ring-orange-100 shadow-md"
            />
            <div className="text-center mb-1">
              <p className="text-foreground font-medium">{top3[2].name}</p>
              <p className="text-primary text-sm font-medium">{getPoints(top3[2]).toLocaleString()} points</p>
            </div>
            <div className="w-full h-16 bg-orange-100 rounded-t-lg relative">
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-orange-600 font-semibold">3</span>
            </div>
          </div>
        </div>

        {/* Rest of the List */}
        <div className="space-y-2">
          {restOfList.map((entry) => (
            <Card
              key={entry.id}
              className="p-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-medium w-6">{entry.id}</span>
                <img
                  src={entry.avatar}
                  alt={entry.name}
                  className="w-10 h-10 rounded-full ring-2 ring-muted"
                />
                <div>
                  <p className="text-foreground font-medium">{entry.name}</p>
                  <p className="text-primary text-sm font-medium">{getPoints(entry).toLocaleString()} points</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Navbar />
    </div>
  );
};

export default Leaderboard; 