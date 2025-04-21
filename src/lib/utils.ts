import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function parseDate(dateString: string): Date {
  return new Date(dateString)
}

interface Assessment {
  type: string
  date: string
}

export function calculateCourseProgress(assessments: Assessment[]): number {
  if (assessments.length === 0) return 0

  const today = new Date()
  const processed = assessments.map(assessment => ({
    ...assessment,
    dateObj: parseDate(assessment.date),
    isPast: parseDate(assessment.date) < today
  }))
  .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())

  const firstDate = processed[0].dateObj
  const lastDate = processed[processed.length - 1].dateObj
  const totalDuration = lastDate.getTime() - firstDate.getTime()
  
  // If all assessments are on the same day or there's only one assessment
  if (totalDuration === 0) {
    return today > lastDate ? 100 : 0
  }

  // Calculate progress based on time elapsed and completed assessments
  const elapsed = today.getTime() - firstDate.getTime()
  const completedCount = processed.filter(a => a.isPast).length
  const totalCount = processed.length

  // Weight time progress and completion progress equally
  const timeProgress = Math.min(100, (elapsed / totalDuration) * 100)
  const completionProgress = (completedCount / totalCount) * 100
  const averageProgress = Math.round((timeProgress + completionProgress) / 2)

  return Math.min(100, Math.max(0, averageProgress))
} 