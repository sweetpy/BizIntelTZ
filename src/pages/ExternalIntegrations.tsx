import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Settings, Plus, Edit3, Trash2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { getIntegrations, createIntegration, updateIntegration, deleteIntegration, testIntegration } from '../utils/api'
import { Integration } from '../types'
import toast from 'react-hot-toast'

const ExternalIntegrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null)
  const [testingIntegration, setTestingIntegration] = useState<string | null>(null)
  const [newIntegration, setNewIntegration] = useState<Integration>({
    id: '',
    name: '',
    type: 'webhook',
    endpoint: '',
    api_key: '',
    active: true,
    events: [],
    headers: {},
    description: ''
  })

  const integrationTypes = [
    { value: 'webhook', label: 'Webhook' },
    { value: 'crm', label: 'CRM Integration' },
    { value: 'erp', label: 'ERP System' },
    { value: 'email', label: 'Email Service' },
    { value: 'analytics', label: 'Analytics Platform' }
  ]

  const availableEvents = [
    'business_created', 'business_updated', 'business_claimed',
    'review_posted', 'lead_generated', 'claim_approved',
    'score_updated', 'alert_triggered'
  ]

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = async () => {
    try {
      setIsLoading(true)
      const data = await getIntegrations()
      setIntegrations(data)
    } catch (error) {
      console.error('Error loading integrations:', error)
      toast.error('Failed to load integrations')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateIntegration = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createIntegration(newIntegration)
      toast.success('Integration created successfully!')
      setShowCreateForm(false)
      setNewIntegration({
        id: '',
        name: '',
        type: 'webhook',
        endpoint: '',
        api_key: '',
        active: true,
        events: [],
        headers: {},
        description: ''
      })
      await loadIntegrations()
    } catch (error) {
      console.error('Error creating integration:', error)
      toast.error('Failed to create integration')
    }
  }

  const handleUpdateIntegration = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingIntegration) return
    
    try {
      await updateIntegration(editingIntegration.id, editingIntegration)
      toast.success('Integration updated successfully!')
      setEditingIntegration(null)
      await loadIntegrations()
    } catch (error) {
      console.error('Error updating integration:', error)
      toast.error('Failed to update integration')
    }
  }

  const handleDeleteIntegration = async (integrationId: string) => {
    if (confirm('Are you sure you want to delete this integration?')) {
      try {
        await deleteIntegration(integrationId)
        toast.success('Integration deleted successfully!')
        await loadIntegrations()
      } catch (error) {
        console.error('Error deleting integration:', error)
        toast.error('Failed to delete integration')
      }
    }
  }

  const handleTestIntegration = async (integrationId: string) => {
    try {
      setTestingIntegration(integrationId)
      const result = await testIntegration(integrationId)
      if (result.success) {
        toast.success('Integration test successful!')
      } else {
        toast.error(`Test failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Error testing integration:', error)
      toast.error('Failed to test integration')
    } finally {
      setTestingIntegration(null)
    }
  }

  const toggleEvent = (event: string, target: 'new' | 'edit') => {
    if (target === 'new') {
      const events = newIntegration.events.includes(event)
        ? newIntegration.events.filter(e => e !== event)
        : [...newIntegration.events, event]
      setNewIntegration({ ...newIntegration, events })
    } else if (editingIntegration) {
      const events = editingIntegration.events.includes(event)
        ? editingIntegration.events.filter(e => e !== event)
        : [...editingIntegration.events, event]
      setEditingIntegration({ ...editingIntegration, events })
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
              <Zap className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">External Integrations</h1>
              <p className="text-gray-600">API connections, webhooks, and CRM/ERP sync</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Integration</span>
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Integration List */}
          <div className="space-y-6">
            {integrations.map((integration) => (
              <div key={integration.id} className="card">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {integration.type}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          integration.active 
                            ? 'bg-success-100 text-success-800' 
                            : 'bg-error-100 text-error-800'
                        }`}>
                          {integration.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Endpoint:</span>
                          <span className="ml-2 font-mono text-gray-800">{integration.endpoint}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Events:</span>
                          <span className="ml-2">{integration.events.length} configured</span>
                        </div>
                      </div>
                      
                      {integration.events.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-2">
                            {integration.events.map((event) => (
                              <span key={event} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {event}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-4">
                        <div className="flex items-center space-x-1">
                          {integration.last_success ? (
                            <CheckCircle className="h-4 w-4 text-success-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-error-600" />
                          )}
                          <span className="text-xs text-gray-500">
                            Last: {integration.last_success || 'Never'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          Calls: {integration.total_calls || 0}
                        </span>
                        <span className="text-xs text-gray-500">
                          Success Rate: {integration.success_rate || 0}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTestIntegration(integration.id)}
                        disabled={testingIntegration === integration.id}
                        className="btn btn-secondary text-sm"
                      >
                        {testingIntegration === integration.id ? 'Testing...' : 'Test'}
                      </button>
                      <button
                        onClick={() => setEditingIntegration(integration)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteIntegration(integration.id)}
                        className="text-error-600 hover:text-error-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {integrations.length === 0 && (
            <div className="text-center py-16">
              <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Integrations Yet</h3>
              <p className="text-gray-600 mb-8">
                Connect external systems to sync data and automate workflows.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn btn-primary"
              >
                Create First Integration
              </button>
            </div>
          )}
        </>
      )}

      {/* Create Integration Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Create Integration</h3>
            
            <form onSubmit={handleCreateIntegration} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={newIntegration.name}
                    onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                    className="input"
                    placeholder="Integration name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newIntegration.type}
                    onChange={(e) => setNewIntegration({ ...newIntegration, type: e.target.value as any })}
                    className="input"
                  >
                    {integrationTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newIntegration.description}
                  onChange={(e) => setNewIntegration({ ...newIntegration, description: e.target.value })}
                  className="input h-20 resize-none"
                  placeholder="Integration description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Endpoint URL</label>
                <input
                  type="url"
                  required
                  value={newIntegration.endpoint}
                  onChange={(e) => setNewIntegration({ ...newIntegration, endpoint: e.target.value })}
                  className="input"
                  placeholder="https://api.example.com/webhook"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key (Optional)</label>
                <input
                  type="password"
                  value={newIntegration.api_key}
                  onChange={(e) => setNewIntegration({ ...newIntegration, api_key: e.target.value })}
                  className="input"
                  placeholder="API key or token"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Event Triggers</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableEvents.map((event) => (
                    <label key={event} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newIntegration.events.includes(event)}
                        onChange={() => toggleEvent(event, 'new')}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{event.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={newIntegration.active}
                  onChange={(e) => setNewIntegration({ ...newIntegration, active: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">
                  Active Integration
                </label>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Integration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Integration Modal */}
      {editingIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Edit Integration</h3>
            
            <form onSubmit={handleUpdateIntegration} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={editingIntegration.name}
                    onChange={(e) => setEditingIntegration({ ...editingIntegration, name: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={editingIntegration.type}
                    onChange={(e) => setEditingIntegration({ ...editingIntegration, type: e.target.value as any })}
                    className="input"
                  >
                    {integrationTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editingIntegration.description}
                  onChange={(e) => setEditingIntegration({ ...editingIntegration, description: e.target.value })}
                  className="input h-20 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Endpoint URL</label>
                <input
                  type="url"
                  required
                  value={editingIntegration.endpoint}
                  onChange={(e) => setEditingIntegration({ ...editingIntegration, endpoint: e.target.value })}
                  className="input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input
                  type="password"
                  value={editingIntegration.api_key}
                  onChange={(e) => setEditingIntegration({ ...editingIntegration, api_key: e.target.value })}
                  className="input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Event Triggers</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableEvents.map((event) => (
                    <label key={event} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingIntegration.events.includes(event)}
                        onChange={() => toggleEvent(event, 'edit')}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{event.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="editActive"
                  checked={editingIntegration.active}
                  onChange={(e) => setEditingIntegration({ ...editingIntegration, active: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="editActive" className="text-sm font-medium text-gray-700">
                  Active Integration
                </label>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingIntegration(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Integration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExternalIntegrations
