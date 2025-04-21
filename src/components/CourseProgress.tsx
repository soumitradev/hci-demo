import { useNavigate } from 'react-router-dom'
import { useCourseStore } from '../lib/store'
import { calculateCourseProgress } from '../lib/utils'
import { useMemo } from 'react'

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
    if (days <= 7) return 'text-red-500'
    if (days <= 15) return 'text-amber-500' 
    return 'text-gray-900'
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
    <div 
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => navigate(`/courses/${getCourseId(course.courseCode)}`)}
    >
      {/* Course Title */}
      <div className="flex items-center gap-2 mb-4">
        <span className="font-semibold text-gray-900">{course.courseCode}</span>
        <span className="text-gray-600">-</span>
        <span className="text-gray-600">{course.courseName}</span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <div className="h-2 flex-1 bg-purple-100 rounded-full overflow-hidden mr-3">
            <div 
              className="h-full bg-purple-600 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">{progress}%</span>
        </div>
      </div>

      {/* Next Assessment */}
      <div>
        {nextAssessment ? (
          <span className={`text-sm font-medium ${getAssessmentColor(nextAssessment.daysLeft)}`}>
            Next: {getNextAssessmentText(nextAssessment)}
          </span>
        ) : (
          <span className="text-sm font-medium text-gray-600">
            All evaluations complete
          </span>
        )}
      </div>
    </div>
  )
} 