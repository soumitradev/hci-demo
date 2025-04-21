import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Assessment' : 'Add Assessment'}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">Assessment Type</Label>
            <Input
              type="text"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" variant="secondary">
              {isEditing ? 'Save Changes' : 'Add Assessment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 