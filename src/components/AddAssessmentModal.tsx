import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Assessment {
  type: string
  date: string
}

interface AddAssessmentModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (assessment: Assessment) => void
  onEdit?: (assessment: Assessment) => void
  initialAssessment?: Assessment
}

export default function AddAssessmentModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  onEdit,
  initialAssessment 
}: AddAssessmentModalProps) {
  const [type, setType] = useState('')
  const [date, setDate] = useState('')
  const isEditing = !!initialAssessment

  useEffect(() => {
    if (initialAssessment) {
      setType(initialAssessment.type)
      // Convert date to YYYY-MM-DD format for input
      const dateObj = new Date(initialAssessment.date)
      setDate(dateObj.toISOString().split('T')[0])
    } else {
      setType('')
      setDate('')
    }
  }, [initialAssessment, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const assessment = { type, date }
    
    if (isEditing && onEdit) {
      onEdit(assessment)
    } else {
      onAdd(assessment)
    }
    
    setType('')
    setDate('')
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm rounded-xl bg-white/90 p-8 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Assessment' : 'Add Assessment'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Assessment Type
            </label>
            <input
              type="text"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="block w-full rounded-lg border-gray-300 bg-white/50 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full rounded-lg border-gray-300 bg-white/50 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {isEditing ? 'Save Changes' : 'Add Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 