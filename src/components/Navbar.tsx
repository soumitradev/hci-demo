import { Home, Book, DollarSign, Trophy } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 bg-white border-t border-gray-200">
      <button 
        className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
          location.pathname === '/' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'
        }`}
        onClick={() => navigate('/')}
        aria-label="Home"
      >
        <Home className="w-6 h-6" />
      </button>
      <button 
        className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
          location.pathname === '/academics' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'
        }`}
        onClick={() => navigate('/academics')}
        aria-label="Academics"
      >
        <Book className="w-6 h-6" />
      </button>
      <button 
        className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
          location.pathname === '/finance' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'
        }`}
        onClick={() => navigate('/finance')}
        aria-label="Finances"
      >
        <DollarSign className="w-6 h-6" />
      </button>
      <button 
        className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
          location.pathname === '/leaderboard' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'
        }`}
        onClick={() => navigate('/leaderboard')}
        aria-label="Leaderboard"
      >
        <Trophy className="w-6 h-6" />
      </button>
    </nav>
  )
} 