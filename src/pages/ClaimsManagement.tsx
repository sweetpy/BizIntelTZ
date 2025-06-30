import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Check, X, User, Phone, ArrowLeft, Clock } from 'lucide-react'
import { getClaims, approveClaim } from '../utils/api'
import { Claim } from '../types'
import toast from 'react-hot-toast'

const ClaimsManagement: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingClaim, setProcessingClaim] = useState<number | null>(null)

  useEffect(() => {
    loadClaims()
  }, [])

  const loadClaims = async () => {
    try {
      setIsLoading(true)
      const data = await getClaims()
      setClaims(data)
    } catch (error) {
      console.error('Error loading claims:', error)
      toast.error('Failed to load claims')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveClaim = async (index: number) => {
    try {
      setProcessingClaim(index)
      await approveClaim(index)
      toast.success('Claim approved successfully!')
      await loadClaims() // Refresh the list
    } catch (error) {
      console.error('Error approving claim:', error)
      toast.error('Failed to approve claim')
    } finally {
      setProcessingClaim(null)
    }
  }

  const pendingClaims = claims.filter(claim => !claim.approved)
  const approvedClaims = claims.filter(claim => claim.approved)

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
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
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Claims Management</h1>
              <p className="text-gray-600">Review and approve business ownership claims</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
            <span className="text-gray-600">{pendingClaims.length} Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success-500 rounded-full"></div>
            <span className="text-gray-600">{approvedClaims.length} Approved</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Claims</p>
              <p className="text-2xl font-bold text-gray-900">{claims.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Clock className="h-5 w-5 text-warning-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingClaims.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success-100 rounded-lg">
              <Check className="h-5 w-5 text-success-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedClaims.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Claims */}
      {pendingClaims.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-warning-600" />
            <h2 className="text-xl font-semibold text-gray-900">Pending Claims</h2>
            <span className="bg-warning-100 text-warning-700 px-2 py-1 rounded-full text-xs font-medium">
              {pendingClaims.length}
            </span>
          </div>
          
          <div className="space-y-4">
            {pendingClaims.map((claim, index) => {
              const originalIndex = claims.findIndex(c => c === claim)
              return (
                <div key={originalIndex} className="card p-6 border-l-4 border-warning-500">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Link
                          to={`/business/${claim.business_id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                        >
                          Business ID: {claim.business_id}
                        </Link>
                        <span className="bg-warning-100 text-warning-700 px-2 py-1 rounded-full text-xs font-medium">
                          Pending Review
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            <strong>Owner:</strong> {claim.owner_name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            <strong>Contact:</strong> {claim.contact}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/business/${claim.business_id}`}
                        className="btn btn-secondary text-sm"
                      >
                        View Business
                      </Link>
                      <button
                        onClick={() => handleApproveClaim(originalIndex)}
                        disabled={processingClaim === originalIndex}
                        className="btn btn-success text-sm flex items-center space-x-2"
                      >
                        <Check className="h-4 w-4" />
                        <span>
                          {processingClaim === originalIndex ? 'Approving...' : 'Approve'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Approved Claims */}
      {approvedClaims.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-success-600" />
            <h2 className="text-xl font-semibold text-gray-900">Approved Claims</h2>
            <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium">
              {approvedClaims.length}
            </span>
          </div>
          
          <div className="space-y-4">
            {approvedClaims.map((claim, index) => {
              const originalIndex = claims.findIndex(c => c === claim)
              return (
                <div key={originalIndex} className="card p-6 border-l-4 border-success-500">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Link
                          to={`/business/${claim.business_id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                        >
                          Business ID: {claim.business_id}
                        </Link>
                        <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium">
                          Approved
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            <strong>Owner:</strong> {claim.owner_name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            <strong>Contact:</strong> {claim.contact}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      to={`/business/${claim.business_id}`}
                      className="btn btn-secondary text-sm"
                    >
                      View Business
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {claims.length === 0 && (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Claims Yet</h3>
          <p className="text-gray-600 mb-8">
            Business ownership claims will appear here when submitted.
          </p>
          <Link to="/search" className="btn btn-primary">
            Browse Businesses
          </Link>
        </div>
      )}
    </div>
  )
}

export default ClaimsManagement
