import React from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Globe,
  Download,
  FileText,
  Star,
  Crown,
  Shield,
  BarChart3,
  Upload,
  Mail,
  Lock,
  Pencil
} from 'lucide-react'

interface Feature {
  title: string
  description: string
  icon: React.FC<any>
  link: string
}

const features: Feature[] = [
  {
    title: 'Advanced Search & Filtering',
    description: 'Find businesses quickly using multiple filters.',
    icon: Search,
    link: '/search'
  },
  {
    title: 'Region-wide Scraping',
    description: 'Generate sample data across Tanzania.',
    icon: Globe,
    link: '/admin'
  },
  {
    title: 'CSV Data Export',
    description: 'Download business data as CSV files.',
    icon: Download,
    link: '/search'
  },
  {
    title: 'Public Business Profiles',
    description: 'Detailed profiles with reviews and media.',
    icon: FileText,
    link: '/search'
  },
  {
    title: 'Reviews & Ratings',
    description: 'Share feedback on businesses you use.',
    icon: Star,
    link: '/search'
  },
  {
    title: 'Premium Listings',
    description: 'Highlight top businesses for more visibility.',
    icon: Crown,
    link: '/admin'
  },
  {
    title: 'Business Claiming',
    description: 'Owners can claim and manage listings.',
    icon: Shield,
    link: '/search'
  },
  {
    title: 'Analytics Tracking',
    description: 'Monitor views and clicks for each business.',
    icon: BarChart3,
    link: '/admin/analytics'
  },
  {
    title: 'Media Uploads',
    description: 'Add images or videos to business profiles.',
    icon: Upload,
    link: '/search'
  },
  {
    title: 'Lead Generation',
    description: 'Send inquiries directly to businesses.',
    icon: Mail,
    link: '/search'
  },
  {
    title: 'Website Crawling',
    description: 'Crawl websites to discover more businesses.',
    icon: Globe,
    link: '/admin/crawler'
  },
  {
    title: 'Authentication',
    description: 'Secure access for administrators.',
    icon: Lock,
    link: '/login'
  },
  {
    title: 'Manage Businesses',
    description: 'Create, edit or remove business listings.',
    icon: Pencil,
    link: '/admin'
  }
]

const Features: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <div className="text-center space-y-3">
      <h1 className="text-3xl font-bold text-gray-900">Platform Features</h1>
      <p className="text-gray-600">Explore everything BizIntelTZ offers.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feat, idx) => (
        <Link
          key={idx}
          to={feat.link}
          className="card p-6 flex items-start space-x-4 hover:shadow-md transition"
        >
          <feat.icon className="h-8 w-8 text-primary-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{feat.title}</h3>
            <p className="text-sm text-gray-600">{feat.description}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
)

export default Features
