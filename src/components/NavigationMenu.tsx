import { LucideBook, LucideHeartPulse, LucideHouse, LucideSettings, LucideTrophy, LucideWallet } from 'lucide-react'
import { MenuBar } from './ui/bottom-menu'

export default function NavigationMenu() {
  const items = [{
    icon: () => <LucideHouse />,
    label: 'Dashboard',
    to: "/dashboard",

  }, {
    icon: () => <LucideBook />,
    label: 'Academics',
    to: "/academics",

  }, {
    icon: () => <LucideWallet />,
    label: "Finances",
    to: "/finances",
  }, {
    icon: () => <LucideHeartPulse />,
    label: "Fitness",
    to: "/fitness",
  }, {
    icon: () => <LucideTrophy />,
    label: "Leaderboard",
    to: "/leaderboard",

  }, {
    icon: () => <LucideSettings />,
    label: "Settings",
    to: "/settings",
  }]

  return (
    <nav className='fixed bottom-4 inset-x-2 flex justify-center'>
      <MenuBar items={items} />
    </nav>
  )
}
