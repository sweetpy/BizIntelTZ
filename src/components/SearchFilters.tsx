import React from 'react'
import { Search, Filter, X, Shield } from 'lucide-react'
import { SearchFilters as SearchFiltersType } from '../types'

interface SearchFiltersProps {
  filters: SearchFiltersType
  onFiltersChange: (filters: SearchFiltersType) => void
  onClearFilters: () => void
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange, onClearFilters }) => {
  const regions = [
    'Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Morogoro', 
    'Tanga', 'Kahama', 'Tabora', 'Kigoma', 'Sumbawanga', 'Kasulu'
  ]

  const sectors = [
    'Agriculture', 'Manufacturing', 'Services', 'Trade', 'Technology', 
    'Healthcare', 'Education', 'Tourism', 'Mining', 'Finance', 'Transport'
  ]

  const handleInputChange = (field: keyof SearchFiltersType, value: string | number | boolean) => {
    onFiltersChange({ ...filters, [field]: value || undefined })
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search Query */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Business Name
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Enter business name..."
              value={filters.q || ''}
              onChange={(e) => handleInputChange('q', e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* BI ID Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            BI ID Search
          </label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="BIZ-TZ-YYYYMMDD-XXXX"
              value={filters.bi_id || ''}
              onChange={(e) => handleInputChange('bi_id', e.target.value)}
              className="input pl-10 font-mono text-sm"
            />
          </div>
        </div>

        {/* Region Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region
          </label>
          <select
            value={filters.region || ''}
            onChange={(e) => handleInputChange('region', e.target.value)}
            className="input"
          >
            <option value="">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* Sector Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sector
          </label>
          <select
            value={filters.sector || ''}
            onChange={(e) => handleInputChange('sector', e.target.value)}
            className="input"
          >
            <option value="">All Sectors</option>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        {/* Minimum Digital Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Digital Score
          </label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="0-100"
            value={filters.min_score || ''}
            onChange={(e) => handleInputChange('min_score', parseInt(e.target.value))}
            className="input"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-6 pt-7">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.premium || false}
              onChange={(e) => handleInputChange('premium', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Premium Only</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.verified || false}
              onChange={(e) => handleInputChange('verified', e.target.checked)}
              className="rounded border-gray-300 text-success-600 focus:ring-success-500"
            />
            <span className="text-sm font-medium text-gray-700">Verified Only</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default SearchFilters
