import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Image, FileText, ArrowLeft, Download, Wand2, Camera } from 'lucide-react'
import { getMarketingContent, generateDescription, generateVisuals, optimizeContent } from '../utils/api'
import { MarketingContent, ContentSuggestion, VisualAsset } from '../types'
import toast from 'react-hot-toast'

const AIMarketingAssistant: React.FC = () => {
  const [marketingContent, setMarketingContent] = useState<MarketingContent[]>([])
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([])
  const [visualAssets, setVisualAssets] = useState<VisualAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState<string>('')
  const [contentType, setContentType] = useState<string>('description')

  useEffect(() => {
    loadMarketingData()
  }, [])

  const loadMarketingData = async () => {
    try {
      setIsLoading(true)
      const data = await getMarketingContent()
      setMarketingContent(data)
    } catch (error) {
      console.error('Error loading marketing data:', error)
      toast.error('Failed to load marketing data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateContent = async () => {
    if (!selectedBusiness) {
      toast.error('Please select a business first')
      return
    }

    try {
      setIsGenerating(true)
      
      if (contentType === 'description') {
        const result = await generateDescription(selectedBusiness)
        setSuggestions(result.suggestions)
      } else if (contentType === 'visuals') {
        const result = await generateVisuals(selectedBusiness)
        setVisualAssets(result.assets)
      } else {
        const result = await optimizeContent(selectedBusiness, contentType)
        setSuggestions(result.suggestions)
      }
      
      toast.success('Content generated successfully!')
    } catch (error) {
      console.error('Error generating content:', error)
      toast.error('Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadAsset = (asset: VisualAsset) => {
    // Create download link for visual asset
    const link = document.createElement('a')
    link.href = asset.url
    link.download = asset.filename
    link.click()
    toast.success('Asset downloaded!')
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'description': return FileText
      case 'visuals': return Image
      case 'social': return Sparkles
      case 'ads': return Wand2
      default: return FileText
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
              <Sparkles className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Marketing Assistant</h1>
              <p className="text-gray-600">Auto-generated descriptions, visuals, and marketing content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Generation Tool */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Content Generator</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Business</label>
            <select
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
              className="input"
            >
              <option value="">Choose business...</option>
              {marketingContent.map((content) => (
                <option key={content.business_id} value={content.business_id}>
                  {content.business_name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="input"
            >
              <option value="description">Business Description</option>
              <option value="visuals">Visual Assets</option>
              <option value="social">Social Media Posts</option>
              <option value="ads">Advertisement Copy</option>
              <option value="seo">SEO Content</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleGenerateContent}
              disabled={isGenerating || !selectedBusiness}
              className="btn btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Wand2 className={`h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
              <span>{isGenerating ? 'Generating...' : 'Generate Content'}</span>
            </button>
          </div>
        </div>

        {/* Content Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { type: 'description', label: 'Business Descriptions', description: 'AI-generated compelling business descriptions' },
            { type: 'visuals', label: 'Visual Assets', description: 'Auto-generated logos, banners, and graphics' },
            { type: 'social', label: 'Social Media', description: 'Engaging posts for social platforms' },
            { type: 'ads', label: 'Advertisement Copy', description: 'Persuasive ad copy and headlines' }
          ].map((item) => {
            const IconComponent = getContentTypeIcon(item.type)
            return (
              <button
                key={item.type}
                onClick={() => setContentType(item.type)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  contentType === item.type
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <IconComponent className={`h-6 w-6 mb-2 ${
                  contentType === item.type ? 'text-primary-600' : 'text-gray-600'
                }`} />
                <h4 className="font-semibold text-gray-900">{item.label}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Generated Content Suggestions */}
      {suggestions.length > 0 && (
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">AI-Generated Suggestions</h3>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                        {suggestion.type}
                      </span>
                      <span className="text-xs bg-success-100 text-success-800 px-2 py-1 rounded-full">
                        {suggestion.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{suggestion.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {suggestion.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(suggestion.content)
                        toast.success('Content copied to clipboard!')
                      }}
                      className="btn btn-secondary text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generated Visual Assets */}
      {visualAssets.length > 0 && (
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">AI-Generated Visual Assets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visualAssets.map((asset, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    {asset.type === 'image' ? (
                      <img 
                        src={asset.url} 
                        alt={asset.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{asset.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{asset.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {asset.type}
                      </span>
                      <button
                        onClick={() => handleDownloadAsset(asset)}
                        className="btn btn-primary text-sm flex items-center space-x-1"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Marketing Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Performance</h3>
            <div className="space-y-4">
              {marketingContent.slice(0, 5).map((content) => (
                <div key={content.business_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{content.business_name}</h4>
                    <p className="text-sm text-gray-600">{content.content_type} • {content.generated_at}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">{content.performance_score}%</p>
                    <p className="text-xs text-gray-600">Performance</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Recommendations</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
                <h4 className="font-semibold text-primary-900 mb-2">Content Optimization</h4>
                <p className="text-sm text-primary-800 mb-3">
                  Your business descriptions could benefit from more emotional language and specific benefits.
                </p>
                <button className="btn btn-primary text-sm">Apply Suggestions</button>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-success-50 to-success-100 rounded-lg">
                <h4 className="font-semibold text-success-900 mb-2">Visual Consistency</h4>
                <p className="text-sm text-success-800 mb-3">
                  Consider using consistent brand colors across all your generated visuals.
                </p>
                <button className="btn btn-success text-sm">Update Branding</button>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-warning-50 to-warning-100 rounded-lg">
                <h4 className="font-semibold text-warning-900 mb-2">Social Media Strategy</h4>
                <p className="text-sm text-warning-800 mb-3">
                  Generate more engaging content for social media to increase interaction rates.
                </p>
                <button className="btn btn-warning text-sm">Generate Posts</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIMarketingAssistant