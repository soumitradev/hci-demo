import { Home, Book, DollarSign, Trophy } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from './ui/button'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 bg-background border-t">
      <Button 
        variant="ghost"
        className={`h-16 w-16 p-0 ${
          location.pathname === '/' ? 'text-[hsl(var(--primary))]' : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => navigate('/')}
        aria-label="Home"
      >
        <Home className="size-6" />
      </Button>
      <Button 
        variant="ghost"
        className={`h-16 w-16 p-0 ${
          location.pathname === '/academics' ? 'text-[hsl(var(--primary))]' : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => navigate('/academics')}
        aria-label="Academics"
      >
        <Book className="size-6" />
      </Button>
      <Button 
        variant="ghost"
        className={`h-16 w-16 p-0 ${
          location.pathname === '/finance' ? 'text-[hsl(var(--primary))]' : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => navigate('/finance')}
        aria-label="Finances"
      >
        <DollarSign className="size-6" />
      </Button>
      <Button 
        variant="ghost"
        className={`h-16 w-16 p-0 ${
          location.pathname === '/leaderboard' ? 'text-[hsl(var(--primary))]' : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => navigate('/leaderboard')}
        aria-label="Leaderboard"
      >
        <Trophy className="size-6" />
      </Button>
    </nav>
  )
} 