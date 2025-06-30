import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Building2, Save, ArrowLeft, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { getBusinessProfile, updateBusiness, deleteBusiness } from '../utils/api'
import { Business, BusinessUpdate } from '../types'
import toast from 'react-hot-toast'

const EditBusiness: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BusinessUpdate>()

  const regions = [
    'Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Morogoro', 
    'Tanga', 'Kahama', 'Tabora', 'Kigoma', 'Sumbawanga', 'Kasulu'
  ]

  const sectors = [
    'Agriculture', 'Manufacturing', 'Services', 'Trade', 'Technology', 
    'Healthcare', 'Education', 'Tourism', 'Mining', 'Finance', 'Transport'
  ]

  const formalityOptions = [
    'Formal', 'Informal', 'Semi-formal'
  ]

  useEffect(() => {
    if (id) {
      loadBusiness()
    }
  }, [id])

  const loadBusiness = async () => {
    if (!id) return
    
    try {
      setIsLoading(true)
      const business = await getBusinessProfile(id)
      reset(business)
    } catch (error) {
      console.error('Error loading business:', error)
      toast.error('Failed to load business data')
      navigate('/search')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: BusinessUpdate) => {
    if (!id) return
    
    try {
      setIsSubmitting(true)
      await updateBusiness(id, data)
      toast.success('Business updated successfully!')
      navigate(`/business/${id}`)
    } catch (error) {
      console.error('Error updating business:', error)
      toast.error('Failed to update business')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    
    try {
      setIsDeleting(true)
      await deleteBusiness(id)
      toast.success('Business deleted successfully!')
      navigate('/search')
    } catch (error) {
      console.error('Error deleting business:', error)
      toast.error('Failed to delete business')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="card p-8 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate(`/business/${id}`)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Profile</span>
        </button>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-600 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Business</h1>
              <p className="text-gray-600">Update business information</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn btn-error flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="card">
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                {...register('name', { required: 'Business name is required' })}
                className="input"
                placeholder="Enter business name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
              )}
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Region
              </label>
              <select
                {...register('region')}
                className="input"
              >
                <option value="">Select region</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Sector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sector
              </label>
              <select
                {...register('sector')}
                className="input"
              >
                <option value="">Select sector</option>
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>

            {/* Digital Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digital Score (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                {...register('digital_score', { 
                  min: { value: 0, message: 'Score must be between 0 and 100' },
                  max: { value: 100, message: 'Score must be between 0 and 100' }
                })}
                className="input"
                placeholder="Enter digital score"
              />
              {errors.digital_score && (
                <p className="mt-1 text-sm text-error-600">{errors.digital_score.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Digital presence score based on online visibility and engagement
              </p>
            </div>

            {/* Formality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formality
              </label>
              <select
                {...register('formality')}
                className="input"
              >
                <option value="">Select formality level</option>
                {formalityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Premium */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="premium"
                {...register('premium')}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="premium" className="flex items-center space-x-2 cursor-pointer">
                <span className="text-sm font-medium text-gray-700">Premium Listing</span>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Enhanced visibility and features
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/business/${id}`)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-error-100 rounded-lg">
                <Trash2 className="h-5 w-5 text-error-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Business</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this business? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn btn-error"
              >
                {isDeleting ? 'Deleting...' : 'Delete Business'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditBusiness
