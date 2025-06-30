import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Zap, TrendingUp, AlertTriangle, ArrowLeft, Settings, Lightbulb } from 'lucide-react'
import { getAdaptiveInsights, updateRankingSettings, getPersonalizedTips } from '../utils/api'
import { AdaptiveInsights, PersonalizedTip, RankingSettings } from '../types'
import toast from 'react-hot-toast'

const AdaptiveAI: React.FC = () => {
  const [insights, setInsights] = useState<AdaptiveInsights | null>(null)
  const [tips, setTips] = useState<PersonalizedTip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [rankingSettings, setRankingSettings] = useState<RankingSettings>({
    weightDigitalScore: 0.3,
    weightReviews: 0.2,
    weightActivity: 0.2,
    weightLocation: 0.15,
    weightPremium: 0.15,
    enableRealTimeUpdates: true,
    anomalyThreshold: 0.8
  })

  useEffect(() => {
    loadInsights()
    loadPersonalizedTips()
    const interval = setInterval(loadInsights, 30000) // Real-time updates
    return () => clearInterval(interval)
  }, [])

  const loadInsights = async () => {
    try {
      setIsLoading(true)
      const data = await getAdaptiveInsights()
      setInsights(data)
    } catch (error) {
      console.error('Error loading adaptive insights:', error)
      toast.error('Failed to load AI insights')
    } finally {
      setIsLoading(false)
    }
  }

  const loadPersonalizedTips = async () => {
    try {
      const tipsData = await getPersonalizedTips()
      setTips(tipsData)
    } catch (error) {
      console.error('Error loading personalized tips:', error)
    }
  }

  const handleUpdateSettings = async () => {
    try {
      await updateRankingSettings(rankingSettings)
      toast.success('AI ranking settings updated!')
      setShowSettings(false)
      await loadInsights()
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings')
    }
  }

  const getAnomalyColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-error-600 bg-error-100'
      case 'medium': return 'text-warning-600 bg-warning-100'
      case 'low': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
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
              <h1 className="text-3xl font-bold text-gray-900">Adaptive AI Insights</h1>
              <p className="text-gray-600">Real-time re-ranking, anomaly detection, and personalized recommendations</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setShowSettings(true)}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <Settings className="h-4 w-4" />
          <span>AI Settings</span>
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
      ) : insights && (
        <>
          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Ranking Updates</p>
                  <p className="text-2xl font-bold text-gray-900">{insights.ranking_updates_today}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Last updated: {insights.last_ranking_update}
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Anomalies Detected</p>
                  <p className="text-2xl font-bold text-gray-900">{insights.anomalies_detected}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success-100 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tips Generated</p>
                  <p className="text-2xl font-bold text-gray-900">{insights.tips_generated}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary-100 rounded-lg">
                  <Zap className="h-5 w-5 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Confidence</p>
                  <p className="text-2xl font-bold text-gray-900">{insights.ai_confidence}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Rankings */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Real-time Business Rankings</h3>
              <div className="space-y-4">
                {insights.real_time_rankings.map((business, index) => (
                  <div key={business.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        business.rank_change > 0 ? 'bg-success-100' :
                        business.rank_change < 0 ? 'bg-error-100' : 'bg-gray-100'
                      }`}>
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{business.name}</h4>
                        <p className="text-sm text-gray-600">{business.sector} • {business.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">AI Score</p>
                        <p className="text-lg font-bold text-primary-600">{business.ai_score}</p>
                      </div>
                      {business.rank_change !== 0 && (
                        <div className={`flex items-center space-x-1 ${
                          business.rank_change > 0 ? 'text-success-600' : 'text-error-600'
                        }`}>
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {business.rank_change > 0 ? '+' : ''}{business.rank_change}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Anomaly Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Anomaly Alerts</h3>
                <div className="space-y-4">
                  {insights.anomaly_alerts.map((alert, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'high' ? 'border-error-500 bg-error-50' :
                      alert.severity === 'medium' ? 'border-warning-500 bg-warning-50' :
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getAnomalyColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Business: {alert.business_name}</span>
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Personalized Tips */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Personalized Business Tips</h3>
                <div className="space-y-4">
                  {tips.map((tip, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary-200 rounded-lg">
                          <Lightbulb className="h-4 w-4 text-primary-700" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-primary-900 mb-1">{tip.title}</h4>
                          <p className="text-sm text-primary-800 mb-2">{tip.description}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-primary-200 text-primary-800 px-2 py-1 rounded-full">
                              {tip.category}
                            </span>
                            <span className="text-xs text-primary-700">Impact: {tip.impact}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Ranking Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digital Score Weight: {rankingSettings.weightDigitalScore}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={rankingSettings.weightDigitalScore}
                  onChange={(e) => setRankingSettings({
                    ...rankingSettings,
                    weightDigitalScore: parseFloat(e.target.value)
                  })}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reviews Weight: {rankingSettings.weightReviews}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={rankingSettings.weightReviews}
                  onChange={(e) => setRankingSettings({
                    ...rankingSettings,
                    weightReviews: parseFloat(e.target.value)
                  })}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anomaly Threshold: {rankingSettings.anomalyThreshold}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.1"
                  value={rankingSettings.anomalyThreshold}
                  onChange={(e) => setRankingSettings({
                    ...rankingSettings,
                    anomalyThreshold: parseFloat(e.target.value)
                  })}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="realTimeUpdates"
                  checked={rankingSettings.enableRealTimeUpdates}
                  onChange={(e) => setRankingSettings({
                    ...rankingSettings,
                    enableRealTimeUpdates: e.target.checked
                  })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="realTimeUpdates" className="text-sm text-gray-700">
                  Enable Real-time Updates
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSettings}
                className="btn btn-primary"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdaptiveAI