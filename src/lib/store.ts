import { create } from 'zustand'
import { calculateCourseProgress } from './utils'

export interface Assessment {
  type: string
  date: string
  isUpcoming?: boolean
}

export interface CourseLink {
  title: string
  url: string
}

export interface Course {
  courseCode: string
  courseName: string
  assessments: Assessment[]
  links: CourseLink[]
  progress: number
}

interface CourseStore {
  courses: Record<string, Course>
  updateCourse: (courseId: string, course: Course) => void
  getNextAssessment: (courseId: string) => { type: string; daysLeft: number } | null
}

// Helper function to create a course with calculated progress
const createCourse = (
  courseCode: string, 
  courseName: string, 
  assessments: Assessment[], 
  links: CourseLink[]
): Course => ({
  courseCode,
  courseName,
  assessments,
  links,
  progress: calculateCourseProgress(assessments)
})

const initialCourses: Record<string, Course> = {
  'bits-f363': createCourse(
    'BITS F363',
    'Human Computer Interaction',
    [
      {
        type: 'Quiz 1',
        date: 'Feb 18, 2025',
        isUpcoming: false
      },
      {
        type: 'Midsem',
        date: 'Mar 6, 2025',
        isUpcoming: false
      },
      {
        type: 'Quiz 2',
        date: 'Mar 17, 2025',
        isUpcoming: true
      },
      {
        type: 'Compre',
        date: 'Apr 26, 2025',
        isUpcoming: false
      }
    ],
    [
      {
        title: 'Study Material',
        url: '#'
      },
      {
        title: 'Impartus',
        url: '#'
      },
      {
        title: 'Textbook PDF',
        url: '#'
      }
    ]
  ),
  'cs-f363': createCourse(
    'CS F363',
    'Compiler Construction',
    [
      {
        type: 'Lab 1',
        date: 'Feb 15, 2025',
        isUpcoming: false
      },
      {
        type: 'Quiz 1',
        date: 'Feb 22, 2025',
        isUpcoming: true
      },
      {
        type: 'Midsem',
        date: 'Mar 8, 2025',
        isUpcoming: false
      },
      {
        type: 'Lab 2',
        date: 'Mar 20, 2025',
        isUpcoming: false
      },
      {
        type: 'Compre',
        date: 'Apr 28, 2025',
        isUpcoming: false
      }
    ],
    [
      {
        title: 'Lab Manual',
        url: '#'
      },
      {
        title: 'Dragon Book PDF',
        url: '#'
      },
      {
        title: 'ANTLR Documentation',
        url: '#'
      }
    ]
  ),
  'cs-f303': createCourse(
    'CS F303',
    'Computer Networks',
    [
      {
        type: 'Quiz 1',
        date: 'Feb 20, 2025',
        isUpcoming: true
      },
      {
        type: 'Midsem',
        date: 'Mar 10, 2025',
        isUpcoming: false
      },
      {
        type: 'Project Demo',
        date: 'Mar 25, 2025',
        isUpcoming: false
      },
      {
        type: 'Quiz 2',
        date: 'Apr 5, 2025',
        isUpcoming: false
      },
      {
        type: 'Compre',
        date: 'Apr 30, 2025',
        isUpcoming: false
      }
    ],
    [
      {
        title: 'Wireshark Labs',
        url: '#'
      },
      {
        title: 'Kurose & Ross PDF',
        url: '#'
      },
      {
        title: 'Project Resources',
        url: '#'
      }
    ]
  )
}

// Cache for next assessments
const nextAssessmentCache = new Map<string, { type: string; daysLeft: number } | null>()

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: initialCourses,
  updateCourse: (courseId, course) => {
    // Calculate progress before updating
    const updatedCourse = {
      ...course,
      progress: calculateCourseProgress(course.assessments)
    }
    set((state) => ({
      courses: {
        ...state.courses,
        [courseId]: updatedCourse
      }
    }))
    // Clear cache when course is updated
    nextAssessmentCache.delete(courseId)
  },
  getNextAssessment: (courseId) => {
    // Check cache first
    if (nextAssessmentCache.has(courseId)) {
      return nextAssessmentCache.get(courseId)!
    }

    const course = get().courses[courseId]
    if (!course) return null

    const today = new Date()
    const upcomingAssessments = course.assessments
      .map(assessment => ({
        ...assessment,
        daysLeft: Math.ceil(
          (new Date(assessment.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        )
      }))
      .filter(assessment => assessment.daysLeft > 0)
      .sort((a, b) => a.daysLeft - b.daysLeft)

    const result = upcomingAssessments.length === 0 ? null : {
      type: upcomingAssessments[0].type,
      daysLeft: upcomingAssessments[0].daysLeft
    }

    // Cache the result
    nextAssessmentCache.set(courseId, result)
    return result
  }
})) 