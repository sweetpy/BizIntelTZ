import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, AlertTriangle, CheckCircle, TrendingDown, Database, ArrowLeft, RefreshCw } from 'lucide-react'
import { getDataQualityMetrics, runDataQualityCheck } from '../utils/api'
import { DataQualityMetrics } from '../types'
import toast from 'react-hot-toast'

const DataQuality: React.FC = () => {
  const [metrics, setMetrics] = useState<DataQualityMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRunningCheck, setIsRunningCheck] = useState(false)

  useEffect(() => {
    loadMetrics()
  }, [])

  const loadMetrics = async () => {
    try {
      setIsLoading(true)
      const data = await getDataQualityMetrics()
      setMetrics(data)
    } catch (error) {
      console.error('Error loading data quality metrics:', error)
      toast.error('Failed to load data quality metrics')
    } finally {
      setIsLoading(false)
    }
  }

  const runQualityCheck = async () => {
    try {
      setIsRunningCheck(true)
      await runDataQualityCheck()
      toast.success('Data quality check completed!')
      await loadMetrics()
    } catch (error) {
      console.error('Error running quality check:', error)
      toast.error('Failed to run data quality check')
    } finally {
      setIsRunningCheck(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-600'
    if (score >= 70) return 'text-warning-600'
    return 'text-error-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-success-100'
    if (score >= 70) return 'bg-warning-100'
    return 'bg-error-100'
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
              <Database className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Data Quality Control</h1>
              <p className="text-gray-600">Monitor data health, anomalies, and integrity metrics</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={runQualityCheck}
          disabled={isRunningCheck}
          className="btn btn-primary flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRunningCheck ? 'animate-spin' : ''}`} />
          <span>{isRunningCheck ? 'Running Check...' : 'Run Quality Check'}</span>
        </button>
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
      ) : metrics && (
        <>
          {/* Overall Health Score */}
          <div className="card p-8 text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className={`p-4 rounded-full ${getScoreBg(metrics.overall_score)}`}>
                <Shield className={`h-8 w-8 ${getScoreColor(metrics.overall_score)}`} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Data Health Score</h2>
                <p className={`text-5xl font-bold ${getScoreColor(metrics.overall_score)} mt-2`}>
                  {metrics.overall_score}%
                </p>
              </div>
            </div>
            <p className="text-gray-600">
              Last updated: {new Date(metrics.last_updated).toLocaleString()}
            </p>
          </div>

          {/* Quality Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Data Completeness</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.completeness}%</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Data Accuracy</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.accuracy}%</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Anomalies Detected</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.anomalies_count}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary-100 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Duplicate Records</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.duplicates_count}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Issues */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Data Issues */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Data Quality Issues</h3>
                <div className="space-y-4">
                  {metrics.issues.map((issue, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-lg ${
                        issue.severity === 'high' ? 'bg-error-100' :
                        issue.severity === 'medium' ? 'bg-warning-100' : 'bg-blue-100'
                      }`}>
                        <AlertTriangle className={`h-4 w-4 ${
                          issue.severity === 'high' ? 'text-error-600' :
                          issue.severity === 'medium' ? 'text-warning-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{issue.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            issue.severity === 'high' ? 'bg-error-100 text-error-800' :
                            issue.severity === 'medium' ? 'bg-warning-100 text-warning-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {issue.severity} priority
                          </span>
                          <span className="text-xs text-gray-500">{issue.affected_records} records affected</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quality Trends */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Quality Trends</h3>
                <div className="space-y-4">
                  {metrics.trends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{trend.metric}</p>
                        <p className="text-sm text-gray-600">{trend.period}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          trend.change > 0 ? 'text-success-600' : 'text-error-600'
                        }`}>
                          {trend.change > 0 ? '+' : ''}{trend.change}%
                        </p>
                        <p className="text-sm text-gray-600">{trend.current_value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Improvement Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {metrics.recommendations.map((recommendation, index) => (
                  <div key={index} className="border-l-4 border-primary-500 pl-4">
                    <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                        {recommendation.priority} priority
                      </span>
                      <span className="text-xs text-gray-500">Impact: {recommendation.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DataQuality