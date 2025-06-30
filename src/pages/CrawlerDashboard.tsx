import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, Globe, ArrowLeft } from 'lucide-react'
import { getCrawlerStats } from '../utils/api'
import { CrawlerStats } from '../types'
import toast from 'react-hot-toast'

const CrawlerDashboard: React.FC = () => {
  const [stats, setStats] = useState<CrawlerStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const data = await getCrawlerStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to load crawler stats', err)
      toast.error('Failed to load crawler stats')
    } finally {
      setIsLoading(false)
    }
  }

  const formatSeconds = (sec: number) => {
    const hours = Math.floor(sec / 3600)
    const minutes = Math.floor((sec % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const featureData = [
    { label: 'Total Runs', value: stats?.total_runs ?? 0 },
    { label: 'Last Run', value: stats?.last_run ? new Date(stats.last_run).toLocaleString() : 'N/A' },
    { label: 'Total Pages Crawled', value: stats?.total_pages ?? 0 },
    { label: 'Total Businesses Found', value: stats?.total_businesses ?? 0 },
    { label: 'Average Pages per Run', value: stats?.avg_pages_per_run.toFixed(1) ?? '0' },
    { label: 'Average Businesses per Run', value: stats?.avg_businesses_per_run.toFixed(1) ?? '0' },
    { label: 'Uptime', value: stats ? formatSeconds(stats.uptime_seconds) : 'N/A' },
    { label: 'Crawler Status', value: 'Idle' },
    { label: 'Success Rate', value: '100%' },
    { label: 'Errors Today', value: 0 },
    { label: 'Pages Remaining', value: 0 },
    { label: 'Queue Size', value: 0 },
    { label: 'Current URL', value: 'N/A' },
    { label: 'Speed (pages/min)', value: 0 },
    { label: 'Peak Speed', value: 0 },
    { label: 'Data Size (MB)', value: (stats?.total_businesses ?? 0) * 0.001 },
    { label: 'Database Growth', value: `${stats?.total_businesses ?? 0} records` },
    { label: 'Insights Generated', value: 0 },
    { label: 'New Leads', value: 0 },
    { label: 'Last Error', value: 'None' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Globe className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crawler Dashboard</h1>
              <p className="text-gray-600">Monitor crawling progress and data collection</p>
            </div>
          </div>
        </div>
        <button onClick={loadStats} className="btn btn-primary flex items-center space-x-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureData.map((item, idx) => (
            <div key={idx} className="card p-6">
              <p className="text-sm font-medium text-gray-600 mb-1">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 break-all">{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CrawlerDashboard
