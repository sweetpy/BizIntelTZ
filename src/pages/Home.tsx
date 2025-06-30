import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Building2, 
  Search, 
  Plus, 
  Shield,
  Brain,
  ChevronDown,
  Database,
  MessageSquare,
  Zap,
  ShoppingBag,
  Globe,
  Sparkles,
  GraduationCap,
  Trophy,
  Crown,
  TrendingUp, 
  Users, 
  Award, 
  Star, 
  Eye, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Target, 
  ChevronRight,
  Fire,
  AlertTriangle,
  Clock,
  Share2,
  Bell,
  Sword,
  Skull,
  ThumbsUp,
  Activity,
  BarChart3
} from 'lucide-react'
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
  const [liveUpdates, setLiveUpdates] = useState<any[]>([])
  const [timeUntilNextRanking, setTimeUntilNextRanking] = useState<number>(0)
  const [battleOfTheDay, setBattleOfTheDay] = useState<any>(null)
  const [shameBoard, setShameBoard] = useState<any[]>([])
  const [viralMoments, setViralMoments] = useState<any[]>([])

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
      },
      {
        id: "mock-4",
        name: "Serengeti Safari Lodge",
        bi_id: "BIZ-TZ-20241201-1004",
        region: "Arusha",
        sector: "Tourism",
        digital_score: 82,
        rank: 4,
        previous_rank: 4,
        rank_change: 0,
        views_count: 1890,
        reviews_count: 31,
        average_rating: 4.5,
        badges: [],
        buzz_score: 79,
        market_share_percentage: 7.1,
        sentiment_score: 83,
        growth_rate: 5.4,
        premium: true,
        verified: false,
        claimed: true
      },
      {
        id: "mock-5",
        name: "Mwanza Fish Export Co",
        bi_id: "BIZ-TZ-20241201-1005",
        region: "Mwanza",
        sector: "Trade",
        digital_score: 78,
        rank: 5,
        previous_rank: 8,
        rank_change: 3,
        views_count: 1650,
        reviews_count: 28,
        average_rating: 4.3,
        badges: [],
        buzz_score: 82,
        market_share_percentage: 6.8,
        sentiment_score: 80,
        growth_rate: 18.7,
        premium: false,
        verified: true,
        claimed: false
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

  // Mock live updates
  const mockLiveUpdates = [
    { type: 'rank_change', business: 'TechHub Dar es Salaam', change: '+1', timestamp: '2 min ago', severity: 'success' },
    { type: 'new_review', business: 'Kilimanjaro Coffee Co', rating: 5, timestamp: '4 min ago', severity: 'info' },
    { type: 'rank_drop', business: 'Zanzibar Tours & Travel', change: '-2', timestamp: '7 min ago', severity: 'danger' },
    { type: 'new_business', business: 'Dodoma Transport Hub', timestamp: '12 min ago', severity: 'success' },
    { type: 'badge_earned', business: 'Mwanza Fish Export Co', badge: 'Rising Star', timestamp: '15 min ago', severity: 'warning' }
  ]

  // Mock shame board (businesses losing ground)
  const mockShameBoard = [
    { name: 'Arusha Mills Ltd', rank_drop: -5, reason: 'No customer engagement for 2 weeks', score_loss: -12 },
    { name: 'Coastal Logistics', rank_drop: -3, reason: 'Negative reviews flooding in', score_loss: -8 },
    { name: 'Mbeya Agro Solutions', rank_drop: -7, reason: 'Competitors taking market share', score_loss: -15 }
  ]

  // Mock battle of the day
  const mockBattleOfTheDay = {
    business_a: { name: 'TechHub Dar es Salaam', score: 92, votes: 1247 },
    business_b: { name: 'Kilimanjaro Coffee Co', score: 88, votes: 1156 },
    ends_in: '4h 23m',
    prize: 'Top Business Badge + Premium Features'
  }

  // Mock viral moments
  const mockViralMoments = [
    { business: 'TechHub Dar es Salaam', achievement: 'Reached #1 position', shares: 342, likes: 1250 },
    { business: 'Serengeti Safari Lodge', achievement: 'Customer service excellence badge', shares: 189, likes: 890 },
    { business: 'Mwanza Fish Export Co', achievement: 'Fastest growing business this week', shares: 156, likes: 675 }
  ]

  useEffect(() => {
    loadData()
    
    // Set up real-time updates
    const interval = setInterval(() => {
      setLiveUpdates(mockLiveUpdates)
      setShameBoard(mockShameBoard)
      setBattleOfTheDay(mockBattleOfTheDay)
      setViralMoments(mockViralMoments)
      
      // Countdown to next ranking update (every hour)
      const nextHour = new Date()
      nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0)
      const timeLeft = nextHour.getTime() - new Date().getTime()
      setTimeUntilNextRanking(Math.floor(timeLeft / 1000))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeUntilNextRanking(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Try to load real data with fallback to mock data
      try {
        // Load featured businesses (premium businesses)
        const businesses = await searchBusinesses({ premium: true })
        setFeaturedBusinesses(businesses.length > 0 ? businesses.slice(0, 6) : [])
      } catch (err) {
        console.log('Using mock featured businesses:', err)
        setFeaturedBusinesses([])
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
      setFeaturedBusinesses([])
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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  const shareRanking = (business: any) => {
    const text = `🚀 ${business.name} is ranked #${business.rank} in Tanzania! Check out the live business rankings on BizIntelTZ`
    const url = `${window.location.origin}/business/${business.id}`
    
    if (navigator.share) {
      navigator.share({ title: 'BizIntelTZ Rankings', text, url })
    } else {
      navigator.clipboard.writeText(`${text} ${url}`)
      alert('Ranking shared to clipboard!')
    }
  }

  return (
    <div className="space-y-8">
      {/* LIVE BREAKING NEWS BANNER */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-600 opacity-90"></div>
        <div className="relative flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span className="font-bold text-lg">🔴 LIVE</span>
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg">
              ⚡ RANKING UPDATE IN: {formatTime(timeUntilNextRanking)} ⚡ 
              <span className="ml-4">🔥 {liveUpdates.length} BUSINESSES BATTLING RIGHT NOW! 🔥</span>
            </p>
          </div>
        </div>
      </div>

      {/* HERO - COMPETITIVE FOCUS */}
      <section className="relative bg-gradient-to-br from-red-900 via-red-800 to-orange-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-20 w-20 h-20 bg-warning-500/20 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-secondary-500/20 rounded-full animate-ping"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="flex items-center space-x-3 bg-red-600/80 backdrop-blur-sm rounded-full px-6 py-3 mb-4">
                  <Trophy className="h-6 w-6 text-warning-400 animate-bounce" />
                  <span className="text-white font-bold text-xl">WHO RULES TANZANIA BUSINESS?</span>
                  <Crown className="h-6 w-6 text-warning-400 animate-bounce" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white text-balance leading-tight">
                <span className="block text-red-300">YOUR COMPETITORS</span>
                <span className="block text-warning-300">ARE WATCHING</span>
                <span className="block">YOU LOSE</span>
              </h1>
              
              <p className="text-2xl text-red-100 max-w-4xl mx-auto text-balance font-semibold">
                🔥 LIVE RANKINGS UPDATE EVERY HOUR 🔥<br/>
                See exactly where you stand against every competitor in Tanzania.<br/>
                <span className="text-warning-300">Your customers are already checking...</span>
              </p>
            </div>
            
            {/* LIVE BATTLE OF THE DAY */}
            {battleOfTheDay && (
              <div className="max-w-4xl mx-auto bg-black/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-warning-500">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-warning-400 mb-2">⚔️ BATTLE OF THE DAY ⚔️</h2>
                  <p className="text-white">Winner gets the crown! Voting ends in: <span className="text-red-300 font-bold">{battleOfTheDay.ends_in}</span></p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="bg-blue-600/80 rounded-xl p-6 mb-4">
                      <h3 className="text-xl font-bold text-white mb-2">{battleOfTheDay.business_a.name}</h3>
                      <div className="text-4xl font-black text-white">{battleOfTheDay.business_a.score}</div>
                      <div className="text-blue-200">{battleOfTheDay.business_a.votes} votes</div>
                    </div>
                    <button className="btn bg-blue-600 text-white hover:bg-blue-700 font-bold">
                      🗳️ VOTE NOW
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-600/80 rounded-xl p-6 mb-4">
                      <h3 className="text-xl font-bold text-white mb-2">{battleOfTheDay.business_b.name}</h3>
                      <div className="text-4xl font-black text-white">{battleOfTheDay.business_b.score}</div>
                      <div className="text-green-200">{battleOfTheDay.business_b.votes} votes</div>
                    </div>
                    <button className="btn bg-green-600 text-white hover:bg-green-700 font-bold">
                      🗳️ VOTE NOW
                    </button>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <p className="text-warning-300 font-semibold">🏆 Prize: {battleOfTheDay.prize}</p>
                </div>
              </div>
            )}
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-red-600" />
                <input
                  type="text"
                  placeholder="🔍 SPY ON YOUR COMPETITORS... Find any business in Tanzania"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-40 py-5 text-xl rounded-2xl border-0 shadow-2xl focus:ring-4 focus:ring-red-500 focus:shadow-xl transition-all duration-200 bg-white/95"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 btn bg-red-600 text-white hover:bg-red-700 px-8 py-3 font-bold"
                >
                  🕵️ SPY NOW
                </button>
              </div>
            </form>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                to="/rankings"
                className="glass-effect rounded-xl px-8 py-4 text-white hover:bg-white/20 transition-all duration-200 flex items-center space-x-3 font-bold"
              >
                <Trophy className="h-6 w-6 animate-bounce" />
                <span>🔥 LIVE RANKINGS</span>
              </Link>
              <Link
                to="/create-business"
                className="glass-effect rounded-xl px-8 py-4 text-white hover:bg-white/20 transition-all duration-200 flex items-center space-x-3 font-bold"
              >
                <Sword className="h-6 w-6" />
                <span>⚔️ JOIN THE BATTLE</span>
              </Link>
              <button
                onClick={() => window.open('/rankings?share=true', '_blank')}
                className="glass-effect rounded-xl px-8 py-4 text-white hover:bg-white/20 transition-all duration-200 flex items-center space-x-3 font-bold"
              >
                <Share2 className="h-6 w-6" />
                <span>📢 SHARE & SHAME</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE ACTIVITY FEED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Activity className="h-6 w-6 text-red-600 animate-pulse" />
              <span>🔴 LIVE BUSINESS BATTLES</span>
            </h2>
            <div className="text-sm text-gray-600">Updates every 30 seconds</div>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {liveUpdates.map((update, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                update.severity === 'danger' ? 'bg-red-100 border-l-4 border-red-500' :
                update.severity === 'success' ? 'bg-green-100 border-l-4 border-green-500' :
                update.severity === 'warning' ? 'bg-yellow-100 border-l-4 border-yellow-500' :
                'bg-blue-100 border-l-4 border-blue-500'
              }`}>
                <div className="flex items-center space-x-3">
                  {update.type === 'rank_change' && <TrendingUp className="h-5 w-5 text-green-600" />}
                  {update.type === 'rank_drop' && <ArrowDown className="h-5 w-5 text-red-600" />}
                  {update.type === 'new_review' && <Star className="h-5 w-5 text-yellow-600" />}
                  {update.type === 'new_business' && <Plus className="h-5 w-5 text-blue-600" />}
                  {update.type === 'badge_earned' && <Award className="h-5 w-5 text-purple-600" />}
                  
                  <div>
                    <span className="font-semibold text-gray-900">{update.business}</span>
                    <span className="text-gray-700 ml-2">
                      {update.type === 'rank_change' && `jumped ${update.change} positions! 🚀`}
                      {update.type === 'rank_drop' && `dropped ${update.change} positions 📉`}
                      {update.type === 'new_review' && `got a ${update.rating}⭐ review!`}
                      {update.type === 'new_business' && `joined the competition!`}
                      {update.type === 'badge_earned' && `earned "${update.badge}" badge! 🏆`}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{update.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHAME BOARD - Public Humiliation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-900 to-red-800 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center space-x-3">
              <Skull className="h-8 w-8 text-red-300" />
              <span>💀 WALL OF SHAME 💀</span>
              <Skull className="h-8 w-8 text-red-300" />
            </h2>
            <p className="text-red-200 text-xl">These businesses are LOSING ground to their competitors!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shameBoard.map((business, index) => (
              <div key={index} className="bg-red-800/50 rounded-xl p-6 border-2 border-red-600">
                <div className="text-center">
                  <div className="text-6xl mb-4">😱</div>
                  <h3 className="font-bold text-xl mb-2">{business.name}</h3>
                  <div className="text-red-300 text-lg font-semibold mb-2">
                    Rank Drop: {business.rank_drop} positions
                  </div>
                  <div className="text-red-200 text-sm mb-3">{business.reason}</div>
                  <div className="text-warning-300 font-bold">
                    Lost {business.score_loss} points this week!
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-red-200 text-lg">📢 Don't let YOUR business end up here!</p>
            <Link to="/create-business" className="btn bg-warning-600 text-white hover:bg-warning-700 mt-4 font-bold text-xl px-8 py-4">
              🛡️ DEFEND YOUR RANKING
            </Link>
          </div>
        </div>
      </section>

      {/* LIVE LEADERBOARD WITH OBSESSION FEATURES */}
      {leaderboardData && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl animate-pulse">
                <Trophy className="h-16 w-16 text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              ⚡ LIVE POWER RANKINGS ⚡
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto font-semibold">
              🔥 Updates every hour! 🔥 See who's CRUSHING the competition right now.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Rankings */}
            <div className="lg:col-span-2">
              <div className="card border-4 border-warning-500">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                      <Crown className="h-6 w-6 text-warning-500 animate-bounce" />
                      <span>👑 THE DOMINATORS</span>
                    </h3>
                    <div className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                      Next update: {formatTime(timeUntilNextRanking)}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {leaderboardData.overall_leaders.slice(0, 5).map((business, index) => {
                      const badge = getRankBadge(business.rank)
                      const IconComponent = badge.icon
                      
                      return (
                        <div
                          key={business.id}
                          className={`flex items-center justify-between p-6 rounded-xl transition-all hover:shadow-lg border-2 ${
                            index === 0 
                              ? 'bg-gradient-to-r from-warning-50 to-warning-100 border-warning-500 shadow-lg' 
                              : index < 3
                              ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300'
                              : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`flex items-center justify-center w-12 h-12 rounded-full font-black text-xl ${
                              index === 0 ? 'bg-warning-500 text-white animate-pulse' :
                              index === 1 ? 'bg-gray-400 text-white' :
                              index === 2 ? 'bg-orange-600 text-white' :
                              'bg-gray-200 text-gray-700'
                            }`}>
                              {index === 0 ? <Crown className="h-6 w-6" /> : business.rank}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Link
                                  to={`/business/${business.id}`}
                                  className="font-bold text-xl text-gray-900 hover:text-primary-600 transition-colors"
                                >
                                  {business.name}
                                </Link>
                                {index === 0 && <span className="text-2xl animate-bounce">👑</span>}
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
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>{business.sector}</span>
                                <span>•</span>
                                <span>{business.region}</span>
                                <span>•</span>
                                <span className="flex items-center space-x-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{business.views_count.toLocaleString()} stalkers</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className="text-2xl font-black text-primary-600">{business.digital_score}</div>
                              <div className="text-xs text-gray-600">Power Score</div>
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
                                {business.rank_change > 0 && <ArrowUp className="h-4 w-4 text-success-600" />}
                                {business.rank_change < 0 && <ArrowDown className="h-4 w-4 text-error-600" />}
                                {business.rank_change === 0 && <Minus className="h-4 w-4 text-gray-400" />}
                                <span className={`font-bold ${
                                  business.rank_change > 0 ? 'text-success-600' :
                                  business.rank_change < 0 ? 'text-error-600' : 'text-gray-600'
                                }`}>
                                  {business.rank_change !== 0 ? Math.abs(business.rank_change) : '—'}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">vs last hour</div>
                            </div>
                            <button
                              onClick={() => shareRanking(business)}
                              className="btn bg-red-600 text-white hover:bg-red-700 text-sm px-4 py-2 font-bold"
                            >
                              📢 EXPOSE
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Viral Moments & Competition Alerts */}
            <div className="space-y-6">
              {/* Viral Moments */}
              <div className="card border-2 border-green-500">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Fire className="h-5 w-5 text-red-500" />
                    <span>🔥 VIRAL MOMENTS</span>
                  </h3>
                  <div className="space-y-4">
                    {viralMoments.map((moment, index) => (
                      <div key={index} className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900">{moment.business}</h4>
                        <p className="text-sm text-gray-700">{moment.achievement}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Share2 className="h-3 w-3" />
                            <span>{moment.shares} shares</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{moment.likes} likes</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Competition Alerts */}
              <div className="card border-2 border-red-500">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-red-500 animate-pulse" />
                    <span>🚨 THREAT ALERTS</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                      <p className="text-sm font-semibold text-red-900">New competitor detected!</p>
                      <p className="text-xs text-red-700">TechStart Solutions just entered your market</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                      <p className="text-sm font-semibold text-yellow-900">Ranking threat!</p>
                      <p className="text-xs text-yellow-700">Arusha Coffee Co is gaining ground fast</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                      <p className="text-sm font-semibold text-orange-900">Review bombing alert!</p>
                      <p className="text-xs text-orange-700">Someone is targeting businesses in your sector</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link
                  to="/rankings"
                  className="btn bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 font-bold text-lg px-8 py-4 w-full"
                >
                  ⚔️ JOIN THE WAR
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* OBSESSION CALL TO ACTION */}
      <section className="bg-gradient-to-r from-black to-red-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                YOUR COMPETITORS<br/>
                <span className="text-red-400">CHECK THIS PAGE</span><br/>
                <span className="text-warning-400">EVERY HOUR</span>
              </h2>
              <p className="text-2xl text-red-100 max-w-3xl mx-auto font-bold">
                🔥 DON'T LET THEM WIN 🔥<br/>
                Claim your business NOW and start climbing the rankings.<br/>
                <span className="text-warning-300">Every second you wait, they get ahead.</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/create-business"
                className="btn bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 text-2xl px-12 py-6 shadow-2xl hover:shadow-3xl font-black"
              >
                ⚔️ CLAIM & DOMINATE
              </Link>
              <Link
                to="/rankings"
                className="btn bg-gradient-to-r from-warning-600 to-warning-700 text-white hover:from-warning-700 hover:to-warning-800 text-2xl px-12 py-6 shadow-2xl hover:shadow-3xl font-black"
              >
                👁️ SPY ON COMPETITORS
              </Link>
            </div>
            
            <div className="mt-12">
              <p className="text-red-200 text-lg font-semibold">
                ⏰ Rankings update in: <span className="text-warning-300 text-2xl font-black">{formatTime(timeUntilNextRanking)}</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home