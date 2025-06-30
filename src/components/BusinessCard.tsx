import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, Award, TrendingUp } from 'lucide-react'
import { Business } from '../types'

interface BusinessCardProps {
  business: Business
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
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

  return (
    <div className="card hover:shadow-lg transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {business.name}
              </h3>
              {business.premium && (
                <div className="flex items-center space-x-1 bg-secondary-100 px-2 py-1 rounded-full">
                  <Award className="h-3 w-3 text-secondary-600" />
                  <span className="text-xs font-medium text-secondary-600">Premium</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              {business.region && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{business.region}</span>
                </div>
              )}
              {business.sector && (
                <div className="bg-gray-100 px-2 py-1 rounded-full">
                  <span className="text-xs font-medium">{business.sector}</span>
                </div>
              )}
            </div>
          </div>
          
          {business.digital_score && (
            <div className={`${getDigitalScoreBg(business.digital_score)} px-3 py-2 rounded-lg`}>
              <div className="flex items-center space-x-1">
                <TrendingUp className={`h-4 w-4 ${getDigitalScoreColor(business.digital_score)}`} />
                <span className={`text-sm font-semibold ${getDigitalScoreColor(business.digital_score)}`}>
                  {business.digital_score}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Digital Score</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {business.formality && (
              <div className="bg-blue-100 px-2 py-1 rounded-full">
                <span className="text-xs font-medium text-blue-600">
                  {business.formality}
                </span>
              </div>
            )}
          </div>
          
          <Link
            to={`/business/${business.id}`}
            className="btn btn-primary text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BusinessCard