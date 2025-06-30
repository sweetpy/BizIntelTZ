import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, TrendingUp, Crown, Users, Star, Eye, ArrowUp, ArrowDown, Minus, Target, Zap } from 'lucide-react'
import { getLeaderboardData, getMarketShareData, compareBusiness, getBuzzMeterData } from '../utils/api'
import { LeaderboardData, MarketShareData, BusinessRanking, Badge } from '../types'
import toast from 'react-hot-toast'

const Rankings: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedSector, setSector] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('overall')
  const [isLoading, setIsLoading] = useState(true)

  const regions = [
    'all', 'Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Morogoro', 
    'Tanga', 'Kahama', 'Tabora', 'Kigoma', 'Sumbawanga', 'Kasulu'
  ]

  const sectors = [
    'all', 'Agriculture', 'Manufacturing', 'Services', 'Trade', 'Technology', 
    'Healthcare', 'Education', 'Tourism', 'Mining', 'Finance', 'Transport'
  ]

  const categories = [
    { value: 'overall', label: 'Overall Leaders', icon: Trophy },
    { value: 'trending', label: 'Trending Now', icon: TrendingUp },
    { value: 'fastest_growing', label: 'Fastest Growing', icon: Zap },
    { value: 'most_viewed', label: 'Most Viewed', icon: Eye },
    { value: 'top_rated', label: 'Top Rated', icon: Star }
  ]

  useEffect(() => {
    loadLeaderboardData()
  }, [selectedRegion, selectedSector])

  const loadLeaderboardData = async () => {
    try {
      setIsLoading(true)
      const data = await getLeaderboardData(selectedRegion, selectedSector)
      setLeaderboardData(data)
    } catch (error) {
      console.error('Error loading leaderboard data:', error)
      toast.error('Failed to load rankings')
    } finally {
      setIsLoading(false)
    }
  }

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-success-600" />
    if (change < 0) return <ArrowDown className="h-4 w-4 text-error-600" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getBadgeIcon = (badge: Badge) => {
    const icons: Record<string, any> = {
      'trophy': Trophy,
      'crown': Crown,
      'star': Star,
      'trending': TrendingUp,
      'target': Target,
      'zap': Zap
    }
    const IconComponent = icons[badge.icon] || Trophy
    return <IconComponent className="h-4 w-4" />
  }

  const getCurrentLeaders = () => {
    if (!leaderboardData) return []
    
    switch (selectedCategory) {
      case 'trending': return leaderboardData.trending_businesses
      case 'fastest_growing': return leaderboardData.fastest_growing
      case 'most_viewed': return leaderboardData.most_viewed
      case 'top_rated': return leaderboardData.top_rated
      default: return leaderboardData.overall_leaders
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl">
            <Trophy className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Business Rankings</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover who's dominating the market. Track your competition and see where you stand.
        </p>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="input"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region === 'all' ? 'All Regions' : region}
                </option>
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
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector === 'all' ? 'All Sectors' : sector}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category.value
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{category.label}</span>
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="w-16 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Leaderboard */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-warning-500" />
                <span>{categories.find(c => c.value === selectedCategory)?.label}</span>
              </h3>
              
              <div className="space-y-3">
                {getCurrentLeaders().slice(0, 20).map((business, index) => (
                  <div
                    key={business.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md ${
                      index < 3 
                        ? 'bg-gradient-to-r from-warning-50 to-warning-100 border-l-4 border-warning-500' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                        index === 0 ? 'bg-warning-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {index < 3 ? (
                          index === 0 ? <Crown className="h-5 w-5" /> : business.rank
                        ) : business.rank}
                      </div>
                      
                      {/* Business Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/business/${business.id}`}
                            className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                          >
                            {business.name}
                          </Link>
                          {business.verified && (
                            <div className="flex items-center space-x-1 bg-success-100 px-2 py-1 rounded-full">
                              <Star className="h-3 w-3 text-success-600" />
                              <span className="text-xs font-medium text-success-600">Verified</span>
                            </div>
                          )}
                          {business.premium && (
                            <div className="flex items-center space-x-1 bg-secondary-100 px-2 py-1 rounded-full">
                              <Crown className="h-3 w-3 text-secondary-600" />
                              <span className="text-xs font-medium text-secondary-600">Premium</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{business.sector}</span>
                          <span>•</span>
                          <span>{business.region}</span>
                          <span>•</span>
                          <span>{business.views_count.toLocaleString()} views</span>
                        </div>
                        
                        {/* Badges */}
                        {business.badges.length > 0 && (
                          <div className="flex items-center space-x-2 mt-2">
                            {business.badges.slice(0, 3).map((badge) => (
                              <div
                                key={badge.id}
                                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium`}
                                style={{ backgroundColor: `${badge.color}20`, color: badge.color }}
                              >
                                {getBadgeIcon(badge)}
                                <span>{badge.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Metrics */}
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary-600">{business.digital_score}</div>
                        <div className="text-xs text-gray-600">Score</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-warning-500 fill-current" />
                          <span className="font-medium">{business.average_rating.toFixed(1)}</span>
                        </div>
                        <div className="text-xs text-gray-600">{business.reviews_count} reviews</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          {getRankChangeIcon(business.rank_change)}
                          <span className={`font-medium ${
                            business.rank_change > 0 ? 'text-success-600' :
                            business.rank_change < 0 ? 'text-error-600' : 'text-gray-600'
                          }`}>
                            {business.rank_change !== 0 ? Math.abs(business.rank_change) : '—'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">vs last week</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Badge Winners */}
          {leaderboardData && leaderboardData.recent_badge_winners.length > 0 && (
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-warning-500" />
                  <span>Recent Badge Winners</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {leaderboardData.recent_badge_winners.slice(0, 6).map((winner) => (
                    <div key={`${winner.business_id}-${winner.badge.id}`} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${winner.badge.color}20` }}
                        >
                          {getBadgeIcon(winner.badge)}
                        </div>
                        <div className="flex-1">
                          <Link
                            to={`/business/${winner.business_id}`}
                            className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                          >
                            {winner.business_name}
                          </Link>
                          <p className="text-sm text-gray-600">{winner.sector} • {winner.region}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium" style={{ color: winner.badge.color }}>
                          {winner.badge.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(winner.earned_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Call to Action */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Want to climb the rankings?</h3>
          <p className="text-primary-100 mb-6">
            Claim your business profile, engage with customers, and watch your rank soar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create-business" className="btn btn-secondary">
              Add Your Business
            </Link>
            <Link to="/search" className="btn btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20">
              Find Your Business
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rankings
