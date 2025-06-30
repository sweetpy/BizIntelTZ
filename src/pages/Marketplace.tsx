import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Plus, Filter, DollarSign, ArrowLeft, Calendar, MapPin } from 'lucide-react'
import { getMarketplaceListings, createListing, getTransactions } from '../utils/api'
import { MarketplaceListing, MarketplaceCategory, Transaction } from '../types'
import toast from 'react-hot-toast'

const Marketplace: React.FC = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateListing, setShowCreateListing] = useState(false)
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    category: '',
    type: 'product',
    price: '',
    location: '',
    expiry_date: '',
    business_id: '',
    images: [] as string[]
  })

  const categories = ['all', 'products', 'services', 'equipment', 'real-estate', 'technology', 'materials']
  const types = ['all', 'product', 'service', 'promotion', 'b2b-offer']

  useEffect(() => {
    loadMarketplaceData()
  }, [selectedCategory, selectedType])

  const loadMarketplaceData = async () => {
    try {
      setIsLoading(true)
      const [listingsData, transactionsData] = await Promise.all([
        getMarketplaceListings(selectedCategory, selectedType),
        getTransactions()
      ])
      setListings(listingsData)
      setTransactions(transactionsData)
    } catch (error) {
      console.error('Error loading marketplace data:', error)
      toast.error('Failed to load marketplace data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createListing(newListing)
      toast.success('Listing created successfully!')
      setShowCreateListing(false)
      setNewListing({
        title: '',
        description: '',
        category: '',
        type: 'product',
        price: '',
        location: '',
        expiry_date: '',
        business_id: '',
        images: []
      })
      await loadMarketplaceData()
    } catch (error) {
      console.error('Error creating listing:', error)
      toast.error('Failed to create listing')
    }
  }

  const getListingTypeColor = (type: string) => {
    switch (type) {
      case 'product': return 'bg-blue-100 text-blue-800'
      case 'service': return 'bg-success-100 text-success-800'
      case 'promotion': return 'bg-warning-100 text-warning-800'
      case 'b2b-offer': return 'bg-secondary-100 text-secondary-800'
      default: return 'bg-gray-100 text-gray-800'
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
              <ShoppingBag className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Marketplace</h1>
              <p className="text-gray-600">Business promotions, B2B offers, and transactions</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateListing(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Listing</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Marketplace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Listings</p>
              <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-success-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Calendar className="h-5 w-5 text-warning-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => new Date(t.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <MapPin className="h-5 w-5 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Regions</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(listings.map(l => l.location)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-40 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="card hover:shadow-lg transition-shadow">
              {listing.images.length > 0 && (
                <div className="h-48 bg-gray-200 rounded-t-xl flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getListingTypeColor(listing.type)}`}>
                    {listing.type.replace('-', ' ')}
                  </span>
                  <span className="text-lg font-bold text-primary-600">
                    ${listing.price}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{listing.description}</p>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Expires: {listing.expiry_date}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">By {listing.business_name}</span>
                    <button className="btn btn-primary text-sm">
                      Contact Seller
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Transactions */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Item</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Buyer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Seller</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{transaction.item_title}</td>
                    <td className="py-3 px-4 text-gray-600">{transaction.buyer_name}</td>
                    <td className="py-3 px-4 text-gray-600">{transaction.seller_name}</td>
                    <td className="py-3 px-4 font-medium text-primary-600">${transaction.amount}</td>
                    <td className="py-3 px-4 text-gray-600">{transaction.created_at}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'completed' ? 'bg-success-100 text-success-800' :
                        transaction.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                        'bg-error-100 text-error-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Listing Modal */}
      {showCreateListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Create Marketplace Listing</h3>
            
            <form onSubmit={handleCreateListing} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  className="input"
                  placeholder="Listing title"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newListing.category}
                    onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newListing.type}
                    onChange={(e) => setNewListing({ ...newListing, type: e.target.value })}
                    className="input"
                    required
                  >
                    {types.slice(1).map((type) => (
                      <option key={type} value={type}>
                        {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  className="input h-24 resize-none"
                  placeholder="Describe your listing..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={newListing.price}
                    onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                    className="input"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    required
                    value={newListing.location}
                    onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                    className="input"
                    placeholder="City, Region"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={newListing.expiry_date}
                  onChange={(e) => setNewListing({ ...newListing, expiry_date: e.target.value })}
                  className="input"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateListing(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Marketplace