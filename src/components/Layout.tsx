import React, { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Building2, Search, Plus, BarChart3, Users, Settings, LogOut, User, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

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
                <p className="text-xs text-gray-500">Business Intelligence</p>
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
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/admin"
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Admin Dashboard"
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
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
                  <p className="text-xs text-gray-500">Business Intelligence</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Empowering Tanzanian businesses with comprehensive intelligence, verified BI IDs, and secure verification systems.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/search" className="hover:text-gray-900 transition-colors">Search Businesses</Link></li>
                <li><Link to="/verify" className="hover:text-gray-900 transition-colors">Verify BI ID</Link></li>
                <li><Link to="/create-business" className="hover:text-gray-900 transition-colors">Add Business</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">BI ID System</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">For Banks</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">For Businesses</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Verification Guide</a></li>
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
              © 2024 BizIntelTZ. All rights reserved. | Secure Business Verification with BI ID System
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout