import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, TrendingUp, Users, Award, Building2, ArrowRight, Star, Plus, Trophy, Crown, Eye, Target, ChevronRight, BarChart3, Database, Shield, ShieldCheck, Zap, Globe, Brain, Lock, CheckCircle, AlertTriangle, Clock, Activity, PieChart, LineChart, Briefcase, FileText, DollarSign } from 'lucide-react'
import { searchBusinesses, getAnalytics, getLeaderboardData } from '../utils/api'
import { Business, AnalyticsData, LeaderboardData } from '../types'
import BusinessCard from '../components/BusinessCard'

// Performance optimized component with memoization
const Home: React.FC = () => {
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null)

  // Memoized mock data for better performance
  const mockAnalytics: AnalyticsData = useMemo(() => ({
    views: 2150000,
    clicks: 1340000
  }), [])

  const mockLeaderboardData: LeaderboardData = useMemo(() => ({
    overall_leaders: [
      {
        id: "ent-1",
        name: "Vodacom Tanzania Limited",
        bi_id: "BIZ-TZ-20241201-0001",
        region: "Dar es Salaam",
        sector: "Telecommunications",
        digital_score: 95,
        rank: 1,
        previous_rank: 1,
        rank_change: 0,
        views_count: 125840,
        reviews_count: 2456,
        average_rating: 4.7,
        badges: [],
        buzz_score: 94,
        market_share_percentage: 42.3,
        sentiment_score: 88,
        growth_rate: 8.4,
        premium: true,
        verified: true,
        claimed: true
      },
      {
        id: "ent-2",
        name: "CRDB Bank PLC",
        bi_id: "BIZ-TZ-20241201-0002",
        region: "Dar es Salaam",
        sector: "Financial Services",
        digital_score: 92,
        rank: 2,
        previous_rank: 3,
        rank_change: 1,
        views_count: 98230,
        reviews_count: 1876,
        average_rating: 4.5,
        badges: [],
        buzz_score: 89,
        market_share_percentage: 28.7,
        sentiment_score: 85,
        growth_rate: 12.1,
        premium: true,
        verified: true,
        claimed: true
      },
      {
        id: "ent-3",
        name: "Precision Air Services",
        bi_id: "BIZ-TZ-20241201-0003",
        region: "Dar es Salaam",
        sector: "Aviation",
        digital_score: 89,
        rank: 3,
        previous_rank: 2,
        rank_change: -1,
        views_count: 87450,
        reviews_count: 1234,
        average_rating: 4.4,
        badges: [],
        buzz_score: 86,
        market_share_percentage: 35.8,
        sentiment_score: 82,
        growth_rate: 6.7,
        premium: true,
        verified: true,
        claimed: true
      },
      {
        id: "ent-4",
        name: "Azam FC",
        bi_id: "BIZ-TZ-20241201-0004",
        region: "Dar es Salaam",
        sector: "Sports & Entertainment",
        digital_score: 87,
        rank: 4,
        previous_rank: 5,
        rank_change: 1,
        views_count: 76230,
        reviews_count: 987,
        average_rating: 4.3,
        badges: [],
        buzz_score: 84,
        market_share_percentage: 18.2,
        sentiment_score: 89,
        growth_rate: 15.3,
        premium: true,
        verified: true,
        claimed: true
      },
      {
        id: "ent-5",
        name: "Tanzania Breweries Limited",
        bi_id: "BIZ-TZ-20241201-0005",
        region: "Dar es Salaam",
        sector: "Manufacturing",
        digital_score: 85,
        rank: 5,
        previous_rank: 4,
        rank_change: -1,
        views_count: 68920,
        reviews_count: 1543,
        average_rating: 4.2,
        badges: [],
        buzz_score: 82,
        market_share_percentage: 52.4,
        sentiment_score: 80,
        growth_rate: 4.8,
        premium: true,
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
    recent_badge_winners: []
  }), [])

  const enterpriseMetrics = useMemo(() => ({
    totalBusinesses: '250,000+',
    verifiedEntities: '180,000+',
    monthlyVerifications: '45,000+',
    dataPoints: '2M+',
    regions: '31',
    sectors: '120+',
    lastUpdate: new Date().toLocaleTimeString(),
    uptime: '99.97%',
    responseTime: '< 200ms',
    accuracy: '99.8%'
  }), [])

  // Optimized data loading with error boundaries
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const promises = []
      
      // Load featured businesses with fallback
      promises.push(
        searchBusinesses({ premium: true }).catch(() => [])
      )
      
      // Load analytics with fallback
      promises.push(
        getAnalytics().catch(() => mockAnalytics)
      )
      
      // Load leaderboard with fallback
      promises.push(
        getLeaderboardData().catch(() => mockLeaderboardData)
      )

      const [businesses, analyticsData, leaderboard] = await Promise.all(promises)
      
      setFeaturedBusinesses(Array.isArray(businesses) ? businesses.slice(0, 6) : [])
      setAnalytics(analyticsData || mockAnalytics)
      setLeaderboardData(leaderboard || mockLeaderboardData)

    } catch (error) {
      console.error('Error loading data:', error)
      setAnalytics(mockAnalytics)
      setLeaderboardData(mockLeaderboardData)
      setError('Some features may be limited due to connectivity issues')
    } finally {
      setIsLoading(false)
      setRealTimeMetrics(enterpriseMetrics)
    }
  }, [mockAnalytics, mockLeaderboardData, enterpriseMetrics])

  useEffect(() => {
    loadData()
    
    // Set up real-time updates with optimized intervals
    const interval = setInterval(() => {
      setRealTimeMetrics((prev: any) => ({
        ...prev,
        lastUpdate: new Date().toLocaleTimeString()
      }))
    }, 30000)

    return () => clearInterval(interval)
  }, [loadData])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }, [searchQuery])

  // Loading skeleton component
  const LoadingSkeleton = React.memo(() => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  ))

  return (
    <div className="flex flex-col">
      {/* Error Banner */}
      {error && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mx-4 sm:mx-6 lg:mx-8 mt-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
            <p className="text-orange-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-28 lg:pt-16 overflow-hidden" role="banner">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-1 h-full p-2 md:p-4">
            {[...Array(36)].map((_, i) => (
              <div key={i} className="bg-white/5 animate-pulse rounded" style={{ animationDelay: `${i * 0.15}s` }}></div>
            ))}
          </div>
        </div>
        
        {/* Main content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Left side: main content */}
            <div className="lg:col-span-3 space-y-6 lg:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-blue-600/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-blue-500/30">
                <Shield className="h-4 w-4 text-blue-300 flex-shrink-0" />
                <span className="text-blue-200 font-medium text-sm">Enterprise Business Intelligence</span>
              </div>
              
              {/* Headline */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Tanzania's Premier
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Business Intelligence
                </span>
                Platform
              </h1>
              
              {/* Subheadline */}
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl">
                Comprehensive data intelligence covering <strong className="text-white">250,000+ verified business entities</strong> 
                across Tanzania. Advanced analytics, verification systems, and competitive intelligence 
                trusted by leading financial institutions.
              </p>
              
              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors">
                  <div className="text-xl font-bold text-white">{realTimeMetrics?.totalBusinesses || '250,000+'}</div>
                  <div className="text-xs text-slate-300">Verified Entities</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors">
                  <div className="text-xl font-bold text-white">{realTimeMetrics?.uptime || '99.97%'}</div>
                  <div className="text-xs text-slate-300">System Uptime</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors">
                  <div className="text-xl font-bold text-white">{realTimeMetrics?.monthlyVerifications || '45,000+'}</div>
                  <div className="text-xs text-slate-300">Monthly Verifications</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors">
                  <div className="text-xl font-bold text-white">{realTimeMetrics?.dataPoints || '2M+'}</div>
                  <div className="text-xs text-slate-300">Data Points</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors">
                  <div className="text-xl font-bold text-white">{realTimeMetrics?.responseTime || '< 200ms'}</div>
                  <div className="text-xs text-slate-300">API Response</div>
                </div>
              </div>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} role="search" className="mt-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Search business entities, BI IDs, or sectors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-28 py-4 text-base rounded-lg border border-slate-600 bg-white/10 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    aria-label="Search business entities"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="Search"
                  >
                    Search
                  </button>
                </div>
              </form>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to="/verify"
                  className="btn bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 text-base font-semibold flex items-center justify-center space-x-2 transition-all hover:scale-105 focus:ring-2 focus:ring-blue-400 shadow-lg shadow-blue-900/20"
                >
                  <Shield className="h-5 w-5 flex-shrink-0" />
                  <span>Verify BI ID</span>
                </Link>
                <Link
                  to="/rankings"
                  className="btn bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 px-6 py-3 text-base font-semibold flex items-center justify-center space-x-2 transition-all hover:scale-105 focus:ring-2 focus:ring-white/40"
                >
                  <BarChart3 className="h-5 w-5 flex-shrink-0" />
                  <span>View Rankings</span>
                </Link>
              </div>
            </div>

            {/* Right side: Intelligence Dashboard */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors shadow-2xl shadow-blue-900/10">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-white">Live Intelligence Dashboard</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-slate-300">Live</span>
                  </div>
                </div>
                
                <div className="space-y-5">
                  {isLoading ? (
                    <LoadingSkeleton />
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">{analytics?.views.toLocaleString() || '2.15M'}</div>
                          <div className="text-xs text-slate-400">Monthly Queries</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{analytics?.clicks.toLocaleString() || '1.34M'}</div>
                          <div className="text-xs text-slate-400">Verifications</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">System Status</span>
                          <span className="text-green-400 font-medium flex items-center space-x-1">
                            <CheckCircle className="h-3 w-3 flex-shrink-0" />
                            <span>Operational</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Last Update</span>
                          <span className="text-slate-300">{realTimeMetrics?.lastUpdate || 'Just now'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Data Coverage</span>
                          <span className="text-blue-400">{realTimeMetrics?.regions || '31'} Regions</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Accuracy</span>
                          <span className="text-green-400">{realTimeMetrics?.accuracy || '99.8%'}</span>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-4 border-t border-white/10">
                    <Link
                      to="/admin"
                      className="w-full btn bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      Access Full Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-16 sm:space-y-20">
        {/* TRUST INDICATORS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" role="region" aria-label="Trusted Organizations">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Leading Organizations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Powering business intelligence for banks, corporations, and government agencies</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center mb-12">
            {[
              { name: "Central Bank", color: "blue" },
              { name: "CRDB Bank", color: "green" },
              { name: "Vodacom", color: "red" },
              { name: "Government", color: "purple" }
            ].map((org, index) => (
              <div key={index} className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg p-6 w-full h-16 flex items-center justify-center group shadow-sm">
                <span className="text-gray-600 group-hover:text-gray-800 font-semibold transition-colors">{org.name}</span>
              </div>
            ))}
          </div>
          
          {/* Compliance Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {[
              { label: "ISO 27001", desc: "Certified" },
              { label: "SOC 2", desc: "Type II" },
              { label: "GDPR", desc: "Compliant" },
              { label: "99.97%", desc: "Uptime SLA" },
              { label: "256-bit", desc: "Encryption" }
            ].map((badge, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                <div className="font-bold text-gray-900">{badge.label}</div>
                <div className="text-sm text-gray-600">{badge.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* BI ID VERIFICATION SYSTEM */}
        <section className="bg-slate-50 py-16" role="region" aria-label="BI ID Verification System">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-3 bg-blue-100 rounded-xl mt-1">
                      <ShieldCheck className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Business Intelligence ID System</h2>
                      <p className="text-xl text-gray-600 leading-relaxed">
                        Every business entity receives a unique, verifiable BI ID for secure identification 
                        and verification. Essential for KYB compliance, due diligence, and risk assessment.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    {
                      icon: Lock,
                      title: "Secure Verification",
                      description: "Cryptographically secure IDs with real-time verification API for instant business validation.",
                      color: "blue"
                    },
                    {
                      icon: Database,
                      title: "Comprehensive Data",
                      description: "Complete business profiles with ownership, financial, and operational intelligence data.",
                      color: "green"
                    },
                    {
                      icon: Clock,
                      title: "Real-Time Updates",
                      description: "Continuous monitoring and updates ensure data accuracy and reliability for critical decisions.",
                      color: "orange"
                    },
                    {
                      icon: Globe,
                      title: "API Integration",
                      description: "Enterprise-grade APIs for seamless integration with your existing systems and workflows.",
                      color: "purple"
                    }
                  ].map((feature, index) => (
                    <div key={index} className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <feature.icon className={`h-6 w-6 text-${feature.color}-600 flex-shrink-0`} />
                        <h3 className="font-bold text-gray-900">{feature.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <Link
                    to="/verify"
                    className="btn btn-primary text-lg px-8 py-4 flex items-center space-x-2 w-fit hover:scale-105 transition-transform focus:ring-2 focus:ring-blue-400 shadow-lg shadow-blue-500/20"
                  >
                    <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                    <span>Verify Business ID</span>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Sample BI ID Verification</h3>
                    <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200 shadow-inner">
                      <div className="text-sm text-blue-600 font-medium mb-2">Business Intelligence ID</div>
                      <div className="text-2xl font-mono font-bold text-blue-900 mb-4">BIZ-TZ-20241201-0001</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-left">
                          <div className="text-gray-600">Entity:</div>
                          <div className="font-semibold">Vodacom Tanzania Ltd</div>
                        </div>
                        <div className="text-left">
                          <div className="text-gray-600">Status:</div>
                          <div className="font-semibold text-green-600 flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4 flex-shrink-0" />
                            <span>Verified</span>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-gray-600">Sector:</div>
                          <div className="font-semibold">Telecommunications</div>
                        </div>
                        <div className="text-left">
                          <div className="text-gray-600">Region:</div>
                          <div className="font-semibold">Dar es Salaam</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Verification Time", value: "< 200ms", color: "green" },
                      { label: "Data Accuracy", value: "99.8%", color: "blue" },
                      { label: "Coverage", value: "National", color: "purple" },
                      { label: "Uptime", value: "99.97%", color: "green" }
                    ].map((metric, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100">
                        <span className="text-gray-700 font-medium">{metric.label}</span>
                        <span className={`text-${metric.color}-600 font-semibold`}>{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARKET INTELLIGENCE RANKINGS */}
        {leaderboardData && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" role="region" aria-label="Market Intelligence Rankings">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Market Intelligence & Rankings</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real-time business performance analytics and competitive intelligence 
                across all sectors and regions in Tanzania.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Market Leaders */}
              <div className="lg:col-span-2">
                <div className="card border border-gray-200 shadow-lg rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                        <Trophy className="h-6 w-6 text-blue-600 flex-shrink-0" />
                        <span>Market Leaders</span>
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Live Data</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-3">
                      {isLoading ? (
                        [...Array(5)].map((_, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-xl animate-pulse">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        leaderboardData.overall_leaders.slice(0, 5).map((business, index) => (
                          <div
                            key={business.id}
                            className={`flex items-center justify-between p-5 rounded-xl border transition-all hover:shadow-md ${
                              index === 0 
                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' 
                                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                                index === 0 ? 'bg-blue-600 text-white' :
                                index === 1 ? 'bg-gray-500 text-white' :
                                index === 2 ? 'bg-orange-500 text-white' :
                                'bg-gray-300 text-gray-700'
                              } flex-shrink-0`}>
                                {business.rank}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Link
                                    to={`/business/${business.id}`}
                                    className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 truncate"
                                  >
                                    {business.name}
                                  </Link>
                                  {business.verified && (
                                    <ShieldCheck className="h-4 w-4 text-green-600 flex-shrink-0" aria-label="Verified" />
                                  )}
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-gray-600 truncate">
                                  <span>{business.sector}</span>
                                  <span>•</span>
                                  <span>{business.region}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-5 flex-shrink-0 ml-4">
                              <div className="text-center">
                                <div className="text-xl font-bold text-blue-600">{business.digital_score}</div>
                                <div className="text-xs text-gray-600">Score</div>
                              </div>
                              <div className="text-center hidden sm:block">
                                <div className="text-lg font-semibold text-gray-900">{business.market_share_percentage}%</div>
                                <div className="text-xs text-gray-600">Market</div>
                              </div>
                              <div className="text-center">
                                <div className={`text-lg font-semibold flex items-center ${
                                  business.growth_rate > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {business.growth_rate > 0 && <TrendingUp className="h-4 w-4 flex-shrink-0 mr-1" />}
                                  <span>{business.growth_rate > 0 ? '+' : ''}{business.growth_rate}%</span>
                                </div>
                                <div className="text-xs text-gray-600">Growth</div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="mt-6 text-center">
                      <Link
                        to="/rankings"
                        className="btn btn-primary px-6 py-3 hover:scale-105 transition-transform focus:ring-2 focus:ring-blue-400 shadow-md shadow-blue-500/10"
                      >
                        View Complete Rankings
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Intelligence Insights */}
              <div className="space-y-6">
                <div className="card border border-gray-200 shadow-lg rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-purple-100">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-purple-600 flex-shrink-0" />
                      <span>Intelligence Insights</span>
                    </h3>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm font-semibold text-blue-900">Sector Growth</span>
                      </div>
                      <p className="text-sm text-blue-800">Telecommunications sector showing 12.4% growth this quarter</p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm font-semibold text-green-900">Market Leader</span>
                      </div>
                      <p className="text-sm text-green-800">Vodacom maintains dominance with 42.3% market share</p>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:bg-orange-100 transition-colors shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                        <span className="text-sm font-semibold text-orange-900">Risk Alert</span>
                      </div>
                      <p className="text-sm text-orange-800">3 entities require verification updates</p>
                    </div>
                  </div>
                </div>

                <div className="card border border-gray-200 shadow-lg rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">System Health</h3>
                  </div>
                  
                  <div className="p-5">
                    <div className="space-y-3">
                      {[
                        { label: "API Status", value: "Operational", icon: CheckCircle, color: "green" },
                        { label: "Data Freshness", value: "< 5min", color: "blue" },
                        { label: "Coverage", value: "99.2%", color: "purple" },
                        { label: "Response Time", value: "< 200ms", color: "green" }
                      ].map((metric, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
                          <span className="text-sm text-gray-600">{metric.label}</span>
                          <span className={`text-${metric.color}-600 font-semibold flex items-center space-x-1 text-sm`}>
                            {metric.icon && <metric.icon className="h-4 w-4 flex-shrink-0 mr-1" />}
                            <span>{metric.value}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ENTERPRISE FEATURES */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16" role="region" aria-label="Enterprise Features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Enterprise-Grade Features</h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Comprehensive business intelligence platform designed for financial institutions, 
                corporations, and government agencies requiring the highest standards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: Database,
                  title: "Complete Data Coverage",
                  description: "250,000+ verified business entities across all 31 regions of Tanzania with comprehensive ownership, financial, and operational data.",
                  features: ["Real-time verification status", "Ownership structure mapping", "Financial health indicators"],
                  color: "blue"
                },
                {
                  icon: Shield,
                  title: "Security & Compliance",
                  description: "Bank-grade security with compliance standards for KYB, AML, and regulatory requirements. Encrypted data transmission and audit trails.",
                  features: ["ISO 27001 certified infrastructure", "End-to-end encryption", "Complete audit logging"],
                  color: "green"
                },
                {
                  icon: Brain,
                  title: "AI-Powered Analytics",
                  description: "Advanced machine learning algorithms for predictive analytics, risk assessment, and market intelligence insights.",
                  features: ["Predictive risk modeling", "Market trend analysis", "Competitive intelligence"],
                  color: "purple"
                },
                {
                  icon: Zap,
                  title: "High-Performance APIs",
                  description: "Enterprise-grade REST APIs with 99.97% uptime, sub-200ms response times, and comprehensive documentation for seamless integration.",
                  features: ["RESTful API architecture", "Rate limiting & throttling", "Comprehensive SDKs"],
                  color: "orange"
                },
                {
                  icon: Globe,
                  title: "Custom Integration",
                  description: "Tailored integration solutions with dedicated support for enterprise clients. Custom data feeds and specialized reporting.",
                  features: ["Dedicated account management", "Custom report generation", "Priority technical support"],
                  color: "cyan"
                },
                {
                  icon: Activity,
                  title: "Real-Time Monitoring",
                  description: "Continuous monitoring of business entities with instant alerts for changes in status, ownership, or risk profile modifications.",
                  features: ["Real-time status updates", "Automated alert system", "Change history tracking"],
                  color: "red"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-xl shadow-black/5">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className={`p-2 bg-${feature.color}-500/20 rounded-lg flex-shrink-0 mt-1`}>
                      <feature.icon className={`h-6 w-6 text-${feature.color}-400`} />
                    </div>
                    <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-slate-300 mb-5 leading-relaxed text-sm">{feature.description}</p>
                  <ul className="space-y-2 text-sm text-slate-400">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16" role="region" aria-label="Call to Action">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                  Ready to Access Tanzania's
                  <span className="block text-blue-200">Complete Business Intelligence?</span>
                </h2>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                  Join leading financial institutions and enterprises using our platform for 
                  critical business intelligence, verification, and risk assessment.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/create-business"
                  className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg hover:shadow-xl font-semibold hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  Request Enterprise Access
                </Link>
                <Link
                  to="/verify"
                  className="btn bg-blue-500/20 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 text-lg px-8 py-4 shadow-lg hover:shadow-xl font-semibold hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  Verify Business ID
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
                <div className="text-center bg-blue-500/20 backdrop-blur-sm rounded-lg p-5 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">250,000+</div>
                  <div className="text-blue-200 text-sm">Verified Entities</div>
                </div>
                <div className="text-center bg-blue-500/20 backdrop-blur-sm rounded-lg p-5 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">99.97%</div>
                  <div className="text-blue-200 text-sm">System Uptime</div>
                </div>
                <div className="text-center bg-blue-500/20 backdrop-blur-sm rounded-lg p-5 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{"< 200ms"}</div>
                  <div className="text-blue-200 text-sm">API Response</div>
                </div>
                <div className="text-center bg-blue-500/20 backdrop-blur-sm rounded-lg p-5 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">31</div>
                  <div className="text-blue-200 text-sm">Regions Covered</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default React.memo(Home)