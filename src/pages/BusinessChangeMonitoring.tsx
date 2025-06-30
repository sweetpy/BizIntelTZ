import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Activity, TrendingUp, AlertTriangle, Eye, ArrowLeft, Bell } from 'lucide-react'
import { getBusinessChanges, subscribeToChanges } from '../utils/api'
import { BusinessChangeData } from '../types'
import toast from 'react-hot-toast'

const BusinessChangeMonitoring: React.FC = () => {
  const [changeData, setChangeData] = useState<BusinessChangeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('')

  useEffect(() => {
    loadChangeData()
    const interval = setInterval(loadChangeData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadChangeData = async () => {
    try {
      setIsLoading(true)
      const data = await getBusinessChanges()
      setChangeData(data)
    } catch (error) {
      console.error('Error loading business changes:', error)
      toast.error('Failed to load business changes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubscribe = async (businessId: string) => {
    try {
      await subscribeToChanges(businessId)
      toast.success('Successfully subscribed to business changes!')
    } catch (error) {
      console.error('Error subscribing to changes:', error)
      toast.error('Failed to subscribe to changes')
    }
  }

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'digital_score': return 'text-blue-600'
      case 'region': return 'text-purple-600'
      case 'sector': return 'text-green-600'
      case 'premium': return 'text-warning-600'
      case 'verification': return 'text-success-600'
      default: return 'text-gray-600'
    }
  }

  const getChangeTypeBg = (type: string) => {
    switch (type) {
      case 'digital_score': return 'bg-blue-100'
      case 'region': return 'bg-purple-100'
      case 'sector': return 'bg-green-100'
      case 'premium': return 'bg-warning-100'
      case 'verification': return 'bg-success-100'
      default: return 'bg-gray-100'
    }
  }

  const getSignificanceLevel = (significance: number) => {
    if (significance >= 80) return { label: 'Critical', color: 'text-error-600', bg: 'bg-error-100' }
    if (significance >= 60) return { label: 'High', color: 'text-warning-600', bg: 'bg-warning-100' }
    if (significance >= 40) return { label: 'Medium', color: 'text-blue-600', bg: 'bg-blue-100' }
    return { label: 'Low', color: 'text-gray-600', bg: 'bg-gray-100' }
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
              <Activity className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Change Monitoring</h1>
              <p className="text-gray-600">Real-time tracking of business profile updates and changes</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Business ID to monitor"
            value={selectedBusinessId}
            onChange={(e) => setSelectedBusinessId(e.target.value)}
            className="input w-48"
          />
          <button
            onClick={() => selectedBusinessId && handleSubscribe(selectedBusinessId)}
            disabled={!selectedBusinessId}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Bell className="h-4 w-4" />
            <span>Subscribe</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : changeData && (
        <>
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Changes</p>
                  <p className="text-2xl font-bold text-gray-900">{changeData.change_summary.total_changes}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Significant</p>
                  <p className="text-2xl font-bold text-gray-900">{changeData.change_summary.significant_changes}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">New Businesses</p>
                  <p className="text-2xl font-bold text-gray-900">{changeData.change_summary.new_businesses}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary-100 rounded-lg">
                  <Eye className="h-5 w-5 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Updated</p>
                  <p className="text-2xl font-bold text-gray-900">{changeData.change_summary.updated_businesses}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Changes */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Business Changes</h3>
              <div className="space-y-4">
                {changeData.recent_changes.map((change, index) => {
                  const significance = getSignificanceLevel(change.significance)
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${getChangeTypeBg(change.change_type)}`}>
                          <Activity className={`h-4 w-4 ${getChangeTypeColor(change.change_type)}`} />
                        </div>
                        <div>
                          <Link
                            to={`/business/${change.business_id}`}
                            className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                          >
                            {change.business_name}
                          </Link>
                          <p className="text-sm text-gray-600">
                            {change.change_type.replace('_', ' ')} changed from "{change.old_value}" to "{change.new_value}"
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${significance.bg} ${significance.color}`}>
                          {significance.label}
                        </span>
                        <span className="text-sm text-gray-500">{change.timestamp}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Trending Changes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Trending Change Types</h3>
                <div className="space-y-4">
                  {changeData.trending_changes.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{trend.change_type.replace('_', ' ')}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${Math.min(trend.frequency / 10 * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{trend.frequency}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          trend.trend === 'up' ? 'bg-success-100 text-success-800' :
                          trend.trend === 'down' ? 'bg-error-100 text-error-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {trend.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Active Alerts</h3>
                <div className="space-y-4">
                  {changeData.alerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'critical' ? 'border-error-500 bg-error-50' :
                      alert.severity === 'high' ? 'border-warning-500 bg-warning-50' :
                      alert.severity === 'medium' ? 'border-blue-500 bg-blue-50' :
                      'border-gray-500 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{alert.type.replace('_', ' ')}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          alert.severity === 'critical' ? 'bg-error-100 text-error-800' :
                          alert.severity === 'high' ? 'bg-warning-100 text-warning-800' :
                          alert.severity === 'medium' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <Link
                          to={`/business/${alert.business_id}`}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          View Business
                        </Link>
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default BusinessChangeMonitoring