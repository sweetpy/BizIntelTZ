import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mail, User, MessageSquare, ArrowLeft, ExternalLink } from 'lucide-react'
import { getLeads } from '../utils/api'
import { Lead } from '../types'
import toast from 'react-hot-toast'

const LeadsManagement: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    try {
      setIsLoading(true)
      const data = await getLeads()
      setLeads(data)
    } catch (error) {
      console.error('Error loading leads:', error)
      toast.error('Failed to load leads')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
              <Mail className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
              <p className="text-gray-600">Review customer inquiries and business leads</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-3 h-3 bg-success-500 rounded-full"></div>
          <span className="text-gray-600">{leads.length} Total Leads</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success-100 rounded-lg">
              <User className="h-5 w-5 text-success-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Inquirers</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(leads.map(lead => lead.name)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Businesses Contacted</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(leads.map(lead => lead.business_id)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leads List */}
      {leads.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Customer Inquiries</h2>
          </div>
          
          <div className="space-y-4">
            {leads.map((lead, index) => (
              <div key={index} className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                        <p className="text-sm text-gray-600">
                          Inquiry for Business ID: {lead.business_id}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Message:</p>
                      <p className="text-gray-800">{lead.message}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 ml-6">
                    <Link
                      to={`/business/${lead.business_id}`}
                      className="btn btn-secondary text-sm flex items-center space-x-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View Business</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Leads Yet</h3>
          <p className="text-gray-600 mb-8">
            Customer inquiries and business leads will appear here when submitted.
          </p>
          <Link to="/search" className="btn btn-primary">
            Browse Businesses
          </Link>
        </div>
      )}

      {/* Export Options */}
      {leads.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export & Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                const csvContent = [
                  ['Name', 'Business ID', 'Message'],
                  ...leads.map(lead => [lead.name, lead.business_id, lead.message])
                ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
                
                const blob = new Blob([csvContent], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
                
                toast.success('Leads exported successfully!')
              }}
              className="btn btn-secondary"
            >
              Export as CSV
            </button>
            
            <button
              onClick={loadLeads}
              className="btn btn-secondary"
            >
              Refresh Data
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeadsManagement