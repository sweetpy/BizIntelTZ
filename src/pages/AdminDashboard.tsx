import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BarChart3, 
  Users, 
  FileText, 
  Mail, 
  Database, 
  TrendingUp, 
  MapPin,
  Building2,
  Search,
  Plus
} from 'lucide-react'
import { getAdminStats, scrapeBusinesses } from '../utils/api'
import { AdminStats } from '../types'
import toast from 'react-hot-toast'

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isScraping, setIsScraping] = useState(false)
  const [scrapeForm, setScrapeForm] = useState({ source: '', region: '' })

  const regions = [
    'Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Morogoro', 
    'Tanga', 'Kahama', 'Tabora', 'Kigoma', 'Sumbawanga', 'Kasulu'
  ]

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const data = await getAdminStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading admin stats:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!scrapeForm.source) {
      toast.error('Please enter a source')
      return
    }

    try {
      setIsScraping(true)
      const result = await scrapeBusinesses(scrapeForm.source, scrapeForm.region || undefined)
      toast.success(`Successfully scraped ${result.added} businesses!`)
      setScrapeForm({ source: '', region: '' })
      await loadStats() // Refresh stats
    } catch (error) {
      console.error('Error scraping:', error)
      toast.error('Failed to scrape businesses')
    } finally {
      setIsScraping(false)
    }
  }

  const quickStats = [
    {
      title: 'Total Claims',
      value: stats?.total_claims || 0,
      icon: FileText,
      color: 'bg-blue-500',
      link: '/admin/claims'
    },
    {
      title: 'Pending Claims',
      value: stats?.pending_claims || 0,
      icon: Users,
      color: 'bg-warning-500',
      link: '/admin/claims'
    },
    {
      title: 'Total Leads',
      value: stats?.leads || 0,
      icon: Mail,
      color: 'bg-success-500',
      link: '/admin/leads'
    },
    {
      title: 'Analytics',
      value: 'View',
      icon: BarChart3,
      color: 'bg-secondary-500',
      link: '/admin/analytics'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your business intelligence platform</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link to="/create-business" className="btn btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Business</span>
          </Link>
          <Link to="/search" className="btn btn-secondary flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="card hover:shadow-lg transition-all duration-300 group"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Data Scraping */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Database className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Data Scraping</h3>
                <p className="text-sm text-gray-600">Generate sample business data</p>
              </div>
            </div>
            
            <form onSubmit={handleScrape} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source *
                </label>
                <input
                  type="text"
                  required
                  value={scrapeForm.source}
                  onChange={(e) => setScrapeForm({ ...scrapeForm, source: e.target.value })}
                  className="input"
                  placeholder="e.g., Yellow Pages, Local Directory"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region (optional)
                </label>
                <select
                  value={scrapeForm.region}
                  onChange={(e) => setScrapeForm({ ...scrapeForm, region: e.target.value })}
                  className="input"
                >
                  <option value="">All Regions</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                type="submit"
                disabled={isScraping}
                className="w-full btn btn-primary"
              >
                {isScraping ? 'Scraping...' : 'Start Scraping'}
              </button>
            </form>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> This will generate 3 sample businesses for demonstration purposes.
                In a production environment, this would integrate with real data sources.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-success-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                <p className="text-sm text-gray-600">Common administrative tasks</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link
                to="/admin/claims"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Manage Claims</span>
                </div>
                {stats && stats.pending_claims > 0 && (
                  <span className="bg-warning-100 text-warning-700 px-2 py-1 rounded-full text-xs font-medium">
                    {stats.pending_claims} pending
                  </span>
                )}
              </Link>
              
              <Link
                to="/admin/leads"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">View Leads</span>
                </div>
                {stats && stats.leads > 0 && (
                  <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium">
                    {stats.leads} total
                  </span>
                )}
              </Link>
              
              <Link
                to="/admin/analytics"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">View Analytics</span>
                </div>
              </Link>
              
              <Link
                to="/search"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Building2 className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Manage Businesses</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-3 h-3 bg-success-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium text-gray-900">API Status</p>
              <p className="text-xs text-gray-600">Operational</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-success-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium text-gray-900">Database</p>
              <p className="text-xs text-gray-600">Connected</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-success-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium text-gray-900">Services</p>
              <p className="text-xs text-gray-600">All Running</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard