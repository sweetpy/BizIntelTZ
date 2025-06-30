import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Globe, TrendingUp, ArrowLeft, Plus, Edit3, Eye } from 'lucide-react'
import { getSEOPages, generateSEOContent, getTrafficStats, createSEOPage } from '../utils/api'
import { SEOPage, TrafficStats, SEOMetrics } from '../types'
import toast from 'react-hot-toast'

const SEOContentEngine: React.FC = () => {
  const [seoPages, setSeoPages] = useState<SEOPage[]>([])
  const [trafficStats, setTrafficStats] = useState<TrafficStats | null>(null)
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCreatePage, setShowCreatePage] = useState(false)
  const [newPage, setNewPage] = useState({
    title: '',
    meta_description: '',
    keywords: '',
    region: '',
    business_type: '',
    content_type: 'landing'
  })

  useEffect(() => {
    loadSEOData()
  }, [])

  const loadSEOData = async () => {
    try {
      setIsLoading(true)
      const [pagesData, statsData] = await Promise.all([
        getSEOPages(),
        getTrafficStats()
      ])
      setSeoPages(pagesData)
      setTrafficStats(statsData)
    } catch (error) {
      console.error('Error loading SEO data:', error)
      toast.error('Failed to load SEO data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateContent = async (region: string, businessType: string) => {
    try {
      setIsGenerating(true)
      await generateSEOContent(region, businessType)
      toast.success('SEO content generated successfully!')
      await loadSEOData()
    } catch (error) {
      console.error('Error generating content:', error)
      toast.error('Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createSEOPage(newPage)
      toast.success('SEO page created successfully!')
      setShowCreatePage(false)
      setNewPage({
        title: '',
        meta_description: '',
        keywords: '',
        region: '',
        business_type: '',
        content_type: 'landing'
      })
      await loadSEOData()
    } catch (error) {
      console.error('Error creating page:', error)
      toast.error('Failed to create page')
    }
  }

  const getPageTypeColor = (type: string) => {
    switch (type) {
      case 'landing': return 'bg-blue-100 text-blue-800'
      case 'directory': return 'bg-success-100 text-success-800'
      case 'blog': return 'bg-warning-100 text-warning-800'
      case 'category': return 'bg-secondary-100 text-secondary-800'
      default: return 'bg-gray-100 text-gray-800'
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
              <Globe className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SEO Content Engine</h1>
              <p className="text-gray-600">Indexed pages per business-region to drive organic traffic</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleGenerateContent('all', 'all')}
            disabled={isGenerating}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <TrendingUp className={`h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Auto-Generate'}</span>
          </button>
          <button
            onClick={() => setShowCreatePage(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Page</span>
          </button>
        </div>
      </div>

      {/* SEO Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Indexed Pages</p>
              <p className="text-2xl font-bold text-gray-900">{seoPages.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-success-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Organic Traffic</p>
              <p className="text-2xl font-bold text-gray-900">{trafficStats?.organic_visits || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Search className="h-5 w-5 text-warning-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Keywords Ranking</p>
              <p className="text-2xl font-bold text-gray-900">{trafficStats?.ranking_keywords || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <Eye className="h-5 w-5 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Page Views</p>
              <p className="text-2xl font-bold text-gray-900">{trafficStats?.total_pageviews || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Generation Tool */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Automated Content Generation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Landing Pages</h4>
            <p className="text-sm text-blue-800 mb-3">
              Generate region-specific business directory pages with local SEO optimization.
            </p>
            <button
              onClick={() => handleGenerateContent('all', 'landing')}
              className="btn btn-primary text-sm w-full"
            >
              Generate Landing Pages
            </button>
          </div>
          
          <div className="p-4 bg-success-50 rounded-lg">
            <h4 className="font-semibold text-success-900 mb-2">Category Pages</h4>
            <p className="text-sm text-success-800 mb-3">
              Create sector-specific pages targeting business categories in each region.
            </p>
            <button
              onClick={() => handleGenerateContent('all', 'category')}
              className="btn btn-success text-sm w-full"
            >
              Generate Category Pages
            </button>
          </div>
          
          <div className="p-4 bg-warning-50 rounded-lg">
            <h4 className="font-semibold text-warning-900 mb-2">Business Profiles</h4>
            <p className="text-sm text-warning-800 mb-3">
              Auto-create SEO-optimized individual business profile pages.
            </p>
            <button
              onClick={() => handleGenerateContent('all', 'profile')}
              className="btn btn-warning text-sm w-full"
            >
              Generate Profile Pages
            </button>
          </div>
        </div>
      </div>

      {/* SEO Pages List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">SEO Pages</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Keywords</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Traffic</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Ranking</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {seoPages.map((page) => (
                    <tr key={page.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{page.title}</p>
                          <p className="text-sm text-gray-600">{page.url}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPageTypeColor(page.content_type)}`}>
                          {page.content_type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {page.keywords.split(',').slice(0, 3).map((keyword, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {keyword.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{page.monthly_visits}</p>
                          <p className="text-gray-600">visits/month</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <p className={`font-medium ${
                            page.avg_position <= 10 ? 'text-success-600' :
                            page.avg_position <= 30 ? 'text-warning-600' : 'text-error-600'
                          }`}>
                            #{page.avg_position}
                          </p>
                          <p className="text-gray-600">avg position</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <a 
                            href={page.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Traffic Analytics */}
      {trafficStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Pages</h3>
              <div className="space-y-4">
                {trafficStats.top_pages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{page.title}</p>
                      <p className="text-sm text-gray-600">{page.url}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">{page.visits}</p>
                      <p className="text-xs text-gray-600">visits</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Keyword Rankings</h3>
              <div className="space-y-4">
                {trafficStats.top_keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{keyword.keyword}</p>
                      <p className="text-sm text-gray-600">{keyword.search_volume} searches/month</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        keyword.position <= 10 ? 'text-success-600' :
                        keyword.position <= 30 ? 'text-warning-600' : 'text-error-600'
                      }`}>
                        #{keyword.position}
                      </p>
                      <p className="text-xs text-gray-600">position</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Page Modal */}
      {showCreatePage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Create SEO Page</h3>
            
            <form onSubmit={handleCreatePage} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                <input
                  type="text"
                  required
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  className="input"
                  placeholder="SEO-optimized page title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                <textarea
                  value={newPage.meta_description}
                  onChange={(e) => setNewPage({ ...newPage, meta_description: e.target.value })}
                  className="input h-20 resize-none"
                  placeholder="Page meta description for search results"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <input
                    type="text"
                    value={newPage.region}
                    onChange={(e) => setNewPage({ ...newPage, region: e.target.value })}
                    className="input"
                    placeholder="Target region"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                  <input
                    type="text"
                    value={newPage.business_type}
                    onChange={(e) => setNewPage({ ...newPage, business_type: e.target.value })}
                    className="input"
                    placeholder="Target business type"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={newPage.content_type}
                  onChange={(e) => setNewPage({ ...newPage, content_type: e.target.value })}
                  className="input"
                  required
                >
                  <option value="landing">Landing Page</option>
                  <option value="directory">Directory Page</option>
                  <option value="blog">Blog Post</option>
                  <option value="category">Category Page</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Keywords</label>
                <textarea
                  value={newPage.keywords}
                  onChange={(e) => setNewPage({ ...newPage, keywords: e.target.value })}
                  className="input h-20 resize-none"
                  placeholder="Enter target keywords separated by commas"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreatePage(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SEOContentEngine