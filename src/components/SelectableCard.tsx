import { LucideIcon } from 'lucide-react'

interface SelectableCardProps {
  icon: LucideIcon
  title: string
  onClick?: () => void
}

export function SelectableCard({ icon: Icon, title, onClick }: SelectableCardProps) {
  return (
    <div 
      className="w-full bg-card rounded-2xl border border-border p-4 cursor-pointer hover:bg-accent transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-foreground font-medium">{title}</span>
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
} 