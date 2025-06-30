import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Save, ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { createBusiness } from '../utils/api'
import { BusinessCreate } from '../types'
import toast from 'react-hot-toast'

const CreateBusiness: React.FC = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<BusinessCreate>()

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

  const onSubmit = async (data: BusinessCreate) => {
    try {
      setIsSubmitting(true)
      const business = await createBusiness(data)
      toast.success('Business created successfully!')
      navigate(`/business/${business.id}`)
    } catch (error) {
      console.error('Error creating business:', error)
      toast.error('Failed to create business')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary-600 rounded-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Business</h1>
            <p className="text-gray-600">Create a new business listing</p>
          </div>
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
                onClick={() => navigate(-1)}
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
                <span>{isSubmitting ? 'Creating...' : 'Create Business'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateBusiness
