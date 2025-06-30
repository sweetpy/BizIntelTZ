import React, { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Building2, 
  Search, 
  Plus, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  User, 
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
  Trophy
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AlertSystem from './AlertSystem'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-primary-600 rounded-lg group-hover:bg-primary-700 transition-colors">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BizIntelTZ</h1>
                <p className="text-xs text-gray-500">Business Intelligence Engine</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
              <Link
                to="/rankings"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/rankings') 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Rankings
              </Link>
              <Link
                to="/search"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/search') 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Search
              </Link>
              <Link
                to="/verify"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/verify')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Verify BI ID
              </Link>
              <Link
                to="/features"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/features')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Features
              </Link>
              
              {/* Intelligence Dropdown */}
              {isAuthenticated && (
                <div className="relative group">
                  <button className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                    <Brain className="h-4 w-4" />
                    <span>Intelligence</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-2">
                      <Link
                        to="/intelligence/market-mapping"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Market Mapping & Penetration
                      </Link>
                      <Link
                        to="/intelligence/creditworthiness"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Creditworthiness Intelligence
                      </Link>
                      <Link
                        to="/intelligence/distribution"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Distribution Heatmaps
                      </Link>
                      <Link
                        to="/intelligence/lead-generation"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Lead Generation API
                      </Link>
                      <Link
                        to="/intelligence/informal-economy"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Informal Economy Analytics
                      </Link>
                      <Link
                        to="/intelligence/business-monitoring"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Business Change Monitoring
                      </Link>
                      <Link
                        to="/intelligence/competitive"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Competitive Intelligence
                      </Link>
                      <Link
                        to="/intelligence/predictive"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Predictive Analytics
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Ecosystem Dropdown */}
              {isAuthenticated && (
                <div className="relative group">
                  <button className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                    <Sparkles className="h-4 w-4" />
                    <span>Ecosystem</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-2">
                      <Link
                        to="/ecosystem/adaptive-ai"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Adaptive AI Insights
                      </Link>
                      <Link
                        to="/ecosystem/community"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Community & Forums
                      </Link>
                      <Link
                        to="/ecosystem/marketplace"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Business Marketplace
                      </Link>
                      <Link
                        to="/ecosystem/seo-engine"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        SEO Content Engine
                      </Link>
                      <Link
                        to="/ecosystem/ai-marketing"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        AI Marketing Assistant
                      </Link>
                      <Link
                        to="/ecosystem/skill-building"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Skill-Building Platform
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              
              <Link
                to="/create-business"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/create-business') 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Add Business
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && <AlertSystem />}
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {/* Admin Dropdown */}
                  <div className="relative group">
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                      <Settings className="h-5 w-5" />
                    </button>
                    <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-2">
                        <Link
                          to="/admin"
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </div>
                        </Link>
                        <Link
                          to="/admin/data-quality"
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <Database className="h-4 w-4" />
                            <span>Data Quality</span>
                          </div>
                        </Link>
                        <Link
                          to="/admin/feedback"
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>Feedback & Surveys</span>
                          </div>
                        </Link>
                        <Link
                          to="/admin/roles"
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4" />
                            <span>Role Management</span>
                          </div>
                        </Link>
                        <Link
                          to="/admin/integrations"
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4" />
                            <span>Integrations</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary-600 rounded-lg">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">BizIntelTZ</h3>
                  <p className="text-xs text-gray-500">Business Intelligence Engine</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Empowering Tanzanian businesses with comprehensive intelligence, verified BI IDs, and advanced analytics.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/rankings" className="hover:text-gray-900 transition-colors">Rankings</Link></li>
                <li><Link to="/search" className="hover:text-gray-900 transition-colors">Search Businesses</Link></li>
                <li><Link to="/verify" className="hover:text-gray-900 transition-colors">Verify BI ID</Link></li>
                <li><Link to="/features" className="hover:text-gray-900 transition-colors">All Features</Link></li>
                <li><Link to="/create-business" className="hover:text-gray-900 transition-colors">Add Business</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Intelligence</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Market Mapping</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Credit Intelligence</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Distribution Analysis</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              © 2024 BizIntelTZ. All rights reserved. | Advanced Business Intelligence & Verification System
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
