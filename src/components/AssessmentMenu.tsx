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

  // Position the menu relative to the button
  const buttonRect = buttonRef.current?.getBoundingClientRect()
  const menuStyle = buttonRect ? {
    position: 'fixed' as const,
    top: `${buttonRect.bottom + 5}px`,
    right: `${window.innerWidth - buttonRect.right}px`,
  } : {}

  return (
    <div 
      ref={menuRef}
      className="bg-white rounded-lg shadow-lg py-1 w-32 z-50"
      style={menuStyle}
    >
      <button
        onClick={() => {
          onEdit()
          onClose()
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
      >
        Edit
      </button>
      <button
        onClick={() => {
          onDelete()
          onClose()
        }}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
      >
        Delete
      </button>
    </div>
  )
} 