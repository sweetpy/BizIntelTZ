import axios from 'axios'
import { 
  Business, 
  BusinessCreate, 
  BusinessUpdate, 
  Review, 
  Claim, 
  AnalyticsEvent, 
  Lead, 
  SearchFilters,
  AnalyticsData,
  AdminStats
} from '../types'

const api = axios.create({
  baseURL: '/api',
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user')
  if (user) {
    const { token } = JSON.parse(user)
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Business APIs
export const searchBusinesses = async (filters: SearchFilters): Promise<Business[]> => {
  const response = await api.get('/search', { params: filters })
  return response.data
}

export const createBusiness = async (business: BusinessCreate): Promise<Business> => {
  const response = await api.post('/business', business)
  return response.data
}

export const updateBusiness = async (id: string, business: BusinessUpdate): Promise<Business> => {
  const response = await api.put(`/business/${id}`, business)
  return response.data
}

export const deleteBusiness = async (id: string): Promise<void> => {
  await api.delete(`/business/${id}`)
}

export const getBusinessProfile = async (id: string): Promise<Business> => {
  const response = await api.get(`/profile/${id}`)
  return response.data
}

export const featureBusiness = async (id: string): Promise<void> => {
  await api.post(`/admin/feature?biz_id=${id}`)
}

// Scraping
export const scrapeBusinesses = async (source: string, region?: string): Promise<{ status: string; added: number }> => {
  const formData = new FormData()
  formData.append('source', source)
  if (region) formData.append('region', region)
  
  const response = await api.post('/scrape', formData)
  return response.data
}

// Export
export const exportBusinesses = async (): Promise<Blob> => {
  const response = await api.get('/export', { responseType: 'blob' })
  return response.data
}

// Reviews
export const postReview = async (review: Review): Promise<void> => {
  await api.post('/review', review)
}

export const getReviews = async (businessId: string): Promise<Review[]> => {
  const response = await api.get(`/reviews/${businessId}`)
  return response.data
}

// Claims
export const claimBusiness = async (claim: Claim): Promise<void> => {
  await api.post('/claim', claim)
}

export const getClaims = async (): Promise<Claim[]> => {
  const response = await api.get('/claims')
  return response.data
}

export const approveClaim = async (index: number): Promise<void> => {
  await api.post(`/claims/approve/${index}`)
}

// Analytics
export const trackEvent = async (event: AnalyticsEvent): Promise<void> => {
  await api.post('/track', event)
}

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await api.get('/analytics')
  return response.data
}

// Media
export const uploadMedia = async (businessId: string, file: File): Promise<{ status: string; filename: string }> => {
  const formData = new FormData()
  formData.append('biz_id', businessId)
  formData.append('file', file)
  
  const response = await api.post('/upload-media', formData)
  return response.data
}

export const getMedia = async (businessId: string): Promise<string[]> => {
  const response = await api.get(`/media/${businessId}`)
  return response.data
}

// Leads
export const createLead = async (lead: Lead): Promise<void> => {
  await api.post('/lead', lead)
}

export const getLeads = async (): Promise<Lead[]> => {
  const response = await api.get('/leads')
  return response.data
}

// Admin
export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await api.get('/admin')
  return response.data
}