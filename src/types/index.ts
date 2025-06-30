export interface Business {
  id: string
  name: string
  bi_id: string  // Business Intelligence ID for verification
  region?: string
  sector?: string
  digital_score?: number
  formality?: string
  premium: boolean
  verified: boolean  // Whether the business is verified through claims
  claimed: boolean   // Whether the business has been claimed
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
  verified_businesses: number
  total_businesses: number
}

export interface SearchFilters {
  q?: string
  region?: string
  sector?: string
  min_score?: number
  premium?: boolean
  bi_id?: string
  verified?: boolean
}

export interface User {
  username: string
  token: string
}

export interface BIVerificationResult {
  valid: boolean
  business?: Business
  verification_date: string
  status?: string
  message?: string
}

export interface BIVerificationRequest {
  bi_id: string
  requester_name: string
  requester_contact: string
  purpose: string
}