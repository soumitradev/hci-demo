import { useRef, useEffect } from 'react'

interface AssessmentMenuProps {
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  buttonRef: React.RefObject<HTMLButtonElement | null>
}

export default function AssessmentMenu({ isOpen, onClose, onEdit, onDelete, buttonRef }: AssessmentMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      ref={menuRef}
      className="bg-popover text-popover-foreground rounded-md border shadow-md py-1 w-32"
    >
      <button
        onClick={() => {
          onEdit()
          onClose()
        }}
        className="w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
      >
        Edit
      </button>
      <button
        onClick={() => {
          onDelete()
          onClose()
        }}
        className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-accent hover:text-destructive"
      >
        Delete
      </button>
    </div>
  )
} 