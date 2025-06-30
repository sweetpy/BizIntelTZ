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
  Integration,
  AdaptiveInsights,
  PersonalizedTip,
  RankingSettings,
  ForumPost,
  CommunityTag,
  MarketplaceListing,
  Transaction,
  SEOPage,
  TrafficStats,
  MarketingContent,
  ContentSuggestion,
  VisualAsset,
  Course,
  Webinar,
  Certification,
  LeaderboardData,
  MarketShareData,
  CompetitorComparison,
  BuzzMeterData,
  VisibilityHeatmap,
  CompetitiveAlert
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

// Rankings & Leaderboard APIs
export const getLeaderboardData = async (region?: string, sector?: string): Promise<LeaderboardData> => {
  const response = await api.get('/rankings/leaderboard', { params: { region, sector } })
  return response.data
}

export const getMarketShareData = async (sector: string, region?: string): Promise<MarketShareData> => {
  const response = await api.get('/rankings/market-share', { params: { sector, region } })
  return response.data
}

export const compareBusiness = async (businessIdA: string, businessIdB: string): Promise<CompetitorComparison> => {
  const response = await api.get('/rankings/compare', { params: { business_a: businessIdA, business_b: businessIdB } })
  return response.data
}

export const getBuzzMeterData = async (businessId: string): Promise<BuzzMeterData> => {
  const response = await api.get(`/rankings/buzz/${businessId}`)
  return response.data
}

export const getVisibilityHeatmap = async (region: string): Promise<VisibilityHeatmap> => {
  const response = await api.get('/rankings/heatmap', { params: { region } })
  return response.data
}

export const getCompetitiveAlerts = async (businessId: string): Promise<CompetitiveAlert[]> => {
  const response = await api.get('/rankings/alerts', { params: { business_id: businessId } })
  return response.data
}

export const subscribeToAlerts = async (businessId: string, alertTypes: string[]): Promise<void> => {
  await api.post('/rankings/alerts/subscribe', { business_id: businessId, alert_types: alertTypes })
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

export const updateUserRole = async (userId: string, roleId: string): Promise<void> => {
  await api.put(`/users/${userId}/role`, { role_id: roleId })
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

// Adaptive AI APIs
export const getAdaptiveInsights = async (): Promise<AdaptiveInsights> => {
  const response = await api.get('/adaptive-ai/insights')
  return response.data
}

export const getPersonalizedTips = async (): Promise<PersonalizedTip[]> => {
  const response = await api.get('/adaptive-ai/tips')
  return response.data
}

export const updateRankingSettings = async (settings: RankingSettings): Promise<void> => {
  await api.post('/adaptive-ai/settings', settings)
}

// Community Forum APIs
export const getForumPosts = async (category?: string): Promise<ForumPost[]> => {
  const response = await api.get('/forum/posts', { params: { category } })
  return response.data
}

export const getCommunityTags = async (): Promise<CommunityTag[]> => {
  const response = await api.get('/forum/tags')
  return response.data
}

export const createPost = async (post: any): Promise<void> => {
  await api.post('/forum/posts', post)
}

export const voteOnPost = async (postId: string, voteType: 'up' | 'down'): Promise<void> => {
  await api.post(`/forum/posts/${postId}/vote`, { type: voteType })
}

export const joinCommunity = async (tagName: string): Promise<void> => {
  await api.post(`/forum/communities/${tagName}/join`)
}

// Marketplace APIs
export const getMarketplaceListings = async (category?: string, type?: string): Promise<MarketplaceListing[]> => {
  const response = await api.get('/marketplace/listings', { params: { category, type } })
  return response.data
}

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get('/marketplace/transactions')
  return response.data
}

export const createListing = async (listing: any): Promise<void> => {
  await api.post('/marketplace/listings', listing)
}

// SEO Content Engine APIs
export const getSEOPages = async (): Promise<SEOPage[]> => {
  const response = await api.get('/seo/pages')
  return response.data
}

export const getTrafficStats = async (): Promise<TrafficStats> => {
  const response = await api.get('/seo/traffic')
  return response.data
}

export const generateSEOContent = async (region: string, businessType: string): Promise<void> => {
  await api.post('/seo/generate', { region, business_type: businessType })
}

export const createSEOPage = async (page: any): Promise<void> => {
  await api.post('/seo/pages', page)
}

// AI Marketing Assistant APIs
export const getMarketingContent = async (): Promise<MarketingContent[]> => {
  const response = await api.get('/marketing/content')
  return response.data
}

export const generateDescription = async (businessId: string): Promise<{ suggestions: ContentSuggestion[] }> => {
  const response = await api.post('/marketing/generate/description', { business_id: businessId })
  return response.data
}

export const generateVisuals = async (businessId: string): Promise<{ assets: VisualAsset[] }> => {
  const response = await api.post('/marketing/generate/visuals', { business_id: businessId })
  return response.data
}

export const optimizeContent = async (businessId: string, contentType: string): Promise<{ suggestions: ContentSuggestion[] }> => {
  const response = await api.post('/marketing/optimize', { business_id: businessId, content_type: contentType })
  return response.data
}

// Skill Building APIs
export const getCourses = async (category?: string): Promise<Course[]> => {
  const response = await api.get('/learning/courses', { params: { category } })
  return response.data
}

export const getWebinars = async (): Promise<Webinar[]> => {
  const response = await api.get('/learning/webinars')
  return response.data
}

export const getCertifications = async (): Promise<Certification[]> => {
  const response = await api.get('/learning/certifications')
  return response.data
}

export const enrollInCourse = async (courseId: string): Promise<void> => {
  await api.post(`/learning/courses/${courseId}/enroll`)
}
