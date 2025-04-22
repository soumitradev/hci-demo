import { LucideBook, LucideCalendar, LucideHeartPulse, LucideHouse, LucideSettings, LucideTrophy, LucideWallet } from 'lucide-react'
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
    icon: () => <LucideHeartPulse />,
    label: "Fitness",
    to: "/fitness",
  }, {
    icon: () => <LucideWallet />,
    label: "Finances",
    to: "/finances",
  }, {
    icon: () => <LucideCalendar />,
    label: 'Timetable',
    to: "/timetable",
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
