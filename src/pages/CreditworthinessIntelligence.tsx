import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, TrendingUp, AlertTriangle, CheckCircle, ArrowLeft, Shield } from 'lucide-react'
import { getCreditworthinessData, getCreditReport } from '../utils/api'
import { CreditworthinessData, CreditReport } from '../types'
import toast from 'react-hot-toast'

const CreditworthinessIntelligence: React.FC = () => {
  const [creditData, setCreditData] = useState<CreditworthinessData | null>(null)
  const [selectedBusiness, setSelectedBusiness] = useState<string>('')
  const [creditReport, setCreditReport] = useState<CreditReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCreditData()
  }, [])

  const loadCreditData = async () => {
    try {
      setIsLoading(true)
      const data = await getCreditworthinessData()
      setCreditData(data)
    } catch (error) {
      console.error('Error loading credit data:', error)
      toast.error('Failed to load creditworthiness data')
    } finally {
      setIsLoading(false)
    }
  }

  const generateCreditReport = async (businessId: string) => {
    try {
      const report = await getCreditReport(businessId)
      setCreditReport(report)
      toast.success('Credit report generated successfully!')
    } catch (error) {
      console.error('Error generating credit report:', error)
      toast.error('Failed to generate credit report')
    }
  }

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-success-600'
    if (score >= 650) return 'text-warning-600'
    return 'text-error-600'
  }

  const getCreditScoreBg = (score: number) => {
    if (score >= 750) return 'bg-success-100'
    if (score >= 650) return 'bg-warning-100'
    return 'bg-error-100'
  }

  const getRiskLevel = (score: number) => {
    if (score >= 750) return 'Low Risk'
    if (score >= 650) return 'Medium Risk'
    return 'High Risk'
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
              <CreditCard className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Creditworthiness & Lending Intelligence</h1>
              <p className="text-gray-600">Advanced credit scoring and risk assessment for MSME lending</p>
            </div>
          </div>
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
      ) : creditData && (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Risk</p>
                  <p className="text-2xl font-bold text-gray-900">{creditData.low_risk_count}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Medium Risk</p>
                  <p className="text-2xl font-bold text-gray-900">{creditData.medium_risk_count}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-error-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-error-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">High Risk</p>
                  <p className="text-2xl font-bold text-gray-900">{creditData.high_risk_count}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Credit Score</p>
                  <p className="text-2xl font-bold text-gray-900">{creditData.average_score}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Creditworthy Businesses */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Creditworthy Businesses</h3>
              <div className="space-y-4">
                {creditData.top_businesses.map((business, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                        <span className="text-sm font-medium text-primary-600">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{business.name}</h4>
                        <p className="text-sm text-gray-600">{business.sector} • {business.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className={`${getCreditScoreBg(business.credit_score)} px-3 py-1 rounded-full`}>
                        <span className={`text-sm font-semibold ${getCreditScoreColor(business.credit_score)}`}>
                          {business.credit_score}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">{getRiskLevel(business.credit_score)}</span>
                      <button
                        onClick={() => generateCreditReport(business.id)}
                        className="btn btn-primary text-sm"
                      >
                        Generate Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sector Risk Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Sector Risk Analysis</h3>
                <div className="space-y-4">
                  {creditData.sector_risk.map((sector, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{sector.sector}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              sector.risk_level === 'Low' ? 'bg-success-600' :
                              sector.risk_level === 'Medium' ? 'bg-warning-600' : 'bg-error-600'
                            }`}
                            style={{ width: `${100 - sector.risk_score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{sector.risk_level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Lending Recommendations</h3>
                <div className="space-y-4">
                  {creditData.lending_recommendations.map((rec, index) => (
                    <div key={index} className="border-l-4 border-primary-500 pl-4">
                      <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                          {rec.priority}
                        </span>
                        <span className="text-xs text-gray-500">Impact: {rec.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Credit Report Modal */}
          {creditReport && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Credit Report</h3>
                  <button
                    onClick={() => setCreditReport(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Business Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">{creditReport.business_name}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">BI ID:</span>
                        <span className="ml-2 font-mono">{creditReport.bi_id}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Credit Score:</span>
                        <span className={`ml-2 font-bold ${getCreditScoreColor(creditReport.credit_score)}`}>
                          {creditReport.credit_score}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Credit Factors */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Credit Score Factors</h4>
                    <div className="space-y-3">
                      {creditReport.factors.map((factor, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{factor.factor}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{factor.score}/100</span>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary-600 h-2 rounded-full"
                                style={{ width: `${factor.score}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Lending Recommendation</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-900 font-medium">{creditReport.recommendation}</p>
                      <p className="text-blue-800 text-sm mt-2">{creditReport.recommendation_reason}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CreditworthinessIntelligence