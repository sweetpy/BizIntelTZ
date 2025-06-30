import React, { useState } from 'react'
import { Shield, CheckCircle, XCircle, Search, Building2, Calendar, Clock } from 'lucide-react'
import { verifyBIID, requestBIVerification } from '../utils/api'
import { BIVerificationResult, BIVerificationRequest } from '../types'
import toast from 'react-hot-toast'

const BIVerification: React.FC = () => {
  const [biId, setBiId] = useState('')
  const [verificationResult, setVerificationResult] = useState<BIVerificationResult | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestData, setRequestData] = useState<BIVerificationRequest>({
    bi_id: '',
    requester_name: '',
    requester_contact: '',
    purpose: ''
  })

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!biId.trim()) {
      toast.error('Please enter a BI ID')
      return
    }

    try {
      setIsVerifying(true)
      const result = await verifyBIID(biId.trim())
      setVerificationResult(result)
      
      if (result.valid) {
        toast.success('Business verification successful!')
      } else {
        toast.error('BI ID not found')
      }
    } catch (error) {
      console.error('Error verifying BI ID:', error)
      toast.error('Verification failed. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleRequestVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await requestBIVerification(requestData)
      toast.success('Verification request submitted successfully!')
      setShowRequestForm(false)
      setRequestData({
        bi_id: '',
        requester_name: '',
        requester_contact: '',
        purpose: ''
      })
    } catch (error) {
      console.error('Error requesting verification:', error)
      toast.error('Failed to submit verification request')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">BI ID Verification</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Verify business authenticity using Business Intelligence IDs. 
          Perfect for banks, financial institutions, and business partners.
        </p>
      </div>

      {/* Verification Form */}
      <div className="card">
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Verification</h2>
          
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Intelligence ID
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={biId}
                  onChange={(e) => setBiId(e.target.value)}
                  className="input pl-11 font-mono"
                  placeholder="BIZ-TZ-YYYYMMDD-XXXX"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Enter the complete BI ID to verify business information
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full btn btn-primary"
            >
              {isVerifying ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify Business'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div className="card">
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              {verificationResult.valid ? (
                <CheckCircle className="h-8 w-8 text-success-600" />
              ) : (
                <XCircle className="h-8 w-8 text-error-600" />
              )}
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {verificationResult.valid ? 'Verification Successful' : 'Verification Failed'}
                </h3>
                <p className="text-gray-600">
                  {verificationResult.valid ? 'Business found and verified' : verificationResult.message}
                </p>
              </div>
            </div>
            
            {verificationResult.valid && verificationResult.business && (
              <div className="space-y-6">
                {/* Business Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Business Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Business Name</p>
                      <p className="text-gray-900">{verificationResult.business.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">BI ID</p>
                      <p className="font-mono text-gray-900">{verificationResult.business.bi_id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Region</p>
                      <p className="text-gray-900">{verificationResult.business.region || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Sector</p>
                      <p className="text-gray-900">{verificationResult.business.sector || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Verification Status</p>
                      <div className="flex items-center space-x-2">
                        {verificationResult.business.verified ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-success-600" />
                            <span className="text-success-600 font-medium">Verified</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 text-warning-600" />
                            <span className="text-warning-600 font-medium">Registered</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Digital Score</p>
                      <p className="text-gray-900">
                        {verificationResult.business.digital_score || 'Not rated'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Verification Details */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-900 mb-4">Verification Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Verification Date</p>
                      <p className="text-blue-900">
                        {new Date(verificationResult.verification_date).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-700">Status</p>
                      <p className="text-blue-900 capitalize">{verificationResult.status}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setRequestData({ ...requestData, bi_id: verificationResult.business!.bi_id })
                      setShowRequestForm(true)
                    }}
                    className="btn btn-secondary"
                  >
                    Request Detailed Verification
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Building2 className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">For Businesses</h3>
          </div>
          <ul className="space-y-2 text-gray-600">
            <li>• Get your unique BI ID when registering</li>
            <li>• Use for bank account opening</li>
            <li>• Streamline KYB processes</li>
            <li>• Build trust with partners</li>
          </ul>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-success-600" />
            <h3 className="text-lg font-semibold text-gray-900">For Financial Institutions</h3>
          </div>
          <ul className="space-y-2 text-gray-600">
            <li>• Verify business authenticity instantly</li>
            <li>• Reduce fraud and risk</li>
            <li>• Access digital scores and ratings</li>
            <li>• Streamline compliance processes</li>
          </ul>
        </div>
      </div>

      {/* Request Detailed Verification Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Detailed Verification</h3>
            <form onSubmit={handleRequestVerification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BI ID
                </label>
                <input
                  type="text"
                  value={requestData.bi_id}
                  onChange={(e) => setRequestData({ ...requestData, bi_id: e.target.value })}
                  className="input font-mono"
                  required
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requester Name
                </label>
                <input
                  type="text"
                  value={requestData.requester_name}
                  onChange={(e) => setRequestData({ ...requestData, requester_name: e.target.value })}
                  className="input"
                  required
                  placeholder="Institution or person name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Information
                </label>
                <input
                  type="text"
                  value={requestData.requester_contact}
                  onChange={(e) => setRequestData({ ...requestData, requester_contact: e.target.value })}
                  className="input"
                  required
                  placeholder="Email or phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose of Verification
                </label>
                <textarea
                  value={requestData.purpose}
                  onChange={(e) => setRequestData({ ...requestData, purpose: e.target.value })}
                  className="input h-20 resize-none"
                  required
                  placeholder="e.g., Bank account opening, loan application, partnership verification"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BIVerification