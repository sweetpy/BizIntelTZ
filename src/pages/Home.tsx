import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, TrendingUp, Users, Award, Building2, ArrowRight, Star, Plus, Trophy, Crown, Eye, Target, Zap, ChevronRight } from 'lucide-react'
import { searchBusinesses, getAnalytics, getLeaderboardData } from '../utils/api'
import { Business, AnalyticsData, LeaderboardData } from '../types'
import BusinessCard from '../components/BusinessCard'

const Home: React.FC = () => {
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock data as fallback
  const mockAnalytics: AnalyticsData = {
    views: 2150,
    clicks: 1340
  }

  const mockLeaderboardData: LeaderboardData = {
    overall_leaders: [
      {
        id: "mock-1",
        name: "TechHub Dar es Salaam",
        bi_id: "BIZ-TZ-20241201-1001",
        region: "Dar es Salaam",
        sector: "Technology",
        digital_score: 92,
        rank: 1,
        previous_rank: 2,
        rank_change: 1,
        views_count: 2840,
        reviews_count: 45,
        average_rating: 4.8,
        badges: [],
        buzz_score: 95,
        market_share_percentage: 12.5,
        sentiment_score: 88,
        growth_rate: 15.3,
        premium: true,
        verified: true,
        claimed: true
      },
      {
        id: "mock-2",
        name: "Kilimanjaro Coffee Co",
        bi_id: "BIZ-TZ-20241201-1002",
        region: "Arusha",
        sector: "Agriculture",
        digital_score: 88,
        rank: 2,
        previous_rank: 3,
        rank_change: 1,
        views_count: 2340,
        reviews_count: 38,
        average_rating: 4.7,
        badges: [],
        buzz_score: 89,
        market_share_percentage: 10.2,
        sentiment_score: 92,
        growth_rate: 12.8,
        premium: true,
        verified: true,
        claimed: true
      },
      {
        id: "mock-3",
        name: "Zanzibar Tours & Travel",
        bi_id: "BIZ-TZ-20241201-1003",
        region: "Zanzibar",
        sector: "Tourism",
        digital_score: 85,
        rank: 3,
        previous_rank: 1,
        rank_change: -2,
        views_count: 2120,
        reviews_count: 52,
        average_rating: 4.6,
        badges: [],
        buzz_score: 84,
        market_share_percentage: 8.7,
        sentiment_score: 86,
        growth_rate: 8.2,
        premium: false,
        verified: true,
        claimed: true
      }
    ],
    regional_leaders: [],
    sector_leaders: [],
    trending_businesses: [],
    fastest_growing: [],
    most_viewed: [],
    top_rated: [],
    recent_badge_winners: [
      {
        business_id: "mock-1",
        business_name: "TechHub Dar es Salaam",
        badge: {
          id: "innovation-leader",
          name: "Innovation Leader",
          icon: "star",
          color: "#f59e0b",
          description: "Leading innovation in technology sector",
          earned_date: new Date().toISOString(),
          category: "achievement"
        },
        earned_date: new Date().toISOString(),
        region: "Dar es Salaam",
        sector: "Technology"
      }
    ]
  }

  const mockFeaturedBusinesses: Business[] = [
    {
      id: "featured-1",
      name: "Premium Logistics Solutions",
      bi_id: "BIZ-TZ-20241201-2001",
      region: "Dar es Salaam",
      sector: "Transport",
      digital_score: 89,
      premium: true,
      verified: true,
      claimed: true
    },
    {
      id: "featured-2",
      name: "Serengeti Safari Lodge",
      bi_id: "BIZ-TZ-20241201-2002",
      region: "Arusha",
      sector: "Tourism",
      digital_score: 86,
      premium: true,
      verified: true,
      claimed: true
    },
    {
      id: "featured-3",
      name: "Mwanza Fish Export Co",
      bi_id: "BIZ-TZ-20241201-2003",
      region: "Mwanza",
      sector: "Trade",
      digital_score: 83,
      premium: true,
      verified: false,
      claimed: true
    }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Try to load real data with fallback to mock data
      try {
        // Load featured businesses (premium businesses)
        const businesses = await searchBusinesses({ premium: true })
        setFeaturedBusinesses(businesses.length > 0 ? businesses.slice(0, 6) : mockFeaturedBusinesses)
      } catch (err) {
        console.log('Using mock featured businesses:', err)
        setFeaturedBusinesses(mockFeaturedBusinesses)
      }

      try {
        // Load analytics
        const analyticsData = await getAnalytics()
        setAnalytics(analyticsData)
      } catch (err) {
        console.log('Using mock analytics:', err)
        setAnalytics(mockAnalytics)
      }

      try {
        // Load leaderboard data
        const leaderboard = await getLeaderboardData()
        setLeaderboardData(leaderboard)
      } catch (err) {
        console.log('Using mock leaderboard:', err)
        setLeaderboardData(mockLeaderboardData)
      }

    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load some data. Showing demo content.')
      // Use all mock data as fallback
      setFeaturedBusinesses(mockFeaturedBusinesses)
      setAnalytics(mockAnalytics)
      setLeaderboardData(mockLeaderboardData)
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

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: Crown, color: 'text-warning-600', bg: 'bg-warning-100' }
    if (rank <= 3) return { icon: Trophy, color: 'text-warning-600', bg: 'bg-warning-100' }
    return { icon: Target, color: 'text-blue-600', bg: 'bg-blue-100' }
  }

  return (
    <div className="space-y-16">
      {/* Error Banner */}
      {error && (
        <div className="bg-warning-50 border-l-4 border-warning-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-warning-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full animate-bounce-gentle"></div>
          <div className="absolute bottom-20 left-20 w-20 h-20 bg-warning-500/20 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-secondary-500/20 rounded-full animate-ping"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <Trophy className="h-5 w-5 text-warning-400" />
                  <span className="text-white font-medium">Who's #1 in Your City?</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white text-balance">
                Discover Tanzania's
                <span className="block text-primary-200">Top-Ranked Businesses</span>
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto text-balance">
                Real-time rankings, competitive intelligence, and verified business data. 
                See where you stand against competitors and climb to the top.
              </p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600" />
                <input
                  type="text"
                  placeholder="Search businesses, compare competitors, check rankings..."
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
            
            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                to="/rankings"
                className="glass-effect rounded-xl px-6 py-3 text-white hover:bg-white/20 transition-all duration-200 flex items-center space-x-2"
              >
                <Trophy className="h-5 w-5" />
                <span>View Rankings</span>
              </Link>
              <Link
                to="/create-business"
                className="glass-effect rounded-xl px-6 py-3 text-white hover:bg-white/20 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Claim Business</span>
              </Link>
            </div>
            
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
                  <div className="text-primary-200">Ranked Businesses</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Live Leaderboard Widget */}
      {leaderboardData && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl">
                <Trophy className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Live Business Rankings
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See who's dominating the market right now. Rankings update in real-time based on views, reviews, and digital presence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Overall Leaders */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                      <Crown className="h-5 w-5 text-warning-500" />
                      <span>Overall Leaders</span>
                    </h3>
                    <Link
                      to="/rankings"
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
                    >
                      <span>View Full Rankings</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                  
                  <div className="space-y-3">
                    {leaderboardData.overall_leaders.slice(0, 5).map((business, index) => {
                      const badge = getRankBadge(business.rank)
                      const IconComponent = badge.icon
                      
                      return (
                        <div
                          key={business.id}
                          className={`flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md ${
                            index < 3 
                              ? 'bg-gradient-to-r from-warning-50 to-warning-100 border-l-4 border-warning-500' 
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${badge.bg}`}>
                              <IconComponent className={`h-5 w-5 ${badge.color}`} />
                            </div>
                            <div>
                              <Link
                                to={`/business/${business.id}`}
                                className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                              >
                                {business.name}
                              </Link>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>{business.sector}</span>
                                <span>•</span>
                                <span>{business.region}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary-600">#{business.rank}</div>
                            <div className="text-xs text-gray-600">{business.views_count} views</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Trending & Quick Stats */}
            <div className="space-y-6">
              {/* Trending Businesses */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-success-600" />
                    <span>Trending Now</span>
                  </h3>
                  <div className="space-y-3">
                    {leaderboardData.overall_leaders.slice(0, 3).map((business, index) => (
                      <div key={business.id} className="flex items-center justify-between">
                        <div>
                          <Link
                            to={`/business/${business.id}`}
                            className="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                          >
                            {business.name}
                          </Link>
                          <p className="text-sm text-gray-600">{business.sector}</p>
                        </div>
                        <div className="flex items-center space-x-1 text-success-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">+{business.growth_rate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Categories */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Rankings</h3>
                  <div className="space-y-3">
                    <Link
                      to="/rankings?category=fastest_growing"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Zap className="h-4 w-4 text-warning-600" />
                        <span className="text-sm font-medium">Fastest Growing</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                    <Link
                      to="/rankings?category=most_viewed"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Eye className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Most Viewed</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                    <Link
                      to="/rankings?category=top_rated"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Star className="h-4 w-4 text-success-600" />
                        <span className="text-sm font-medium">Top Rated</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Badge Wall */}
      {leaderboardData && leaderboardData.recent_badge_winners.length > 0 && (
        <section className="bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Champions</h2>
              <p className="text-xl text-gray-600">Celebrating businesses that earned new badges this week</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leaderboardData.recent_badge_winners.slice(0, 6).map((winner) => (
                <div key={`${winner.business_id}-${winner.badge.id}`} className="card hover:shadow-lg transition-all duration-300 group">
                  <div className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div
                        className="p-4 rounded-full transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${winner.badge.color}20` }}
                      >
                        <Award className="h-8 w-8" style={{ color: winner.badge.color }} />
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2" style={{ color: winner.badge.color }}>
                      {winner.badge.name}
                    </h3>
                    <Link
                      to={`/business/${winner.business_id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors block mb-2"
                    >
                      {winner.business_name}
                    </Link>
                    <p className="text-sm text-gray-600 mb-3">{winner.sector} • {winner.region}</p>
                    <p className="text-xs text-gray-500">
                      Earned {new Date(winner.earned_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Rankings Matter
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understand your competitive position and discover opportunities to grow your business visibility
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card p-6 text-center group hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
              <Trophy className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Rankings</h3>
            <p className="text-gray-600">Real-time business rankings across regions and sectors with instant updates.</p>
          </div>
          
          <div className="card p-6 text-center group hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-success-200 transition-colors">
              <Target className="h-6 w-6 text-success-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Competitor Analysis</h3>
            <p className="text-gray-600">Compare your business against competitors and track their performance.</p>
          </div>
          
          <div className="card p-6 text-center group hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-warning-200 transition-colors">
              <Award className="h-6 w-6 text-warning-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Prestige Badges</h3>
            <p className="text-gray-600">Earn recognition badges for achievements and showcase your success.</p>
          </div>
          
          <div className="card p-6 text-center group hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary-200 transition-colors">
              <TrendingUp className="h-6 w-6 text-secondary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Intelligence</h3>
            <p className="text-gray-600">Get insights into market trends and discover growth opportunities.</p>
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      {featuredBusinesses.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Businesses</h2>
              <p className="text-gray-600">Premium listings with enhanced visibility and features</p>
            </div>
            <Link
              to="/search?premium=true"
              className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>View All Premium</span>
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
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Dominate Your Market?
              </h2>
              <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                Claim your business, optimize your profile, and watch your ranking soar. 
                Join thousands of businesses competing for the top spot.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-business"
                className="btn btn-secondary text-lg px-8 py-3 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                Claim Your Business
              </Link>
              <Link
                to="/rankings"
                className="btn btn-secondary text-lg px-8 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20 shadow-lg hover:shadow-xl"
              >
                <Trophy className="h-5 w-5 mr-2" />
                View Rankings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home