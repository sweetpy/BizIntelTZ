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
  AdminStats,
  BIVerificationResult,
  BIVerificationRequest,
  MarketMappingData,
  CreditworthinessData,
  CreditReport,
  DistributionData,
  LeadGenerationData,
  InformalEconomyData,
  BusinessChangeData,
  CompetitiveIntelligenceData,
  DashboardData,
  Alert,
  DataQualityMetrics,
  FeedbackData,
  Survey,
  Role,
  UserAccount,
  PredictiveAnalyticsData,
  Integration
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

// BI ID Verification APIs
export const verifyBIID = async (biId: string): Promise<BIVerificationResult> => {
  const response = await api.get(`/verify-bi/${biId}`)
  return response.data
}

export const requestBIVerification = async (request: BIVerificationRequest): Promise<any> => {
  const response = await api.post('/request-verification', request)
  return response.data
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

// Market Mapping APIs
export const getMarketMapping = async (region?: string, sector?: string): Promise<MarketMappingData> => {
  const response = await api.get('/market-mapping', { params: { region, sector } })
  return response.data
}

export const exportMarketData = async (region?: string, sector?: string): Promise<Blob> => {
  const response = await api.get('/market-mapping/export', { 
    params: { region, sector },
    responseType: 'blob' 
  })
  return response.data
}

// Creditworthiness APIs
export const getCreditworthinessData = async (): Promise<CreditworthinessData> => {
  const response = await api.get('/creditworthiness')
  return response.data
}

export const getCreditReport = async (businessId: string): Promise<CreditReport> => {
  const response = await api.get(`/creditworthiness/report/${businessId}`)
  return response.data
}

// Distribution & Heatmap APIs
export const getDistributionData = async (metric: string, sector?: string): Promise<DistributionData> => {
  const response = await api.get('/distribution', { params: { metric, sector } })
  return response.data
}

export const getRetailDensity = async (region?: string): Promise<any> => {
  const response = await api.get('/distribution/retail-density', { params: { region } })
  return response.data
}

// Lead Generation APIs
export const getLeadGenerationData = async (): Promise<LeadGenerationData> => {
  const response = await api.get('/lead-generation')
  return response.data
}

export const generateLeads = async (criteria: any): Promise<any> => {
  const response = await api.post('/lead-generation/generate', criteria)
  return response.data
}

export const exportLeads = async (format: string): Promise<Blob> => {
  const response = await api.get(`/lead-generation/export`, { 
    params: { format },
    responseType: 'blob' 
  })
  return response.data
}

// Informal Economy APIs
export const getInformalEconomyData = async (): Promise<InformalEconomyData> => {
  const response = await api.get('/informal-economy')
  return response.data
}

export const exportInformalEconomyReport = async (): Promise<Blob> => {
  const response = await api.get('/informal-economy/export', { responseType: 'blob' })
  return response.data
}

// Business Change Monitoring APIs
export const getBusinessChanges = async (): Promise<BusinessChangeData> => {
  const response = await api.get('/business-changes')
  return response.data
}

export const subscribeToChanges = async (businessId: string): Promise<any> => {
  const response = await api.post(`/business-changes/subscribe/${businessId}`)
  return response.data
}

// Competitive Intelligence APIs
export const getCompetitiveIntelligence = async (sector?: string): Promise<CompetitiveIntelligenceData> => {
  const response = await api.get('/competitive-intelligence', { params: { sector } })
  return response.data
}

export const exportCompetitiveReport = async (sector: string): Promise<Blob> => {
  const response = await api.get(`/competitive-intelligence/export`, { 
    params: { sector },
    responseType: 'blob' 
  })
  return response.data
}

// Dashboard APIs
export const getDashboardData = async (type: string, businessId?: string): Promise<DashboardData> => {
  const response = await api.get('/dashboard', { params: { type, business_id: businessId } })
  return response.data
}

// Alert System APIs
export const getAlerts = async (): Promise<Alert[]> => {
  const response = await api.get('/alerts')
  return response.data
}

export const markAlertAsRead = async (alertId: string): Promise<void> => {
  await api.post(`/alerts/${alertId}/read`)
}

export const dismissAlert = async (alertId: string): Promise<void> => {
  await api.delete(`/alerts/${alertId}`)
}

// Data Quality APIs
export const getDataQualityMetrics = async (): Promise<DataQualityMetrics> => {
  const response = await api.get('/data-quality')
  return response.data
}

export const runDataQualityCheck = async (): Promise<void> => {
  await api.post('/data-quality/check')
}

// Feedback & Survey APIs
export const getFeedbackData = async (): Promise<FeedbackData> => {
  const response = await api.get('/feedback')
  return response.data
}

export const createSurvey = async (survey: Survey): Promise<void> => {
  await api.post('/surveys', survey)
}

export const exportFeedbackData = async (): Promise<Blob> => {
  const response = await api.get('/feedback/export', { responseType: 'blob' })
  return response.data
}

// Role Management APIs
export const getRoles = async (): Promise<Role[]> => {
  const response = await api.get('/roles')
  return response.data
}

export const getUsers = async (): Promise<UserAccount[]> => {
  const response = await api.get('/users')
  return response.data
}

export const createRole = async (role: Role): Promise<void> => {
  await api.post('/roles', role)
}

export const updateRole = async (roleId: string, role: Role): Promise<void> => {
  await api.put(`/roles/${roleId}`, role)
}

export const deleteRole = async (roleId: string): Promise<void> => {
  await api.delete(`/roles/${roleId}`)
}

export const updateUserRole = async (userId: string, roleI: string): Promise<void> => {
  await api.put(`/users/${userId}/role`, { role_id: roleI })
}

// Predictive Analytics APIs
export const getPredictiveAnalytics = async (): Promise<PredictiveAnalyticsData> => {
  const response = await api.get('/predictive-analytics')
  return response.data
}

export const generatePredictions = async (model: string): Promise<void> => {
  await api.post('/predictive-analytics/generate', { model })
}

export const exportPredictions = async (model: string): Promise<Blob> => {
  const response = await api.get('/predictive-analytics/export', { 
    params: { model },
    responseType: 'blob' 
  })
  return response.data
}

// External Integration APIs
export const getIntegrations = async (): Promise<Integration[]> => {
  const response = await api.get('/integrations')
  return response.data
}

export const createIntegration = async (integration: Integration): Promise<void> => {
  await api.post('/integrations', integration)
}

export const updateIntegration = async (integrationId: string, integration: Integration): Promise<void> => {
  await api.put(`/integrations/${integrationId}`, integration)
}

export const deleteIntegration = async (integrationId: string): Promise<void> => {
  await api.delete(`/integrations/${integrationId}`)
}

export const testIntegration = async (integrationId: string): Promise<{ success: boolean; error?: string }> => {
  const response = await api.post(`/integrations/${integrationId}/test`)
  return response.data
}