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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEditing ? "Edit Assessment" : "Add New Assessment"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-foreground">Assessment Type</Label>
            <Input
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Quiz, Test, etc."
              required
              className="bg-background text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-foreground">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="bg-background text-foreground"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="text-foreground">
              Cancel
            </Button>
            <Button type="submit" variant="secondary">{isEditing ? "Update Assessment" : "Add Assessment"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 