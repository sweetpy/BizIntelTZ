export interface Business {
  id: string
  name: string
  region?: string
  sector?: string
  digital_score?: number
  formality?: string
  premium: boolean
}

export interface BusinessCreate {
  name: string
  region?: string
  sector?: string
  digital_score?: number
  formality?: string
  premium?: boolean
}

export interface BusinessUpdate {
  name?: string
  region?: string
  sector?: string
  digital_score?: number
  formality?: string
  premium?: boolean
}

export interface Review {
  business_id: string
  rating: number
  comment?: string
}

export interface Claim {
  business_id: string
  owner_name: string
  contact: string
  approved: boolean
}

export interface AnalyticsEvent {
  business_id: string
  action: 'view' | 'click'
}

export interface Lead {
  business_id: string
  name: string
  message: string
}

export interface AnalyticsData {
  views: number
  clicks: number
}

export interface AdminStats {
  status: string
  total_claims: number
  pending_claims: number
  leads: number
}

export interface SearchFilters {
  q?: string
  region?: string
  sector?: string
  min_score?: number
  premium?: boolean
}

export interface User {
  username: string
  token: string
}