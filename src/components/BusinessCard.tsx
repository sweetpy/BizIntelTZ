import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, Award, TrendingUp, Shield, ShieldCheck, Copy } from 'lucide-react'
import { Business } from '../types'
import toast from 'react-hot-toast'

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

  const copyBIID = (biId: string) => {
    navigator.clipboard.writeText(biId)
    toast.success('BI ID copied to clipboard!')
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
              <div className="flex items-center space-x-1">
                {business.premium && (
                  <div className="flex items-center space-x-1 bg-secondary-100 px-2 py-1 rounded-full">
                    <Award className="h-3 w-3 text-secondary-600" />
                    <span className="text-xs font-medium text-secondary-600">Premium</span>
                  </div>
                )}
                {business.verified && (
                  <div className="flex items-center space-x-1 bg-success-100 px-2 py-1 rounded-full">
                    <ShieldCheck className="h-3 w-3 text-success-600" />
                    <span className="text-xs font-medium text-success-600">Verified</span>
                  </div>
                )}
                {business.claimed && !business.verified && (
                  <div className="flex items-center space-x-1 bg-warning-100 px-2 py-1 rounded-full">
                    <Shield className="h-3 w-3 text-warning-600" />
                    <span className="text-xs font-medium text-warning-600">Claimed</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* BI ID */}
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-blue-50 px-2 py-1 rounded border">
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-blue-600 font-medium">BI ID:</span>
                  <code className="text-xs text-blue-800 font-mono">{business.bi_id}</code>
                  <button
                    onClick={() => copyBIID(business.bi_id)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Copy BI ID"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
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