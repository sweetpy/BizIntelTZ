import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bot, Play, Pause, Plus, Edit3, Trash2, ArrowLeft, Clock, Globe, Activity } from 'lucide-react'
import { getCrawlerStatus, getCrawlTargets, runCrawl, addCrawlTarget, deleteCrawlTarget, startCrawler, stopCrawler } from '../utils/api'
import { CrawlTarget, CrawlerStatus, CrawlResult } from '../types'
import toast from 'react-hot-toast'

const CrawlerManagement: React.FC = () => {
  const [status, setStatus] = useState<CrawlerStatus | null>(null)
  const [targets, setTargets] = useState<CrawlTarget[]>([])
  const [recentResults, setRecentResults] = useState<CrawlResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddTarget, setShowAddTarget] = useState(false)
  const [newTarget, setNewTarget] = useState<CrawlTarget>({
    name: '',
    start_urls: [''],
    allowed_domains: [''],
    max_depth: 3,
    max_pages: 50,
    delay_range: [1, 3],
    business_selectors: ['.business-name', '.listing-title'],
    active: true,
    crawl_interval_hours: 24
  })

  useEffect(() => {
    loadCrawlerData()
    // Refresh every 30 seconds
    const interval = setInterval(loadCrawlerData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadCrawlerData = async () => {
    try {
      setIsLoading(true)
      const [statusData, targetsData] = await Promise.all([
        getCrawlerStatus(),
        getCrawlTargets()
      ])
      setStatus(statusData)
      setTargets(targetsData)
    } catch (error) {
      console.error('Error loading crawler data:', error)
      toast.error('Failed to load crawler data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartCrawler = async () => {
    try {
      await startCrawler()
      toast.success('Crawler service started!')
      await loadCrawlerData()
    } catch (error) {
      console.error('Error starting crawler:', error)
      toast.error('Failed to start crawler service')
    }
  }

  const handleStopCrawler = async () => {
    try {
      await stopCrawler()
      toast.success('Crawler service stopped!')
      await loadCrawlerData()
    } catch (error) {
      console.error('Error stopping crawler:', error)
      toast.error('Failed to stop crawler service')
    }
  }

  const handleRunCrawl = async (targetName: string) => {
    try {
      toast.loading(`Starting crawl for ${targetName}...`)
      const result = await runCrawl(targetName)
      toast.dismiss()
      toast.success(`Crawl completed! Found ${result.businesses_found} businesses from ${result.pages_crawled} pages`)
      await loadCrawlerData()
    } catch (error) {
      toast.dismiss()
      console.error('Error running crawl:', error)
      toast.error('Failed to run crawl')
    }
  }

  const handleAddTarget = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addCrawlTarget(newTarget)
      toast.success('Crawl target added successfully!')
      setShowAddTarget(false)
      setNewTarget({
        name: '',
        start_urls: [''],
        allowed_domains: [''],
        max_depth: 3,
        max_pages: 50,
        delay_range: [1, 3],
        business_selectors: ['.business-name', '.listing-title'],
        active: true,
        crawl_interval_hours: 24
      })
      await loadCrawlerData()
    } catch (error) {
      console.error('Error adding target:', error)
      toast.error('Failed to add crawl target')
    }
  }

  const handleDeleteTarget = async (targetName: string) => {
    if (confirm(`Are you sure you want to delete the crawl target "${targetName}"?`)) {
      try {
        await deleteCrawlTarget(targetName)
        toast.success('Crawl target deleted successfully!')
        await loadCrawlerData()
      } catch (error) {
        console.error('Error deleting target:', error)
        toast.error('Failed to delete crawl target')
      }
    }
  }

  const formatNextCrawl = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled'
    const date = new Date(dateString)
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    
    if (diff <= 0) return 'Due now'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `In ${days} day${days > 1 ? 's' : ''}`
    } else if (hours > 0) {
      return `In ${hours}h ${minutes}m`
    } else {
      return `In ${minutes}m`
    }
  }

  const addArrayField = (field: 'start_urls' | 'allowed_domains' | 'business_selectors') => {
    setNewTarget({
      ...newTarget,
      [field]: [...newTarget[field], '']
    })
  }

  const updateArrayField = (field: 'start_urls' | 'allowed_domains' | 'business_selectors', index: number, value: string) => {
    const newArray = [...newTarget[field]]
    newArray[index] = value
    setNewTarget({
      ...newTarget,
      [field]: newArray
    })
  }

  const removeArrayField = (field: 'start_urls' | 'allowed_domains' | 'business_selectors', index: number) => {
    if (newTarget[field].length > 1) {
      const newArray = newTarget[field].filter((_, i) => i !== index)
      setNewTarget({
        ...newTarget,
        [field]: newArray
      })
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
              <Bot className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">24/7 Crawler Management</h1>
              <p className="text-gray-600">Automated business data collection and monitoring</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {status?.running ? (
            <button
              onClick={handleStopCrawler}
              className="btn btn-error flex items-center space-x-2"
            >
              <Pause className="h-4 w-4" />
              <span>Stop Crawler</span>
            </button>
          ) : (
            <button
              onClick={handleStartCrawler}
              className="btn btn-success flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Start Crawler</span>
            </button>
          )}
          <button
            onClick={() => setShowAddTarget(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Target</span>
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${status?.running ? 'bg-success-100' : 'bg-error-100'}`}>
              <Activity className={`h-5 w-5 ${status?.running ? 'text-success-600' : 'text-error-600'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Crawler Status</p>
              <p className={`text-lg font-bold ${status?.running ? 'text-success-600' : 'text-error-600'}`}>
                {status?.running ? 'Running' : 'Stopped'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Targets</p>
              <p className="text-lg font-bold text-gray-900">{status?.active_targets || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Clock className="h-5 w-5 text-warning-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Due for Crawl</p>
              <p className="text-lg font-bold text-gray-900">{status?.due_targets || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <Bot className="h-5 w-5 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Targets</p>
              <p className="text-lg font-bold text-gray-900">{status?.total_targets || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Crawl Targets */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Crawl Targets</h3>
            <div className="space-y-4">
              {targets.map((target, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{target.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          target.active ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
                        }`}>
                          {target.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Start URLs:</span>
                          <div className="text-xs mt-1">
                            {target.start_urls.slice(0, 2).map((url, i) => (
                              <div key={i} className="truncate">{url}</div>
                            ))}
                            {target.start_urls.length > 2 && (
                              <div>+{target.start_urls.length - 2} more</div>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Domains:</span>
                          <div className="text-xs mt-1">{target.allowed_domains.join(', ')}</div>
                        </div>
                        <div>
                          <span className="font-medium">Crawl Settings:</span>
                          <div className="text-xs mt-1">
                            Max Depth: {target.max_depth} | Max Pages: {target.max_pages}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Last Crawl:</span>
                          <span className="ml-1">
                            {target.last_crawl 
                              ? new Date(target.last_crawl).toLocaleString()
                              : 'Never'
                            }
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Next Crawl:</span>
                          <span className="ml-1">{formatNextCrawl(target.next_crawl)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Interval:</span>
                          <span className="ml-1">{target.crawl_interval_hours}h</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRunCrawl(target.name)}
                        className="btn btn-primary text-sm"
                      >
                        Run Now
                      </button>
                      <button
                        onClick={() => handleDeleteTarget(target.name)}
                        className="text-error-600 hover:text-error-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Target Modal */}
      {showAddTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Add Crawl Target</h3>
            
            <form onSubmit={handleAddTarget} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Name</label>
                  <input
                    type="text"
                    required
                    value={newTarget.name}
                    onChange={(e) => setNewTarget({ ...newTarget, name: e.target.value })}
                    className="input"
                    placeholder="e.g., Tanzania Business Directory"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Crawl Interval (hours)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newTarget.crawl_interval_hours}
                    onChange={(e) => setNewTarget({ ...newTarget, crawl_interval_hours: parseInt(e.target.value) })}
                    className="input"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start URLs</label>
                {newTarget.start_urls.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="url"
                      required
                      value={url}
                      onChange={(e) => updateArrayField('start_urls', index, e.target.value)}
                      className="input flex-1"
                      placeholder="https://example.com"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField('start_urls', index)}
                      className="text-error-600 hover:text-error-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('start_urls')}
                  className="btn btn-secondary text-sm"
                >
                  Add URL
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Domains</label>
                {newTarget.allowed_domains.map((domain, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      required
                      value={domain}
                      onChange={(e) => updateArrayField('allowed_domains', index, e.target.value)}
                      className="input flex-1"
                      placeholder="example.com"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField('allowed_domains', index)}
                      className="text-error-600 hover:text-error-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('allowed_domains')}
                  className="btn btn-secondary text-sm"
                >
                  Add Domain
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Depth</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={newTarget.max_depth}
                    onChange={(e) => setNewTarget({ ...newTarget, max_depth: parseInt(e.target.value) })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Pages</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newTarget.max_pages}
                    onChange={(e) => setNewTarget({ ...newTarget, max_pages: parseInt(e.target.value) })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delay Range (seconds)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={newTarget.delay_range[0]}
                      onChange={(e) => setNewTarget({ 
                        ...newTarget, 
                        delay_range: [parseFloat(e.target.value), newTarget.delay_range[1]]
                      })}
                      className="input flex-1"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={newTarget.delay_range[1]}
                      onChange={(e) => setNewTarget({ 
                        ...newTarget, 
                        delay_range: [newTarget.delay_range[0], parseFloat(e.target.value)]
                      })}
                      className="input flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Selectors</label>
                {newTarget.business_selectors.map((selector, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      required
                      value={selector}
                      onChange={(e) => updateArrayField('business_selectors', index, e.target.value)}
                      className="input flex-1 font-mono text-sm"
                      placeholder=".business-name"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField('business_selectors', index)}
                      className="text-error-600 hover:text-error-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('business_selectors')}
                  className="btn btn-secondary text-sm"
                >
                  Add Selector
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={newTarget.active}
                  onChange={(e) => setNewTarget({ ...newTarget, active: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">
                  Active (enable automatic crawling)
                </label>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddTarget(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CrawlerManagement