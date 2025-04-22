import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Academics from './pages/Academics'
import Navbar from './components/Navbar'
import Course from './pages/Course'
import TimetablePage from "./pages/Timetable";
import Finance from "./pages/Finance";
import AllTransactions from "./pages/AllTransactions";
import FinanceReport from "./pages/FinanceReport";
import Budget from "./pages/Budget";
import Leaderboard from "./pages/Leaderboard";
import Fitness from "./pages/Fitness";
import StatDetail from "./pages/StatDetail";
import { useCourseStore } from './lib/store';
import { useTimetableStore } from './stores/timetableStore';
import { useFinanceStore } from './stores/financeStore';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fitnessStats } from './data/fitnessData';
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import React from 'react';

function Home() {
  const navigate = useNavigate();
  const { courses } = useCourseStore();
  const { events } = useTimetableStore();
  const currentMonthSpending = useFinanceStore(state => state.calculateCurrentMonthSpending());
  const totalBudget = useFinanceStore(state => state.getTotalBudget());

  // Get latest steps data from fitnessStats
  const { value: currentSteps } = fitnessStats.steps.data;
  const { goal: stepsGoal } = fitnessStats.steps;

  // Get today's events
  const today = new Date();
  const todayEvents = events.filter(event => {
    const [hours, minutes] = event.startTime.split(':').map(Number);
    const eventTime = new Date(today);
    eventTime.setHours(hours, minutes);
    return eventTime > today;
  }).sort((a, b) => {
    const timeA = a.startTime.split(':').map(Number);
    const timeB = b.startTime.split(':').map(Number);
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
  }).slice(0, 2); // Get next 2 upcoming classes

  // Calculate average course progress using the progress property
  const totalProgress = Object.values(courses).reduce((sum, course) => sum + course.progress, 0);
  const averageProgress = Math.round(totalProgress / Object.keys(courses).length);

  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-5xl font-extrabold text-foreground mb-8">Lex</h1>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Welcome back!</h2>
          <p className="text-sm text-muted-foreground">Here's your progress for today</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Fitness and Academic Progress */}
          <div className="grid grid-cols-2 gap-2">
            {/* Fitness Widget */}
            <Card 
              className="col-span-1 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/fitness')}
            >
              <CardContent className="p-4 flex flex-col gap-2">
                <h3 className="text-base font-medium">Fitness</h3>
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="hsl(217 91% 60% / 0.2)"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="hsl(217 91% 60%)"
                      strokeWidth="3"
                      strokeDasharray={`${(currentSteps / stepsGoal) * 100}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-semibold text-foreground">{Math.round((currentSteps / stepsGoal) * 100)}%</span>
                    <span className="text-sm text-muted-foreground">Steps</span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full h-6 text-sm text-muted-foreground hover:text-foreground inline-flex items-center justify-center px-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/fitness');
                  }}
                >
                  View All
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Academic Progress */}
            <Card 
              className="col-span-1 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/academics')}
            >
              <CardContent className="p-4 flex flex-col gap-2">
                <h3 className="text-base font-medium">Academic Progress</h3>
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="hsl(217 91% 60% / 0.2)"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="hsl(217 91% 60%)"
                      strokeWidth="3"
                      strokeDasharray={`${averageProgress}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-semibold text-foreground">{averageProgress}%</span>
                    <span className="text-sm text-muted-foreground">Progress</span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full h-6 text-sm text-muted-foreground hover:text-foreground inline-flex items-center justify-center px-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/academics');
                  }}
                >
                  View All
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Spending */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/finance')}
          >
            <CardContent className="p-4 pr-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <h3 className="text-base font-medium -mt-1">Monthly Spending</h3>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-lg font-medium">₹{currentMonthSpending.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/ ₹{totalBudget.toLocaleString()}</span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 px-2 -mt-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/finance');
                  }}
                >
                  View All
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card 
            className="md:col-span-2 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/timetable')}
          >
            <CardContent className="p-4 pr-0">
              <div className="flex items-center justify-between -mt-1.5">
                <h3 className="text-base font-medium">Today's Schedule</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/timetable');
                  }}
                >
                  View All
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
              {todayEvents.length > 0 ? (
                <div className="space-y-2 mt-1">
                  {todayEvents.map(event => (
                    <div key={event.id} className="flex items-center gap-4">
                      <div className="w-12 text-base font-medium">{event.startTime}</div>
                      <div className="flex-1">
                        <p className="text-base font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground -mt-0.5">{event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">No more classes for today</p>
              )}
            </CardContent>
          </Card>

          {/* Leaderboard Position */}
          <Card 
            className="md:col-span-2 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/leaderboard')}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-base text-foreground">#4</span>
                <p className="font-medium text-sm text-foreground">You are doing better than <span className="text-primary">93%</span> of other students!</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </main>

      <Navbar />
    </div>
  )
}

export default function App() {
  React.useEffect(() => {
    // Add dark class to document root for portal elements
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="dark">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/courses/:courseId" element={<Course />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/finance/transactions" element={<AllTransactions />} />
          <Route path="/finance/report" element={<FinanceReport />} />
          <Route path="/finance/budget" element={<Budget />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/fitness" element={<Fitness />} />
          <Route path="/fitness/:statType" element={<StatDetail />} />
        </Routes>
      </Router>
    </div>
  )
}
