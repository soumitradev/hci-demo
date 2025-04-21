import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CourseProgress from '../components/CourseProgress'
import Navbar from '../components/Navbar'
import { useCourseStore } from '../lib/store'
import { Button } from '../components/ui/button'

export default function Academics() {
  const navigate = useNavigate()
  const { courses } = useCourseStore()
  const courseIds = Object.keys(courses)

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-4xl font-bold text-foreground mb-6">Academics</h1>

        {/* Courses and Timetable Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Courses</h2>
          <Button 
            variant="secondary"
            onClick={() => navigate('/timetable')}
            className="gap-2"
          >
            Timetable
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Course List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {courseIds.map((courseId) => (
            <CourseProgress key={courseId} courseId={courseId} />
          ))}
        </div>
      </main>

      <Navbar />
    </div>
  )
} 