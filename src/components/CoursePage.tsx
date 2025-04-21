import { CirclePlus, MoreVertical, ArrowLeft } from 'lucide-react'
import { useCourseStore } from '../lib/store'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useMemo } from 'react'
import AddAssessmentModal from './AddAssessmentModal'
import AssessmentMenu from './AssessmentMenu'
import { formatDate, parseDate } from '../lib/utils'
import { Progress } from './ui/progress'
import { Button } from './ui/button'

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
  const updateCourse = useCourseStore((state) => state.updateCourse)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [menuState, setMenuState] = useState<{ isOpen: boolean; index: number }>({
    isOpen: false,
    index: -1,
  })
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // Sort and categorize assessments, calculate progress
  const { sortedAssessments, progress } = useMemo(() => {
    const today = new Date()
    const processed = assessments.map(assessment => ({
      ...assessment,
      dateObj: parseDate(assessment.date),
      isPast: parseDate(assessment.date) < today
    }))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())

    // Calculate progress based on completed assessments
    const completedCount = processed.filter(a => a.isPast).length
    const totalCount = processed.length
    const progressValue = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    return {
      sortedAssessments: processed,
      progress: progressValue
    }
  }, [assessments])

  const getAssessmentColor = (days: number) => {
    if (days < 0) return 'text-muted-foreground'
    if (days === 0) return 'text-destructive'
    if (days <= 7) return 'text-destructive'
    if (days <= 15) return 'text-warning'
    return 'text-muted-foreground'
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedAssessment(null)
  }

  const handleAddClick = () => {
    setSelectedAssessment(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (assessment: Assessment) => {
    setSelectedAssessment(assessment)
    setIsModalOpen(true)
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/academics')}
          className="mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Academics
        </Button>

        <h2 className="text-2xl text-foreground">{courseName}</h2>
        <p className="text-sm text-muted-foreground mb-6">{courseCode}</p>

        <div className="space-y-8">
          {/* Important Dates Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-foreground">Important Dates</h3>
              <button
                onClick={handleAddClick}
                className="text-foreground hover:text-primary transition-colors"
              >
                <CirclePlus className="w-5 h-5" />
              </button>
            </div>

            {sortedAssessments.length > 0 ? (
              <div className="space-y-4">
                {sortedAssessments.map((assessment, index) => {
                  const days = Math.ceil(
                    (parseDate(assessment.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  )
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <span className={`${assessment.isPast ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {assessment.type}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(assessment.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={getAssessmentColor(days)}>
                          {days < 0 ? 'Past' : days === 0 ? 'Today' : `${days} days left`}
                        </span>
                        <div className="relative inline-block">
                          <button
                            ref={menuButtonRef}
                            onClick={() => setMenuState({ isOpen: !menuState.isOpen, index })}
                            className="p-1 hover:bg-accent rounded-full"
                          >
                            <MoreVertical className="w-4 h-4 text-foreground" />
                          </button>
                          {menuState.isOpen && menuState.index === index && (
                            <div className="absolute right-0 mt-1 z-50">
                              <AssessmentMenu
                                isOpen={true}
                                onClose={() => setMenuState({ isOpen: false, index: -1 })}
                                onEdit={() => {
                                  handleEditClick(assessment)
                                  setMenuState({ isOpen: false, index: -1 })
                                }}
                                onDelete={() => {
                                  handleDeleteAssessment()
                                  setMenuState({ isOpen: false, index: -1 })
                                }}
                                buttonRef={menuButtonRef}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No upcoming assessments</p>
            )}
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Links</h3>
            <div className="space-y-4">
              {links.map((link, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-foreground">{link.title}</span>
                  <span className="text-muted-foreground">...</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-foreground">Progress</h3>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <AddAssessmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onAdd={handleAddAssessment}
        onEdit={handleEditAssessment}
        initialAssessment={selectedAssessment || undefined}
      />
    </div>
  )
} 