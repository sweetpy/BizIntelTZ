import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  MapPin, 
  TrendingUp, 
  Award, 
  Star, 
  MessageSquare, 
  Send, 
  Upload,
  Edit3,
  ExternalLink,
  Eye,
  MousePointer
} from 'lucide-react'
import { 
  getBusinessProfile, 
  getReviews, 
  postReview, 
  createLead, 
  trackEvent, 
  uploadMedia, 
  getMedia 
} from '../utils/api'
import { Business, Review, Lead } from '../types'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const BusinessProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const [business, setBusiness] = useState<Business | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [media, setMedia] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  const [leadData, setLeadData] = useState({ name: '', message: '' })

  useEffect(() => {
    if (id) {
      loadBusinessData()
      trackViewEvent()
    }
  }, [id])

  const loadBusinessData = async () => {
    if (!id) return
    
    try {
      setIsLoading(true)
      const [businessData, reviewsData, mediaData] = await Promise.all([
        getBusinessProfile(id),
        getReviews(id),
        getMedia(id)
      ])
      
      setBusiness(businessData)
      setReviews(reviewsData)
      setMedia(mediaData)
    } catch (error) {
      console.error('Error loading business data:', error)
      toast.error('Failed to load business profile')
    } finally {
      setIsLoading(false)
    }
  }

  const trackViewEvent = async () => {
    if (!id) return
    
    try {
      await trackEvent({ business_id: id, action: 'view' })
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  const trackClickEvent = async () => {
    if (!id) return
    
    try {
      await trackEvent({ business_id: id, action: 'click' })
    } catch (error) {
      console.error('Error tracking click:', error)
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      await postReview({
        business_id: id,
        rating: reviewData.rating,
        comment: reviewData.comment || undefined
      })
      
      toast.success('Review submitted successfully!')
      setShowReviewForm(false)
      setReviewData({ rating: 5, comment: '' })
      
      // Reload reviews
      const updatedReviews = await getReviews(id)
      setReviews(updatedReviews)
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review')
    }
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      await createLead({
        business_id: id,
        name: leadData.name,
        message: leadData.message
      })
      
      toast.success('Message sent successfully!')
      setShowLeadForm(false)
      setLeadData({ name: '', message: '' })
    } catch (error) {
      console.error('Error submitting lead:', error)
      toast.error('Failed to send message')
    }
  }

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !id) return

    try {
      await uploadMedia(id, file)
      toast.success('Media uploaded successfully!')
      
      // Reload media
      const updatedMedia = await getMedia(id)
      setMedia(updatedMedia)
    } catch (error) {
      console.error('Error uploading media:', error)
      toast.error('Failed to upload media')
    }
  }

  const getDigitalScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400'
    if (score >= 80) return 'text-success-600'
    if (score >= 60) return 'text-warning-600'
    return 'text-error-600'
  }

  const getDigitalScoreBg = (score?: number) => {
    if (!score) return 'bg-gray-100'
    if (score >= 80) return 'bg-success-100'
    if (score >= 60) return 'bg-warning-100'
    return 'bg-error-100'
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="card p-8 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Business Not Found</h1>
          <p className="text-gray-600 mb-8">The business you're looking for doesn't exist.</p>
          <Link to="/search" className="btn btn-primary">
            Back to Search
          </Link>
        </div>
      </div>
    )
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          to="/search" 
          className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          ← Back to Search
        </Link>
        
        {isAuthenticated && (
          <Link
            to={`/edit-business/${business.id}`}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Business</span>
          </Link>
        )}
      </div>

      {/* Business Info */}
      <div className="card p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
              {business.premium && (
                <div className="flex items-center space-x-1 bg-secondary-100 px-3 py-1 rounded-full">
                  <Award className="h-4 w-4 text-secondary-600" />
                  <span className="text-sm font-medium text-secondary-600">Premium</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              {business.region && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{business.region}</span>
                </div>
              )}
              {business.sector && (
                <div className="bg-gray-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium">{business.sector}</span>
                </div>
              )}
              {business.formality && (
                <div className="bg-blue-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-blue-600">{business.formality}</span>
                </div>
              )}
            </div>
          </div>
          
          {business.digital_score && (
            <div className={`${getDigitalScoreBg(business.digital_score)} px-4 py-3 rounded-xl`}>
              <div className="flex items-center space-x-2">
                <TrendingUp className={`h-5 w-5 ${getDigitalScoreColor(business.digital_score)}`} />
                <span className={`text-xl font-bold ${getDigitalScoreColor(business.digital_score)}`}>
                  {business.digital_score}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Digital Score</p>
            </div>
          )}
        </div>

        {/* Reviews Summary */}
        {reviews.length > 0 && (
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 text-warning-500 fill-current" />
              <span className="font-semibold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-600">
              {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setShowLeadForm(true)
              trackClickEvent()
            }}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Contact Business</span>
          </button>
          
          <button
            onClick={() => setShowReviewForm(true)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Write Review</span>
          </button>
          
          {isAuthenticated && (
            <label className="btn btn-secondary cursor-pointer flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload Media</span>
              <input
                type="file"
                onChange={handleMediaUpload}
                className="hidden"
                accept="image/*,video/*"
              />
            </label>
          )}
        </div>
      </div>

      {/* Media Gallery */}
      {media.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Media Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {media.map((filename, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 truncate">{filename}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
          <button
            onClick={() => setShowReviewForm(true)}
            className="btn btn-primary text-sm"
          >
            Write Review
          </button>
        </div>
        
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating 
                          ? 'text-warning-500 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {review.rating}/5
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-700">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reviews yet. Be the first to review this business!</p>
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating })}
                      className="p-1"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          rating <= reviewData.rating
                            ? 'text-warning-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (optional)
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className="input h-24 resize-none"
                  placeholder="Share your experience..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Form Modal */}
      {showLeadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Business</h3>
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={leadData.name}
                  onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                  className="input"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  required
                  value={leadData.message}
                  onChange={(e) => setLeadData({ ...leadData, message: e.target.value })}
                  className="input h-24 resize-none"
                  placeholder="How can this business help you?"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowLeadForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BusinessProfile