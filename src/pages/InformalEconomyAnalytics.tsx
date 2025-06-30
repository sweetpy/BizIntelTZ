import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, PieChart, TrendingUp, AlertTriangle, ArrowLeft, Download } from 'lucide-react'
import { getInformalEconomyData, exportInformalEconomyReport } from '../utils/api'
import { InformalEconomyData } from '../types'
import toast from 'react-hot-toast'

const InformalEconomyAnalytics: React.FC = () => {
  const [economyData, setEconomyData] = useState<InformalEconomyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEconomyData()
  }, [])

  const loadEconomyData = async () => {
    try {
      setIsLoading(true)
      const data = await getInformalEconomyData()
      setEconomyData(data)
    } catch (error) {
      console.error('Error loading informal economy data:', error)
      toast.error('Failed to load informal economy data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const blob = await exportInformalEconomyReport()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `informal-economy-report-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('Report exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export report')
    }
  }

  const getFormalityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'formal': return 'text-success-600'
      case 'informal': return 'text-error-600'
      case 'semi-formal': return 'text-warning-600'
      default: return 'text-gray-600'
    }
  }

  const getFormalityBg = (type: string) => {
    switch (type.toLowerCase()) {
      case 'formal': return 'bg-success-100'
      case 'informal': return 'bg-error-100'
      case 'semi-formal': return 'bg-warning-100'
      default: return 'bg-gray-100'
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
              <PieChart className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Informal Economy Analytics</h1>
              <p className="text-gray-600">Track formality levels and business registration trends</p>
            </div>
          </div>
        </div>
        
        <button onClick={handleExport} className="btn btn-secondary flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
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
      ) : economyData && (
        <>
          {/* Formality Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Formal Businesses</p>
                  <p className="text-2xl font-bold text-success-600">{economyData.formal_percentage}%</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <PieChart className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Semi-Formal</p>
                  <p className="text-2xl font-bold text-warning-600">{economyData.semi_formal_percentage}%</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-error-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-error-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Informal</p>
                  <p className="text-2xl font-bold text-error-600">{economyData.informal_percentage}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sector Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Formality by Sector</h3>
                <div className="space-y-4">
                  {economyData.sector_formality.map((sector, index) => {
                    const total = sector.formal_count + sector.informal_count + sector.semi_formal_count
                    const formalPercentage = total > 0 ? (sector.formal_count / total) * 100 : 0
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{sector.sector}</span>
                          <span className="text-sm text-gray-600">{formalPercentage.toFixed(1)}% formal</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="flex h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-success-600"
                              style={{ width: `${(sector.formal_count / total) * 100}%` }}
                            ></div>
                            <div 
                              className="bg-warning-600"
                              style={{ width: `${(sector.semi_formal_count / total) * 100}%` }}
                            ></div>
                            <div 
                              className="bg-error-600"
                              style={{ width: `${(sector.informal_count / total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Formal: {sector.formal_count}</span>
                          <span>Semi: {sector.semi_formal_count}</span>
                          <span>Informal: {sector.informal_count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Regional Formality Index</h3>
                <div className="space-y-4">
                  {economyData.regional_formality.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{region.region}</p>
                        <p className="text-sm text-gray-600">Dominant: {region.dominant_type}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getFormalityColor(region.dominant_type)}`}>
                          {region.formality_index}/100
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${getFormalityBg(region.dominant_type)} ${getFormalityColor(region.dominant_type)}`}>
                          {region.dominant_type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trends */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Formalization Trends</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {economyData.trends.map((trend, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">{trend.month}</h4>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-success-600">Formal Growth:</span>
                        <span className="font-medium text-success-600">+{trend.formal_growth}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-error-600">Informal Decline:</span>
                        <span className="font-medium text-error-600">-{trend.informal_decline}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights & Recommendations */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Economic Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {economyData.insights.map((insight, index) => (
                  <div key={index} className="border-l-4 border-primary-500 pl-4">
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <div className="mt-3 space-y-1">
                      <div className="text-xs text-gray-500">
                        <strong>Impact:</strong> {insight.impact}
                      </div>
                      <div className="text-xs text-gray-500">
                        <strong>Recommendation:</strong> {insight.recommendation}
                      </div>
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

export default InformalEconomyAnalytics
