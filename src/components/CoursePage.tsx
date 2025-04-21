import { CirclePlus, MoreVertical, ArrowLeft } from 'lucide-react'
import { useCourseStore } from '../lib/store'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useMemo } from 'react'
import AddAssessmentModal from './AddAssessmentModal'
import AssessmentMenu from './AssessmentMenu'
import { formatDate, parseDate, calculateCourseProgress } from '../lib/utils'

interface Assessment {
  type: string
  date: string
  isUpcoming?: boolean
}

interface CourseLink {
  title: string
  url: string
}

interface CoursePageProps {
  courseCode: string
  courseName: string
  assessments: Assessment[]
  links: CourseLink[]
  courseId: string
}

export default function CoursePage({
  courseCode,
  courseName,
  assessments,
  links,
  courseId
}: CoursePageProps) {
  const navigate = useNavigate()
  const nextAssessment = useCourseStore((state) => state.getNextAssessment(courseId))
  const updateCourse = useCourseStore((state) => state.updateCourse)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [menuState, setMenuState] = useState<{ isOpen: boolean; index: number }>({
    isOpen: false,
    index: -1,
  })
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // Sort and categorize assessments, calculate progress
  const { sortedAssessments, hasUpcoming, progress } = useMemo(() => {
    const today = new Date()
    const processed = assessments.map(assessment => ({
      ...assessment,
      dateObj: parseDate(assessment.date),
      isPast: parseDate(assessment.date) < today
    }))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())

    return {
      sortedAssessments: processed,
      hasUpcoming: processed.some(a => !a.isPast),
      progress: calculateCourseProgress(assessments)
    }
  }, [assessments])

  // Calculate color based on days left
  const getAssessmentColor = (days: number) => {
    if (days <= 7) return 'text-red-500'
    if (days <= 15) return 'text-amber-500' 
    return 'text-gray-600'
  }

  const handleAddAssessment = (newAssessment: Assessment) => {
    const updatedCourse = {
      ...useCourseStore.getState().courses[courseId],
      assessments: [...assessments, newAssessment]
    }
    updateCourse(courseId, updatedCourse)
  }

  const handleEditAssessment = (editedAssessment: Assessment) => {
    const updatedAssessments = assessments.map((assessment, index) => 
      index === menuState.index ? editedAssessment : assessment
    )
    const updatedCourse = {
      ...useCourseStore.getState().courses[courseId],
      assessments: updatedAssessments
    }
    updateCourse(courseId, updatedCourse)
  }

  const handleDeleteAssessment = () => {
    const updatedAssessments = assessments.filter((_, index) => index !== menuState.index)
    const updatedCourse = {
      ...useCourseStore.getState().courses[courseId],
      assessments: updatedAssessments
    }
    updateCourse(courseId, updatedCourse)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Course Header */}
      <div className="space-y-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-900 hover:text-purple-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-xl font-medium">{courseCode}</span>
        </button>
        <h2 className="text-2xl text-gray-900">{courseName}</h2>
      </div>

      {/* Important Dates Section */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Important Dates</h3>
          <button 
            onClick={() => {
              setSelectedAssessment(null)
              setIsModalOpen(true)
            }}
            className="text-gray-900 hover:text-purple-600 transition-colors"
          >
            <CirclePlus className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-3">
          {!hasUpcoming && (
            <p className="text-sm text-gray-500 italic">No upcoming assessments</p>
          )}
          
          {sortedAssessments.map((assessment, index) => {
            const isNextAssessment = nextAssessment?.type === assessment.type
            return (
              <div 
                key={index} 
                className="flex items-center justify-between"
              >
                <span className={`${assessment.isPast ? 'text-gray-500' : 'text-gray-900'}`}>
                  {assessment.type}
                </span>
                <div className="flex items-center gap-4">
                  <span className={`${
                    isNextAssessment 
                      ? getAssessmentColor(nextAssessment.daysLeft) 
                      : assessment.isPast 
                        ? 'text-gray-500' 
                        : 'text-gray-600'
                  }`}>
                    {formatDate(assessment.date)}
                  </span>
                  <button 
                    ref={menuState.index === index ? menuButtonRef : null}
                    onClick={(e) => {
                      const button = e.currentTarget
                      setMenuState({ isOpen: true, index })
                      // Update the ref to point to the clicked button
                      if (menuButtonRef.current !== button) {
                        menuButtonRef.current = button
                      }
                    }}
                    className="text-gray-900 hover:text-purple-600 transition-colors"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Links Section */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Links</h3>
          <button className="text-gray-900 hover:text-purple-600 transition-colors">
            <CirclePlus className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-3">
          {links.map((link, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-900">{link.title}</span>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">...</span>
                <button className="text-gray-900 hover:text-purple-600 transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Section */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Progress</h3>
          <span className="text-sm text-gray-600">{progress}%</span>
        </div>
        <div className="relative h-2">
          <div className="absolute inset-0 rounded-full bg-purple-100">
            <div 
              className="h-full rounded-full bg-purple-600 transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <AddAssessmentModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedAssessment(null)
        }}
        onAdd={handleAddAssessment}
        onEdit={handleEditAssessment}
        initialAssessment={selectedAssessment || undefined}
      />

      <AssessmentMenu
        isOpen={menuState.isOpen}
        onClose={() => setMenuState({ isOpen: false, index: -1 })}
        onEdit={() => {
          setSelectedAssessment(assessments[menuState.index])
          setIsModalOpen(true)
        }}
        onDelete={handleDeleteAssessment}
        buttonRef={menuButtonRef}
      />
    </div>
  )
} 