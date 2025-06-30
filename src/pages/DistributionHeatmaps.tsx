import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Map, Layers, MapPin, BarChart3, ArrowLeft, Filter } from 'lucide-react'
import { getDistributionData, getRetailDensity } from '../utils/api'
import { DistributionData, RetailDensity } from '../types'
import toast from 'react-hot-toast'

const DistributionHeatmaps: React.FC = () => {
  const [distributionData, setDistributionData] = useState<DistributionData | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<string>('business_density')
  const [selectedSector, setSelectedSector] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  const metrics = [
    { value: 'business_density', label: 'Business Density' },
    { value: 'retail_concentration', label: 'Retail Concentration' },
    { value: 'market_saturation', label: 'Market Saturation' },
    { value: 'growth_potential', label: 'Growth Potential' }
  ]

  const sectors = [
    'Agriculture', 'Manufacturing', 'Services', 'Trade', 'Technology', 
    'Healthcare', 'Education', 'Tourism', 'Mining', 'Finance', 'Transport'
  ]

  useEffect(() => {
    loadDistributionData()
  }, [selectedMetric, selectedSector])

  const loadDistributionData = async () => {
    try {
      setIsLoading(true)
      const data = await getDistributionData(selectedMetric, selectedSector)
      setDistributionData(data)
    } catch (error) {
      console.error('Error loading distribution data:', error)
      toast.error('Failed to load distribution data')
    } finally {
      setIsLoading(false)
    }
  }

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 80) return 'bg-red-500'
    if (intensity >= 60) return 'bg-orange-500'
    if (intensity >= 40) return 'bg-yellow-500'
    if (intensity >= 20) return 'bg-green-500'
    return 'bg-blue-500'
  }

  const getIntensityLabel = (intensity: number) => {
    if (intensity >= 80) return 'Very High'
    if (intensity >= 60) return 'High'
    if (intensity >= 40) return 'Medium'
    if (intensity >= 20) return 'Low'
    return 'Very Low'
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
              <h1 className="text-3xl font-bold text-gray-900">Distribution & Retail Heatmaps</h1>
              <p className="text-gray-600">Geographic distribution analysis and retail density mapping</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Heatmap Controls</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metric</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="input"
            >
              {metrics.map((metric) => (
                <option key={metric.value} value={metric.value}>{metric.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sector Focus</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
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
        <div className="card p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : distributionData && (
        <>
          {/* Heatmap Visualization */}
          <div className="card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {metrics.find(m => m.value === selectedMetric)?.label} Heatmap
                </h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Intensity Scale:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-xs">Low</span>
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-xs">High</span>
                  </div>
                </div>
              </div>
              
              {/* Regional Heatmap Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {distributionData.regional_data.map((region, index) => (
                  <div key={index} className="relative">
                    <div className={`p-4 rounded-lg ${getIntensityColor(region.intensity)} bg-opacity-20 border-2 ${getIntensityColor(region.intensity).replace('bg-', 'border-')}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="h-4 w-4 text-gray-700" />
                        <span className="font-medium text-gray-900">{region.region}</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Businesses:</span>
                          <span className="font-medium">{region.business_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Density:</span>
                          <span className="font-medium">{region.density}/km²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Intensity:</span>
                          <span className="font-medium">{getIntensityLabel(region.intensity)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Regions</p>
                  <p className="text-2xl font-bold text-gray-900">{distributionData.total_regions}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success-100 rounded-lg">
                  <Layers className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Density</p>
                  <p className="text-2xl font-bold text-gray-900">{distributionData.average_density}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Hotspots</p>
                  <p className="text-2xl font-bold text-gray-900">{distributionData.hotspot_count}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary-100 rounded-lg">
                  <Map className="h-5 w-5 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Coverage</p>
                  <p className="text-2xl font-bold text-gray-900">{distributionData.coverage_percentage}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Regions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Highest Density Regions</h3>
                <div className="space-y-4">
                  {distributionData.top_regions.slice(0, 5).map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-primary-100 rounded-full">
                          <span className="text-xs font-medium text-primary-600">{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-900">{region.region}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{region.density}/km²</div>
                        <div className="text-xs text-gray-600">{region.business_count} businesses</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Growth Opportunities</h3>
                <div className="space-y-4">
                  {distributionData.opportunities.map((opportunity, index) => (
                    <div key={index} className="border-l-4 border-primary-500 pl-4">
                      <h4 className="font-semibold text-gray-900">{opportunity.region}</h4>
                      <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                          {opportunity.potential}% Potential
                        </span>
                        <span className="text-xs text-gray-500">{opportunity.sector}</span>
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

export default DistributionHeatmaps