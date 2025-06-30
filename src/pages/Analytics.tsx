import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Eye, MousePointer, TrendingUp, ArrowLeft } from 'lucide-react'
import { getAnalytics } from '../utils/api'
import { AnalyticsData } from '../types'
import toast from 'react-hot-toast'

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      const data = await getAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateEngagementRate = () => {
    if (!analytics || analytics.views === 0) return 0
    return ((analytics.clicks / analytics.views) * 100).toFixed(1)
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
              <BarChart3 className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Track business profile engagement and performance</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={loadAnalytics}
          className="btn btn-secondary"
        >
          Refresh Data
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">
                {analytics?.views.toLocaleString() || 0}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Business profile page views across the platform
            </p>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-success-100 rounded-lg">
              <MousePointer className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              <p className="text-3xl font-bold text-gray-900">
                {analytics?.clicks.toLocaleString() || 0}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Engagement actions taken by users
            </p>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-secondary-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {calculateEngagementRate()}%
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Percentage of views that result in clicks
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Overview */}
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Profile Views</span>
                  <span className="text-sm text-gray-600">{analytics?.views || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: analytics?.views ? `${Math.min((analytics.views / Math.max(analytics.views, analytics?.clicks || 1)) * 100, 100)}%` : '0%' 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">User Interactions</span>
                  <span className="text-sm text-gray-600">{analytics?.clicks || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-success-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: analytics?.clicks && analytics?.views ? `${(analytics.clicks / analytics.views) * 100}%` : '0%' 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Insights</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">View Performance</span>
                </div>
                <p className="text-sm text-blue-800">
                  {analytics?.views ? (
                    analytics.views > 100 ? 
                      'Great visibility! Your businesses are getting good exposure.' :
                      'Building momentum. Consider promoting featured listings.'
                  ) : (
                    'Start tracking by viewing business profiles.'
                  )}
                </p>
              </div>
              
              <div className="p-4 bg-success-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <MousePointer className="h-4 w-4 text-success-600" />
                  <span className="text-sm font-medium text-success-900">Engagement</span>
                </div>
                <p className="text-sm text-success-800">
                  {analytics?.clicks ? (
                    parseFloat(calculateEngagementRate()) > 10 ?
                      'Excellent engagement rate! Users are actively interacting.' :
                      'Good engagement. Consider optimizing business profiles.'
                  ) : (
                    'No interactions yet. Encourage users to engage with listings.'
                  )}
                </p>
              </div>
              
              <div className="p-4 bg-warning-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-warning-600" />
                  <span className="text-sm font-medium text-warning-900">Growth Opportunity</span>
                </div>
                <p className="text-sm text-warning-800">
                  Focus on premium listings and improved business profiles to increase engagement rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recommended Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/search?premium=true"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                  <TrendingUp className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Promote Premium</p>
                  <p className="text-xs text-gray-600">Boost featured listings</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/create-business"
              className="p-4 border border-gray-200 rounded-lg hover:border-success-300 hover:bg-success-50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success-100 rounded-lg group-hover:bg-success-200 transition-colors">
                  <BarChart3 className="h-4 w-4 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Add Content</p>
                  <p className="text-xs text-gray-600">Create more listings</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/admin/leads"
              className="p-4 border border-gray-200 rounded-lg hover:border-secondary-300 hover:bg-secondary-50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary-100 rounded-lg group-hover:bg-secondary-200 transition-colors">
                  <Eye className="h-4 w-4 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Review Leads</p>
                  <p className="text-xs text-gray-600">Check user inquiries</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
