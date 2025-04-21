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
import FitnessWidget from "./components/FitnessWidget";
import Fitness from "./pages/Fitness";
import StatDetail from "./pages/StatDetail";
import { useCourseStore } from './lib/store';
import { useTimetableStore } from './stores/timetableStore';
import { useFinanceStore } from './stores/financeStore';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fitnessStats } from './data/fitnessData';

function Home() {
  const navigate = useNavigate();
  const { courses } = useCourseStore();
  const events = useTimetableStore(state => state.events);
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 py-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-2 mt-4">Lex</h1>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
          <p className="text-gray-600 mt-1">Here's your progress for today</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fitness and Academic Progress */}
          <div className="grid grid-cols-2 gap-4">
            {/* Fitness Widget - Already a donut chart */}
            <div className="col-span-1">
              <FitnessWidget steps={currentSteps} goal={stepsGoal} />
            </div>

            {/* Academic Progress */}
            <div 
              className="col-span-1 bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/academics')}
            >
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#9333EA"
                    strokeWidth="3"
                    strokeDasharray={`${averageProgress}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-900">{averageProgress}%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-800 text-center">Academic Progress</h3>
              <button 
                className="mt-2 text-xs text-gray-600 hover:text-gray-900 inline-flex items-center gap-1 mx-auto block"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/academics');
                }}
              >
                View All
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Monthly Spending */}
          <div 
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/finance')}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Monthly Spending</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-medium text-gray-900">₹{currentMonthSpending.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">/ ₹{totalBudget.toLocaleString()}</span>
                </div>
                <button 
                  className="mt-2 text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/finance');
                  }}
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="relative w-20 h-20">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#9333EA"
                    strokeWidth="3"
                    strokeDasharray={`${(currentMonthSpending / totalBudget) * 100}, 100`}
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div 
            className="md:col-span-2 bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/timetable')}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">Today's Schedule</h2>
              <button 
                className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/timetable');
                }}
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {todayEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {todayEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-3">
                    <div className="w-16 text-sm font-medium text-gray-900">{event.startTime}</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No more classes for today</p>
            )}
          </div>

          {/* Leaderboard Position */}
          <div 
            className="md:col-span-2 bg-orange-400 rounded-xl p-4 text-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/leaderboard')}
          >
            <div className="flex items-center gap-3">
              <span className="font-semibold text-lg">#4</span>
              <p className="font-medium">You are doing better than 93% of other students!</p>
            </div>
          </div>
        </div>
      </main>

      <Navbar />
    </div>
  )
}

export default function App() {
  return (
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
  )
}
