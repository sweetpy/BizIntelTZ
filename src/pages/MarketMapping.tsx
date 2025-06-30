import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Map, TrendingUp, PieChart, BarChart3, MapPin, ArrowLeft, Download } from 'lucide-react'
import { getMarketMapping, exportMarketData } from '../utils/api'
import { MarketMappingData } from '../types'
import toast from 'react-hot-toast'

const MarketMapping: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketMappingData | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [selectedSector, setSector] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  const regions = [
    'Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Morogoro', 
    'Tanga', 'Kahama', 'Tabora', 'Kigoma', 'Sumbawanga', 'Kasulu'
  ]

  const sectors = [
    'Agriculture', 'Manufacturing', 'Services', 'Trade', 'Technology', 
    'Healthcare', 'Education', 'Tourism', 'Mining', 'Finance', 'Transport'
  ]

  useEffect(() => {
    loadMarketData()
  }, [selectedRegion, selectedSector])

  const loadMarketData = async () => {
    try {
      setIsLoading(true)
      const data = await getMarketMapping(selectedRegion, selectedSector)
      setMarketData(data)
    } catch (error) {
      console.error('Error loading market data:', error)
      toast.error('Failed to load market mapping data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const blob = await exportMarketData(selectedRegion, selectedSector)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `market-mapping-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('Market data exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
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
              <Map className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MSME Market Mapping</h1>
              <p className="text-gray-600">Market penetration strategy and geographic analysis</p>
            </div>
          </div>
        </div>
        
        <button onClick={handleExport} className="btn btn-secondary flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export Data</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Analysis Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="input"
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSector(e.target.value)}
              className="input"
            >
              <option value="">All Sectors</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
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
      ) : marketData && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <PieChart className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Market Size</p>
                  <p className="text-2xl font-bold text-gray-900">{marketData.market_size.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Penetration Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{marketData.penetration_rate}%</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{marketData.growth_rate}%</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Opportunity Score</p>
                  <p className="text-2xl font-bold text-gray-900">{marketData.opportunity_score}/100</p>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Regional Distribution</h3>
                <div className="space-y-4">
                  {marketData.regional_breakdown.map((region, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{region.region}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${region.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{region.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Sector Analysis</h3>
                <div className="space-y-4">
                  {marketData.sector_breakdown.map((sector, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{sector.sector}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-success-600 h-2 rounded-full"
                            style={{ width: `${sector.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{sector.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Market Opportunities */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Opportunities</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {marketData.opportunities.map((opportunity, index) => (
                  <div key={index} className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">{opportunity.title}</h4>
                    <p className="text-sm text-primary-800 mb-3">{opportunity.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-primary-200 text-primary-800 px-2 py-1 rounded-full">
                        {opportunity.priority} Priority
                      </span>
                      <span className="text-sm font-medium text-primary-900">
                        ${opportunity.estimated_value}K
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

export default MarketMapping