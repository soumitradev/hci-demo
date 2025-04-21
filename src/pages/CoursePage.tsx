import { CirclePlus, MoreVertical, ArrowLeft } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'

interface Assessment {
  type: string
  date: string
  isUpcoming?: boolean
}

interface CourseLink {
  title: string
  url: string
}

interface Course {
  courseCode: string
  courseName: string
  assessments: Assessment[]
  links: CourseLink[]
  progress: number
}

// This would typically come from an API or database
const courseData: Record<string, Course> = {
  'bits-f363': {
    courseCode: 'BITS F363',
    courseName: 'Human Computer Interaction',
    assessments: [
      {
        type: 'Quiz 1',
        date: 'Feb 18, 2025',
        isUpcoming: false
      },
      {
        type: 'Midsem',
        date: 'March 6, 2025',
        isUpcoming: false
      },
      {
        type: 'Quiz 2',
        date: 'March 17, 2025',
        isUpcoming: true
      },
      {
        type: 'Compre',
        date: 'April 26, 2025',
        isUpcoming: false
      }
    ],
    links: [
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
    ],
    progress: 10
  },
  'cs-f363': {
    courseCode: 'CS F363',
    courseName: 'Compiler Construction',
    assessments: [
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
        date: 'March 8, 2025',
        isUpcoming: false
      },
      {
        type: 'Lab 2',
        date: 'March 20, 2025',
        isUpcoming: false
      },
      {
        type: 'Compre',
        date: 'April 28, 2025',
        isUpcoming: false
      }
    ],
    links: [
      {
        title: 'Study Material',
        url: '#'
      },
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
    ],
    progress: 30
  },
  'cs-f303': {
    courseCode: 'CS F303',
    courseName: 'Computer Networks',
    assessments: [
      {
        type: 'Quiz 1',
        date: 'Feb 20, 2025',
        isUpcoming: true
      },
      {
        type: 'Midsem',
        date: 'March 10, 2025',
        isUpcoming: false
      },
      {
        type: 'Project Demo',
        date: 'March 25, 2025',
        isUpcoming: false
      },
      {
        type: 'Quiz 2',
        date: 'April 5, 2025',
        isUpcoming: false
      },
      {
        type: 'Compre',
        date: 'April 30, 2025',
        isUpcoming: false
      }
    ],
    links: [
      {
        title: 'Study Material',
        url: '#'
      },
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
    ],
    progress: 50
  }
}

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const course = courseData[courseId || '']

  if (!course) {
    return <div>Course not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Back Button and Course Header */}
      <div className="space-y-4">
        <button 
          onClick={() => navigate('/academics')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Academics</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{course.courseCode}</h1>
        <h2 className="text-2xl text-gray-900">{course.courseName}</h2>
      </div>

      {/* Important Dates Section */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Important Dates</h3>
          <button className="text-gray-900 hover:text-purple-600 transition-colors">
            <CirclePlus className="h-7 w-7" />
          </button>
        </div>
        
        <div className="space-y-3">
          {course.assessments.map((assessment, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-900">{assessment.type}</span>
              <div className="flex items-center gap-4">
                <span className={`${assessment.isUpcoming ? 'text-amber-500' : 'text-gray-600'}`}>
                  {assessment.date}
                </span>
                <button className="text-gray-900 hover:text-purple-600 transition-colors">
                  <MoreVertical className="h-7 w-7" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Links Section */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Links</h3>
          <button className="text-gray-900 hover:text-purple-600 transition-colors">
            <CirclePlus className="h-7 w-7" />
          </button>
        </div>
        
        <div className="space-y-3">
          {course.links.map((link, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-900">{link.title}</span>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">...</span>
                <button className="text-gray-900 hover:text-purple-600 transition-colors">
                  <MoreVertical className="h-7 w-7" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Section */}
      <div className="mt-8 space-y-3">
        <h3 className="text-lg font-medium text-gray-900">Progress</h3>
        <div className="relative h-2">
          <div className="absolute inset-0 rounded-full bg-purple-100">
            <div 
              className="h-full rounded-full bg-purple-600 transition-all duration-500 ease-in-out"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 