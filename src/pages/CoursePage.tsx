import { useParams } from "react-router-dom"
import { useCourseStore } from "../lib/store"
import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Progress } from "../components/ui/progress"
import { Button } from "../components/ui/button"

export function CoursePage() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const course = useCourseStore(state => state.courses[courseId || ""])

  if (!course) {
    return <div>Course not found</div>
  }

  // Calculate days left and determine status for each assessment
  const today = new Date()
  const assessments = course.assessments.map(assessment => {
    const assessmentDate = new Date(assessment.date)
    const daysLeft = Math.ceil((assessmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return {
      ...assessment,
      daysLeft,
      isPast: assessmentDate < today
    }
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Function to get the appropriate text color based on days left
  const getStatusColor = (daysLeft: number, isPast: boolean) => {
    if (isPast) return "text-muted-foreground"
    if (daysLeft <= 0) return "text-destructive"
    if (daysLeft <= 7) return "text-destructive"
    if (daysLeft <= 14) return "text-yellow-600"
    return "text-muted-foreground"
  }

  // Function to format the date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Function to format the status text
  const getStatusText = (daysLeft: number, isPast: boolean) => {
    if (isPast) return "Completed"
    if (daysLeft === 0) return "Today"
    if (daysLeft === 1) return "Tomorrow"
    return `${daysLeft} days left`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-8">
          <Button 
            onClick={() => navigate('/academics')}
            variant="ghost"
            size="icon"
            className="rounded-full text-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-7 w-7" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{course.courseName}</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">{course.courseCode}</p>

        <div className="space-y-8">
          {/* Important Dates */}
          <div>
            <h2 className="text-lg font-medium mb-4">Important Dates</h2>
            <div className="space-y-4">
              {assessments.map((assessment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{assessment.type}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(assessment.date)}</p>
                  </div>
                  <span className={getStatusColor(assessment.daysLeft, assessment.isPast)}>
                    {getStatusText(assessment.daysLeft, assessment.isPast)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h2 className="text-lg font-medium mb-4">Links</h2>
            <div className="space-y-4">
              {course.links.map((link, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-foreground">{link.title}</span>
                  <span className="text-muted-foreground">...</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Progress</h2>
              <span className="text-sm text-muted-foreground">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  )
} 