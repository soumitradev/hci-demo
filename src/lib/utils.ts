import { clsx, type ClassValue } from "clsx"
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

  // Calculate progress based on completed assessments only
  const completedCount = processed.filter(a => a.isPast).length
  const totalCount = processed.length

  return Math.round((completedCount / totalCount) * 100)
} 