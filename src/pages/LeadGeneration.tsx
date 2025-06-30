import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Users, Download, Filter, ArrowLeft, Search, Phone } from 'lucide-react'
import { getLeadGenerationData, generateLeads, exportLeads } from '../utils/api'
import { LeadGenerationData } from '../types'
import toast from 'react-hot-toast'

const LeadGeneration: React.FC = () => {
  const [leadData, setLeadData] = useState<LeadGenerationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedSector, setSelectedSector] = useState<string>('')
  const [selectedRegion, setSelectedRegion] = useState<string>('')

  const sectors = [
    'Agriculture', 'Manufacturing', 'Services', 'Trade', 'Technology', 
    'Healthcare', 'Education', 'Tourism', 'Mining', 'Finance', 'Transport'
  ]

  const regions = [
    'Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Morogoro', 
    'Tanga', 'Kahama', 'Tabora', 'Kigoma', 'Sumbawanga', 'Kasulu'
  ]

  useEffect(() => {
    loadLeadData()
  }, [])

  const loadLeadData = async () => {
    try {
      setIsLoading(true)
      const data = await getLeadGenerationData()
      setLeadData(data)
    } catch (error) {
      console.error('Error loading lead generation data:', error)
      toast.error('Failed to load lead generation data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateLeads = async () => {
    try {
      setIsGenerating(true)
      const criteria = {
        sector: selectedSector || undefined,
        region: selectedRegion || undefined,
        min_quality_score: 70
      }
      await generateLeads(criteria)
      toast.success('New leads generated successfully!')
      await loadLeadData()
    } catch (error) {
      console.error('Error generating leads:', error)
      toast.error('Failed to generate leads')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExport = async (format: 'csv' | 'excel') => {
    try {
      const blob = await exportLeads(format)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `leads-${Date.now()}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('Leads exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export leads')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
              <h1 className="text-3xl font-bold text-gray-900">Lead Generation API</h1>
              <p className="text-gray-600">Bulk verified contacts and targeted lead generation</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button onClick={() => handleExport('csv')} className="btn btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button onClick={() => handleExport('excel')} className="btn btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Lead Generation Controls */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Generate New Leads</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="input"
            >
              <option value="">All Sectors</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="input"
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerateLeads}
              disabled={isGenerating}
              className="btn btn-primary w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Leads'}
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : leadData && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{leadData.total_contacts.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success-100 rounded-lg">
                  <Users className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{leadData.verified_contacts.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <Search className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Quality Score</p>
                  <p className="text-2xl font-bold text-gray-900">{leadData.quality_score}%</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary-100 rounded-lg">
                  <Phone className="h-5 w-5 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {leadData.by_region.length > 0 
                      ? Math.round(leadData.by_region.reduce((sum, region) => sum + region.response_rate, 0) / leadData.by_region.length)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sector & Regional Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Leads by Sector</h3>
                <div className="space-y-4">
                  {leadData.by_sector.map((sector, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{sector.sector}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${(sector.contact_count / leadData.total_contacts) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{sector.contact_count}</span>
                        <span className="text-xs text-gray-500">({sector.verification_rate}% verified)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Regional Performance</h3>
                <div className="space-y-4">
                  {leadData.by_region.map((region, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{region.region}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-success-600 h-2 rounded-full"
                            style={{ width: `${region.response_rate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{region.contact_count}</span>
                        <span className="text-xs text-gray-500">({region.response_rate}% response)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Leads */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Generated Leads</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Business</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Contact Person</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Phone</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Sector</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Quality</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadData.recent_leads.map((lead, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium text-gray-900">{lead.business_name}</td>
                        <td className="py-3 px-4 text-gray-600">{lead.contact_person}</td>
                        <td className="py-3 px-4 text-gray-600">{lead.email}</td>
                        <td className="py-3 px-4 text-gray-600">{lead.phone}</td>
                        <td className="py-3 px-4">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {lead.sector}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  lead.quality_score >= 80 ? 'bg-success-600' :
                                  lead.quality_score >= 60 ? 'bg-warning-600' : 'bg-error-600'
                                }`}
                                style={{ width: `${lead.quality_score}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{lead.quality_score}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            lead.verified ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
                          }`}>
                            {lead.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default LeadGeneration