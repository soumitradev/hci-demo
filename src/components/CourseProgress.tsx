import { useNavigate } from 'react-router-dom'
import { useCourseStore } from '../lib/store'
import { calculateCourseProgress } from '../lib/utils'
import { useMemo } from 'react'
import { Progress } from './ui/progress'
import { Card } from './ui/card'

interface CourseProgressProps {
  courseId: string
}

export default function CourseProgress({ courseId }: CourseProgressProps) {
  const navigate = useNavigate()
  const { courses, getNextAssessment } = useCourseStore()
  const course = courses[courseId]
  const nextAssessment = getNextAssessment(courseId)
  
  if (!course) return null

  const progress = useMemo(() => calculateCourseProgress(course.assessments), [course.assessments])

  // Calculate color based on days left
  const getAssessmentColor = (days: number) => {
    if (days <= 7) return 'text-destructive'
    if (days <= 15) return 'text-yellow-500' 
    return 'text-foreground'
  }

  // Convert course code to URL-friendly format
  const getCourseId = (code: string) => {
    return code.toLowerCase().replace(/\s+/g, '-')
  }

  // Format the next assessment text
  const getNextAssessmentText = (assessment: { type: string; daysLeft: number }) => {
    if (assessment.daysLeft === 0) return `${assessment.type} due today`
    if (assessment.daysLeft === 1) return `${assessment.type} due tomorrow`
    return `${assessment.type} due in ${assessment.daysLeft} days`
  }

  return (
    <Card 
      className="p-3 cursor-pointer hover:bg-accent transition-colors"
      onClick={() => navigate(`/courses/${getCourseId(course.courseCode)}`)}
    >
      {/* Course Title */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="font-semibold text-foreground">{course.courseCode}</span>
        <span className="text-muted-foreground">-</span>
        <span className="text-muted-foreground">{course.courseName}</span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 mb-2">
        <div className="flex justify-between items-center gap-2">
          <Progress value={progress} className="flex-1 h-2" />
          <span className="text-sm font-medium text-foreground">{progress}%</span>
        </div>
      </div>

      {/* Next Assessment */}
      <div>
        {nextAssessment ? (
          <span className={`text-sm font-medium ${getAssessmentColor(nextAssessment.daysLeft)}`}>
            Next: {getNextAssessmentText(nextAssessment)}
          </span>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">
            All evaluations complete
          </span>
        )}
      </div>
    </Card>
  )
} 