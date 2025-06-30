import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download, AlertCircle } from 'lucide-react'
import { searchBusinesses, exportBusinesses } from '../utils/api'
import { Business, SearchFilters as SearchFiltersType } from '../types'
import SearchFilters from '../components/SearchFilters'
import BusinessCard from '../components/BusinessCard'
import toast from 'react-hot-toast'

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [filters, setFilters] = useState<SearchFiltersType>({
    q: searchParams.get('q') || '',
    region: searchParams.get('region') || '',
    sector: searchParams.get('sector') || '',
    min_score: searchParams.get('min_score') ? parseInt(searchParams.get('min_score')!) : undefined,
    premium: searchParams.get('premium') === 'true' || undefined,
  })

  useEffect(() => {
    performSearch()
  }, [filters])

  const performSearch = async () => {
    try {
      setIsLoading(true)
      const results = await searchBusinesses(filters)
      setBusinesses(results)
      
      // Update URL params
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== false) {
          params.set(key, value.toString())
        }
      })
      setSearchParams(params)
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search businesses')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({})
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const blob = await exportBusinesses()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `businesses-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast.success('Export completed successfully!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Business Search</h1>
            <p className="text-gray-600 mt-2">
              Discover and explore businesses across Tanzania
            </p>
          </div>
          
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      <SearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results
            </h2>
            <p className="text-gray-600">
              {isLoading ? 'Searching...' : `${businesses.length} businesses found`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or clearing filters to see more results.
            </p>
            <button
              onClick={handleClearFilters}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search