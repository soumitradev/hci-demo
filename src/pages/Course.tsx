import CoursePage from '../components/CoursePage'
import { useCourseStore } from '../lib/store'
import { useParams } from 'react-router-dom'

export default function Course() {
  const { courseId } = useParams()
  const { courses } = useCourseStore()
  const course = courseId ? courses[courseId] : null

  if (!course) {
    return <div>Course not found</div>
  }

  return <CoursePage {...course} courseId={courseId!} />
} 