import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CourseProgress from '../components/CourseProgress'
import Navbar from '../components/Navbar'
import { useCourseStore } from '../lib/store'

export default function Academics() {
  const navigate = useNavigate()
  const { courses } = useCourseStore()
  const courseIds = Object.keys(courses)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Academics</h1>

        {/* Courses and Timetable Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Courses</h2>
          <button 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            onClick={() => navigate('/timetable')}
          >
            Timetable
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Course List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courseIds.map((courseId) => (
            <CourseProgress key={courseId} courseId={courseId} />
          ))}
        </div>
      </main>

      <Navbar />
    </div>
  )
} 