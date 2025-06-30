import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Brain, Target, AlertTriangle, ArrowLeft, Download } from 'lucide-react'
import { getPredictiveAnalytics, generatePredictions, exportPredictions } from '../utils/api'
import { PredictiveAnalyticsData } from '../types'
import toast from 'react-hot-toast'

const PredictiveAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<PredictiveAnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>('growth_prediction')

  const models = [
    { value: 'growth_prediction', label: 'Business Growth Prediction' },
    { value: 'risk_assessment', label: 'Risk Assessment Model' },
    { value: 'opportunity_scoring', label: 'Opportunity Scoring' },
    { value: 'market_trends', label: 'Market Trend Analysis' }
  ]

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true)
      const data = await getPredictiveAnalytics()
      setAnalyticsData(data)
    } catch (error) {
      console.error('Error loading predictive analytics:', error)
      toast.error('Failed to load predictive analytics')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGeneratePredictions = async () => {
    try {
      setIsGenerating(true)
      await generatePredictions(selectedModel)
      toast.success('Predictions generated successfully!')
      await loadAnalyticsData()
    } catch (error) {
      console.error('Error generating predictions:', error)
      toast.error('Failed to generate predictions')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExport = async () => {
    try {
      const blob = await exportPredictions(selectedModel)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `predictions-${selectedModel}-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('Predictions exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export predictions')
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600'
    if (score >= 60) return 'text-warning-600'
    return 'text-error-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-success-100'
    if (score >= 60) return 'bg-warning-100'
    return 'bg-error-100'
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-success-600'
      case 'medium': return 'text-warning-600'
      case 'high': return 'text-error-600'
      default: return 'text-gray-600'
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
              <Brain className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Predictive Analytics & AI Models</h1>
              <p className="text-gray-600">AI-powered predictions for growth, risk, and opportunities</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button onClick={handleExport} className="btn btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={handleGeneratePredictions}
            disabled={isGenerating}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Brain className={`h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Generate Predictions'}</span>
          </button>
        </div>
      </div>

      {/* Model Selection */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Model Selection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {models.map((model) => (
            <button
              key={model.value}
              onClick={() => setSelectedModel(model.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedModel === model.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <Brain className={`h-6 w-6 mx-auto mb-2 ${
                  selectedModel === model.value ? 'text-primary-600' : 'text-gray-600'
                }`} />
                <p className="text-sm font-medium text-gray-900">{model.label}</p>
              </div>
            </button>
          ))}
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
      ) : analyticsData && (
        <>
          {/* Model Performance */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Model Accuracy</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.model_accuracy}%</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Predictions Made</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.total_predictions}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">High Risk Businesses</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.high_risk_count}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary-100 rounded-lg">
                  <Brain className="h-5 w-5 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Confidence Score</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.confidence_score}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Predictions */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Growth Predictions</h3>
              <div className="space-y-4">
                {analyticsData.growth_predictions.map((prediction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{prediction.business_name}</h4>
                      <p className="text-sm text-gray-600">{prediction.sector} • {prediction.region}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">Growth Score</p>
                        <p className={`text-lg font-bold ${getScoreColor(prediction.growth_score)}`}>
                          {prediction.growth_score}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">Time Frame</p>
                        <p className="text-sm text-gray-600">{prediction.time_frame}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full ${getScoreBg(prediction.confidence)}`}>
                        <span className={`text-sm font-medium ${getScoreColor(prediction.confidence)}`}>
                          {prediction.confidence}% confident
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Assessments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Assessments</h3>
                <div className="space-y-4">
                  {analyticsData.risk_assessments.map((risk, index) => (
                    <div key={index} className="border-l-4 border-gray-300 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{risk.business_name}</h4>
                        <span className={`text-sm font-medium ${getRiskColor(risk.risk_level)}`}>
                          {risk.risk_level} Risk
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{risk.risk_factors.join(', ')}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Score: {risk.risk_score}</span>
                        <span>Updated: {risk.last_updated}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Opportunities</h3>
                <div className="space-y-4">
                  {analyticsData.opportunities.map((opportunity, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
                      <h4 className="font-semibold text-primary-900 mb-2">{opportunity.title}</h4>
                      <p className="text-sm text-primary-800 mb-3">{opportunity.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-primary-200 text-primary-800 px-2 py-1 rounded-full">
                          {opportunity.sector}
                        </span>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary-900">
                            Opportunity Score: {opportunity.score}%
                          </p>
                          <p className="text-xs text-primary-700">Est. Value: ${opportunity.estimated_value}K</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Model Insights */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Model Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analyticsData.model_insights.map((insight, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {insight.model_type}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        Confidence: {insight.confidence}%
                      </span>
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

export default PredictiveAnalytics