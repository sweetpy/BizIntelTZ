import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, TrendingUp, Users, Award, Building2, ArrowRight, Star, Plus } from 'lucide-react'
import { searchBusinesses, getAnalytics } from '../utils/api'
import { Business, AnalyticsData } from '../types'
import BusinessCard from '../components/BusinessCard'

const Home: React.FC = () => {
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Load featured businesses (premium businesses)
      const businesses = await searchBusinesses({ premium: true })
      setFeaturedBusinesses(businesses.slice(0, 6))
      
      // Load analytics
      const analyticsData = await getAnalytics()
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white text-balance">
                Tanzania's Premier
                <span className="block text-primary-200">Business Intelligence</span>
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto text-balance">
                Discover, analyze, and connect with businesses across Tanzania. Get comprehensive insights, 
                digital scores, and make informed decisions with our powerful platform.
              </p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600" />
                <input
                  type="text"
                  placeholder="Search for businesses, sectors, or regions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-32 py-4 text-lg rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-primary-500 focus:shadow-xl transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-primary px-6 py-2.5"
                >
                  Search
                </button>
              </div>
            </form>
            
            {/* Stats */}
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
                <div className="glass-effect rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">{analytics.views.toLocaleString()}</div>
                  <div className="text-primary-200">Business Views</div>
                </div>
                <div className="glass-effect rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">{analytics.clicks.toLocaleString()}</div>
                  <div className="text-primary-200">Profile Clicks</div>
                </div>
                <div className="glass-effect rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">{featuredBusinesses.length}+</div>
                  <div className="text-primary-200">Featured Businesses</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Business Intelligence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to discover, analyze, and connect with Tanzanian businesses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card p-6 text-center group hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
              <Search className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Search</h3>
            <p className="text-gray-600">Filter by region, sector, digital score, and more to find exactly what you're looking for.</p>
          </div>
          
          <div className="card p-6 text-center group hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-success-200 transition-colors">
              <TrendingUp className="h-6 w-6 text-success-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Scoring</h3>
            <p className="text-gray-600">Comprehensive digital presence analysis with actionable insights and recommendations.</p>
          </div>
          
          <div className="card p-6 text-center group hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-warning-200 transition-colors">
              <Users className="h-6 w-6 text-warning-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reviews & Ratings</h3>
            <p className="text-gray-600">Community-driven reviews and ratings to help you make informed decisions.</p>
          </div>
          
          <div className="card p-6 text-center group hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary-200 transition-colors">
              <Award className="h-6 w-6 text-secondary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Listings</h3>
            <p className="text-gray-600">Enhanced visibility and detailed analytics for premium business listings.</p>
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      {featuredBusinesses.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Businesses</h2>
              <p className="text-gray-600">Discover top-rated businesses across Tanzania</p>
            </div>
            <Link
              to="/search?premium=true"
              className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBusinesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Call to Action */}
      <section className="bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Grow Your Business?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Join thousands of businesses already using BizIntelTZ to improve their digital presence and connect with customers.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-business"
                className="btn btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your Business
              </Link>
              <Link
                to="/search"
                className="btn btn-secondary text-lg px-8 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20 shadow-lg hover:shadow-xl"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Explore Businesses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home