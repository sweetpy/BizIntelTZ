import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Target, TrendingUp, BarChart3, AlertTriangle, ArrowLeft, Download } from 'lucide-react'
import { getCompetitiveIntelligence, exportCompetitiveReport } from '../utils/api'
import { CompetitiveIntelligenceData } from '../types'
import toast from 'react-hot-toast'

const CompetitiveIntelligence: React.FC = () => {
  const [intelligenceData, setIntelligenceData] = useState<CompetitiveIntelligenceData | null>(null)
  const [selectedSector, setSelectedSector] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  const sectors = [
    'Agriculture', 'Manufacturing', 'Services', 'Trade', 'Technology', 
    'Healthcare', 'Education', 'Tourism', 'Mining', 'Finance', 'Transport'
  ]

  useEffect(() => {
    loadIntelligenceData()
  }, [selectedSector])

  const loadIntelligenceData = async () => {
    try {
      setIsLoading(true)
      const data = await getCompetitiveIntelligence(selectedSector)
      setIntelligenceData(data)
    } catch (error) {
      console.error('Error loading competitive intelligence:', error)
      toast.error('Failed to load competitive intelligence')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const blob = await exportCompetitiveReport(selectedSector || 'all')
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `competitive-intelligence-${selectedSector || 'all'}-${Date.now()}.pdf`
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

  const getThreatColor = (type: 'threat' | 'opportunity') => {
    return type === 'threat' ? 'text-error-600' : 'text-success-600'
  }

  const getThreatBg = (type: 'threat' | 'opportunity') => {
    return type === 'threat' ? 'bg-error-100' : 'bg-success-100'
  }

  const getCompetitivenessColor = (score: number) => {
    if (score >= 80) return 'text-success-600'
    if (score >= 60) return 'text-warning-600'
    return 'text-error-600'
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
              <Target className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Competitive Intelligence</h1>
              <p className="text-gray-600">Market analysis, competitor tracking, and strategic insights</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="input w-48"
          >
            <option value="">All Sectors</option>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
          <button onClick={handleExport} className="btn btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : intelligenceData && (
        <>
          {/* Sector Leaders */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Sector Leaders</h3>
              <div className="space-y-4">
                {intelligenceData.sector_leaders.map((leader, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                        <span className="text-sm font-medium text-primary-600">#{leader.market_position}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{leader.business_name}</h4>
                        <p className="text-sm text-gray-600">{leader.sector}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary-600">{leader.strength_score}</p>
                        <p className="text-xs text-gray-600">Strength</p>
                      </div>
                      <div className="text-center">
                        <div className="flex flex-wrap gap-1">
                          {leader.key_advantages.slice(0, 2).map((advantage, idx) => (
                            <span key={idx} className="text-xs bg-success-100 text-success-800 px-2 py-1 rounded-full">
                              {advantage}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market Share Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Share Distribution</h3>
                <div className="space-y-4">
                  {intelligenceData.market_share.map((market, index) => (
                    <div key={index} className="space-y-3">
                      <h4 className="font-medium text-gray-900">{market.sector}</h4>
                      <p className="text-sm text-gray-600">Total Market Size: {market.total_market_size.toLocaleString()}</p>
                      <div className="space-y-2">
                        {market.top_players.map((player, playerIndex) => (
                          <div key={playerIndex} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{player.business_name}</span>
                            <div className="flex items-center space-x-3">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-primary-600 h-2 rounded-full"
                                  style={{ width: `${player.market_share}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{player.market_share}%</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                player.growth_rate > 0 ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
                              }`}>
                                {player.growth_rate > 0 ? '+' : ''}{player.growth_rate}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Competitive Metrics</h3>
                <div className="space-y-4">
                  {intelligenceData.competitive_metrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{metric.metric}</p>
                        <p className="text-sm text-gray-600">{metric.sector}</p>
                      </div>
                      <div className="text-right">
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-gray-600">Avg: </span>
                            <span className="font-medium">{metric.industry_average}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Top: </span>
                            <span className="font-medium text-success-600">{metric.top_performer}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Threats & Opportunities */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Threats & Opportunities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-error-900 mb-4 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Threats</span>
                  </h4>
                  <div className="space-y-3">
                    {intelligenceData.threats_opportunities
                      .filter(item => item.type === 'threat')
                      .map((threat, index) => (
                        <div key={index} className={`p-3 rounded-lg ${getThreatBg(threat.type)}`}>
                          <h5 className={`font-semibold ${getThreatColor(threat.type)}`}>{threat.title}</h5>
                          <p className="text-sm text-gray-700 mt-1">{threat.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {threat.sector}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              threat.impact_level === 'high' ? 'bg-error-100 text-error-800' :
                              threat.impact_level === 'medium' ? 'bg-warning-100 text-warning-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {threat.impact_level} impact
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-success-900 mb-4 flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Opportunities</span>
                  </h4>
                  <div className="space-y-3">
                    {intelligenceData.threats_opportunities
                      .filter(item => item.type === 'opportunity')
                      .map((opportunity, index) => (
                        <div key={index} className={`p-3 rounded-lg ${getThreatBg(opportunity.type)}`}>
                          <h5 className={`font-semibold ${getThreatColor(opportunity.type)}`}>{opportunity.title}</h5>
                          <p className="text-sm text-gray-700 mt-1">{opportunity.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {opportunity.sector}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              opportunity.impact_level === 'high' ? 'bg-success-100 text-success-800' :
                              opportunity.impact_level === 'medium' ? 'bg-warning-100 text-warning-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {opportunity.impact_level} impact
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sector Analysis */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Sector Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {intelligenceData.sector_analysis.map((analysis, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">{analysis.sector}</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Competitiveness</span>
                          <span className={`text-sm font-medium ${getCompetitivenessColor(analysis.competitiveness)}`}>
                            {analysis.competitiveness}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              analysis.competitiveness >= 80 ? 'bg-success-600' :
                              analysis.competitiveness >= 60 ? 'bg-warning-600' : 'bg-error-600'
                            }`}
                            style={{ width: `${analysis.competitiveness}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Growth Potential</span>
                          <span className="text-sm font-medium text-gray-900">{analysis.growth_potential}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${analysis.growth_potential}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="text-sm">
                        <p className="text-gray-600 mb-1">Barriers to Entry:</p>
                        <p className="text-gray-900 font-medium">{analysis.barriers_to_entry}</p>
                      </div>

                      <div className="text-sm">
                        <p className="text-gray-600 mb-1">Key Trends:</p>
                        <div className="flex flex-wrap gap-1">
                          {analysis.key_trends.map((trend, trendIndex) => (
                            <span key={trendIndex} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {trend}
                            </span>
                          ))}
                        </div>
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

export default CompetitiveIntelligence