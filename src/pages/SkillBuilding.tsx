import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Play, Award, BookOpen, ArrowLeft, Plus, Users, Clock } from 'lucide-react'
import { getCourses, getWebinars, getCertifications, enrollInCourse } from '../utils/api'
import { Course, Webinar, Certification, UserProgress } from '../types'
import toast from 'react-hot-toast'

const SkillBuilding: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  const categories = ['all', 'digital-marketing', 'business-management', 'finance', 'technology', 'sales', 'leadership']

  useEffect(() => {
    loadSkillBuildingData()
  }, [selectedCategory])

  const loadSkillBuildingData = async () => {
    try {
      setIsLoading(true)
      const [coursesData, webinarsData, certificationsData] = await Promise.all([
        getCourses(selectedCategory),
        getWebinars(),
        getCertifications()
      ])
      setCourses(coursesData)
      setWebinars(webinarsData)
      setCertifications(certificationsData)
    } catch (error) {
      console.error('Error loading skill building data:', error)
      toast.error('Failed to load learning content')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnrollInCourse = async (courseId: string) => {
    try {
      await enrollInCourse(courseId)
      toast.success('Successfully enrolled in course!')
      await loadSkillBuildingData()
    } catch (error) {
      console.error('Error enrolling in course:', error)
      toast.error('Failed to enroll in course')
    }
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-success-100 text-success-800'
      case 'intermediate': return 'bg-warning-100 text-warning-800'
      case 'advanced': return 'bg-error-100 text-error-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-error-100 text-error-800'
      case 'upcoming': return 'bg-warning-100 text-warning-800'
      case 'recorded': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Skill-Building Content Platform</h1>
              <p className="text-gray-600">Webinars, tutorials, and business certification programs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Categories:</span>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Available Courses</p>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success-100 rounded-lg">
              <Play className="h-5 w-5 text-success-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Live Webinars</p>
              <p className="text-2xl font-bold text-gray-900">
                {webinars.filter(w => w.status === 'live').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Award className="h-5 w-5 text-warning-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Certifications</p>
              <p className="text-2xl font-bold text-gray-900">{certifications.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <Users className="h-5 w-5 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Learners</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.reduce((sum, course) => sum + course.enrolled_count, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Webinars */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Live & Upcoming Webinars</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webinars.slice(0, 6).map((webinar) => (
              <div key={webinar.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(webinar.status)}`}>
                    {webinar.status}
                  </span>
                  <span className="text-xs text-gray-600">{webinar.duration} min</span>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2">{webinar.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{webinar.description}</p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{webinar.scheduled_date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{webinar.registered_count} registered</span>
                  </div>
                </div>
                
                <button className={`w-full btn text-sm ${
                  webinar.status === 'live' ? 'btn-error' : 'btn-primary'
                }`}>
                  {webinar.status === 'live' ? 'Join Live' : 
                   webinar.status === 'upcoming' ? 'Register' : 'Watch Recording'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Featured Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-white" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                      <span className="text-sm font-medium text-primary-600">{course.price ? `$${course.price}` : 'Free'}</span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center justify-between">
                        <span>Duration:</span>
                        <span>{course.duration} hours</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Enrolled:</span>
                        <span>{course.enrolled_count} students</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Rating:</span>
                        <div className="flex items-center space-x-1">
                          <span>{course.rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Award
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(course.rating) 
                                    ? 'text-warning-500 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleEnrollInCourse(course.id)}
                      className="w-full btn btn-primary text-sm"
                    >
                      {course.is_enrolled ? 'Continue Learning' : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certifications */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Professional Certifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <div key={cert.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-warning-100 rounded-lg">
                    <Award className="h-6 w-6 text-warning-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{cert.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{cert.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Duration:</span>
                        <p>{cert.duration} weeks</p>
                      </div>
                      <div>
                        <span className="font-medium">Prerequisites:</span>
                        <p>{cert.prerequisites}</p>
                      </div>
                      <div>
                        <span className="font-medium">Issued by:</span>
                        <p>{cert.issuer}</p>
                      </div>
                      <div>
                        <span className="font-medium">Valid for:</span>
                        <p>{cert.validity_period}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600">
                        ${cert.price}
                      </span>
                      <button className="btn btn-primary text-sm">
                        Start Certification
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Path Recommendations */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recommended Learning Paths</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Digital Marketing Mastery</h4>
              <p className="text-sm text-blue-800 mb-3">
                Complete path covering SEO, social media, content marketing, and analytics.
              </p>
              <div className="text-xs text-blue-700 mb-3">4 courses • 24 hours • Certification included</div>
              <button className="btn btn-primary text-sm w-full">Start Learning Path</button>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-success-50 to-success-100 rounded-lg">
              <h4 className="font-semibold text-success-900 mb-2">Business Leadership</h4>
              <p className="text-sm text-success-800 mb-3">
                Develop leadership skills, team management, and strategic thinking.
              </p>
              <div className="text-xs text-success-700 mb-3">6 courses • 36 hours • Professional Certificate</div>
              <button className="btn btn-success text-sm w-full">Start Learning Path</button>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-warning-50 to-warning-100 rounded-lg">
              <h4 className="font-semibold text-warning-900 mb-2">Financial Management</h4>
              <p className="text-sm text-warning-800 mb-3">
                Master business finance, budgeting, investment, and financial planning.
              </p>
              <div className="text-xs text-warning-700 mb-3">5 courses • 30 hours • Industry Recognition</div>
              <button className="btn btn-warning text-sm w-full">Start Learning Path</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillBuilding