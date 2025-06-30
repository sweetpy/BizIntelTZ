import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Star, TrendingUp, Users, ArrowLeft, Download } from 'lucide-react'
import { getFeedbackData, createSurvey, exportFeedbackData } from '../utils/api'
import { FeedbackData, Survey } from '../types'
import toast from 'react-hot-toast'

const FeedbackSurvey: React.FC = () => {
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateSurvey, setShowCreateSurvey] = useState(false)
  const [newSurvey, setNewSurvey] = useState<Survey>({
    title: '',
    description: '',
    questions: [{ question: '', type: 'rating', required: true }],
    active: true
  })

  useEffect(() => {
    loadFeedbackData()
  }, [])

  const loadFeedbackData = async () => {
    try {
      setIsLoading(true)
      const data = await getFeedbackData()
      setFeedbackData(data)
    } catch (error) {
      console.error('Error loading feedback data:', error)
      toast.error('Failed to load feedback data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSurvey = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createSurvey(newSurvey)
      toast.success('Survey created successfully!')
      setShowCreateSurvey(false)
      setNewSurvey({
        title: '',
        description: '',
        questions: [{ question: '', type: 'rating', required: true }],
        active: true
      })
      await loadFeedbackData()
    } catch (error) {
      console.error('Error creating survey:', error)
      toast.error('Failed to create survey')
    }
  }

  const addQuestion = () => {
    setNewSurvey({
      ...newSurvey,
      questions: [...newSurvey.questions, { question: '', type: 'rating', required: true }]
    })
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = newSurvey.questions.map((q, i) => 
      i === index ? { ...q, [field]: value } : q
    )
    setNewSurvey({ ...newSurvey, questions: updatedQuestions })
  }

  const removeQuestion = (index: number) => {
    if (newSurvey.questions.length > 1) {
      setNewSurvey({
        ...newSurvey,
        questions: newSurvey.questions.filter((_, i) => i !== index)
      })
    }
  }

  const handleExport = async () => {
    try {
      const blob = await exportFeedbackData()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `feedback-data-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('Feedback data exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
    }
  }

  const getNPSColor = (score: number) => {
    if (score >= 50) return 'text-success-600'
    if (score >= 0) return 'text-warning-600'
    return 'text-error-600'
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-success-600'
      case 'neutral': return 'text-warning-600'
      case 'negative': return 'text-error-600'
      default: return 'text-gray-600'
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
              <MessageSquare className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Feedback & Survey Management</h1>
              <p className="text-gray-600">NPS tracking, sentiment analysis, and user feedback</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button onClick={handleExport} className="btn btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
          <button
            onClick={() => setShowCreateSurvey(true)}
            className="btn btn-primary"
          >
            Create Survey
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : feedbackData && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Star className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">NPS Score</p>
                  <p className={`text-2xl font-bold ${getNPSColor(feedbackData.nps_score)}`}>
                    {feedbackData.nps_score}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success-100 rounded-lg">
                  <Users className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{feedbackData.response_rate}%</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Responses</p>
                  <p className="text-2xl font-bold text-gray-900">{feedbackData.total_responses}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{feedbackData.average_rating}/5</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Sentiment Distribution</h3>
                <div className="space-y-4">
                  {feedbackData.sentiment_breakdown.map((sentiment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 capitalize">{sentiment.sentiment}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              sentiment.sentiment === 'positive' ? 'bg-success-600' :
                              sentiment.sentiment === 'neutral' ? 'bg-warning-600' : 'bg-error-600'
                            }`}
                            style={{ width: `${sentiment.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{sentiment.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Feedback</h3>
                <div className="space-y-4">
                  {feedbackData.recent_feedback.map((feedback, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < feedback.rating 
                                  ? 'text-warning-500 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          feedback.sentiment === 'positive' ? 'bg-success-100 text-success-800' :
                          feedback.sentiment === 'neutral' ? 'bg-warning-100 text-warning-800' :
                          'bg-error-100 text-error-800'
                        }`}>
                          {feedback.sentiment}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{feedback.comment}</p>
                      <p className="text-xs text-gray-500 mt-2">{feedback.timestamp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* NPS Trends */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">NPS Trends</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {feedbackData.nps_trends.map((trend, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">{trend.period}</h4>
                    <p className={`text-2xl font-bold mt-2 ${getNPSColor(trend.score)}`}>
                      {trend.score}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{trend.responses} responses</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Create Survey Modal */}
      {showCreateSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Survey</h3>
            
            <form onSubmit={handleCreateSurvey} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={newSurvey.title}
                  onChange={(e) => setNewSurvey({ ...newSurvey, title: e.target.value })}
                  className="input"
                  placeholder="Survey title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newSurvey.description}
                  onChange={(e) => setNewSurvey({ ...newSurvey, description: e.target.value })}
                  className="input h-20 resize-none"
                  placeholder="Survey description"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">Questions</label>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="btn btn-secondary text-sm"
                  >
                    Add Question
                  </button>
                </div>
                
                <div className="space-y-4">
                  {newSurvey.questions.map((question, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
                        {newSurvey.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="text-error-600 hover:text-error-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            placeholder="Question text"
                            value={question.question}
                            onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                            className="input"
                            required
                          />
                        </div>
                        <div>
                          <select
                            value={question.type}
                            onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                            className="input"
                          >
                            <option value="rating">Rating (1-5)</option>
                            <option value="text">Text</option>
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="yes_no">Yes/No</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={question.required}
                            onChange={(e) => updateQuestion(index, 'required', e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">Required</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateSurvey(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Survey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedbackSurvey
