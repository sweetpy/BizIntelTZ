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

// Market Mapping Types
export interface MarketMappingData {
  market_size: number
  penetration_rate: number
  growth_rate: number
  opportunity_score: number
  regional_breakdown: RegionalBreakdown[]
  sector_breakdown: SectorBreakdown[]
  opportunities: MarketOpportunity[]
}

export interface RegionalBreakdown {
  region: string
  percentage: number
  business_count: number
}

export interface SectorBreakdown {
  sector: string
  percentage: number
  business_count: number
}

export interface MarketOpportunity {
  title: string
  description: string
  priority: string
  estimated_value: number
}

// Creditworthiness Types
export interface CreditworthinessData {
  low_risk_count: number
  medium_risk_count: number
  high_risk_count: number
  average_score: number
  top_businesses: CreditworthyBusiness[]
  sector_risk: SectorRisk[]
  lending_recommendations: LendingRecommendation[]
}

export interface CreditworthyBusiness {
  id: string
  name: string
  sector: string
  region: string
  credit_score: number
}

export interface SectorRisk {
  sector: string
  risk_level: string
  risk_score: number
}

export interface LendingRecommendation {
  title: string
  description: string
  priority: string
  impact: string
}

export interface CreditReport {
  business_name: string
  bi_id: string
  credit_score: number
  factors: CreditFactor[]
  recommendation: string
  recommendation_reason: string
}

export interface CreditFactor {
  factor: string
  score: number
}

// Distribution & Heatmap Types
export interface DistributionData {
  total_regions: number
  average_density: number
  hotspot_count: number
  coverage_percentage: number
  regional_data: RegionalDistribution[]
  top_regions: RegionalDistribution[]
  opportunities: DistributionOpportunity[]
}

export interface RegionalDistribution {
  region: string
  business_count: number
  density: number
  intensity: number
}

export interface DistributionOpportunity {
  region: string
  description: string
  potential: number
  sector: string
}

export interface RetailDensity {
  region: string
  retail_count: number
  density_per_km: number
  market_saturation: number
}

// Lead Generation Types
export interface LeadGenerationData {
  total_contacts: number
  verified_contacts: number
  by_sector: SectorContact[]
  by_region: RegionalContact[]
  quality_score: number
  recent_leads: GeneratedLead[]
}

export interface SectorContact {
  sector: string
  contact_count: number
  verification_rate: number
}

export interface RegionalContact {
  region: string
  contact_count: number
  response_rate: number
}

export interface GeneratedLead {
  business_name: string
  contact_person: string
  email: string
  phone: string
  sector: string
  quality_score: number
  verified: boolean
}

// Informal Economy Types
export interface InformalEconomyData {
  formal_percentage: number
  informal_percentage: number
  semi_formal_percentage: number
  sector_formality: SectorFormality[]
  regional_formality: RegionalFormality[]
  trends: FormalityTrend[]
  insights: EconomyInsight[]
}

export interface SectorFormality {
  sector: string
  formal_count: number
  informal_count: number
  semi_formal_count: number
}

export interface RegionalFormality {
  region: string
  formality_index: number
  dominant_type: string
}

export interface FormalityTrend {
  month: string
  formal_growth: number
  informal_decline: number
}

export interface EconomyInsight {
  title: string
  description: string
  impact: string
  recommendation: string
}

// Real-time Monitoring Types
export interface BusinessChangeData {
  recent_changes: BusinessChange[]
  change_summary: ChangeSummary
  trending_changes: TrendingChange[]
  alerts: ChangeAlert[]
}

export interface BusinessChange {
  business_id: string
  business_name: string
  change_type: string
  old_value: string
  new_value: string
  timestamp: string
  significance: number
}

export interface ChangeSummary {
  total_changes: number
  significant_changes: number
  new_businesses: number
  updated_businesses: number
}

export interface TrendingChange {
  change_type: string
  frequency: number
  trend: string
}

export interface ChangeAlert {
  id: string
  type: string
  message: string
  severity: string
  business_id: string
  timestamp: string
}

// Competitive Intelligence Types
export interface CompetitiveIntelligenceData {
  sector_leaders: SectorLeader[]
  market_share: MarketShare[]
  competitive_metrics: CompetitiveMetric[]
  threats_opportunities: ThreatOpportunity[]
  sector_analysis: SectorAnalysis[]
}

export interface SectorLeader {
  business_name: string
  sector: string
  market_position: number
  strength_score: number
  key_advantages: string[]
}

export interface MarketShare {
  sector: string
  total_market_size: number
  top_players: MarketPlayer[]
}

export interface MarketPlayer {
  business_name: string
  market_share: number
  growth_rate: number
}

export interface CompetitiveMetric {
  metric: string
  industry_average: number
  top_performer: number
  sector: string
}

export interface ThreatOpportunity {
  type: 'threat' | 'opportunity'
  title: string
  description: string
  sector: string
  impact_level: string
}

export interface SectorAnalysis {
  sector: string
  competitiveness: number
  barriers_to_entry: string
  growth_potential: number
  key_trends: string[]
}

// Dashboard Types
export interface DashboardData {
  metrics: DashboardMetric[]
  activityTrends: ActivityTrend[]
  distribution: DistributionItem[]
  performance: PerformanceItem[]
  recentActivity: RecentActivity[]
}

export interface DashboardMetric {
  label: string
  value: string | number
  change?: number
  color: string
  icon: any
}

export interface ActivityTrend {
  date: string
  views: number
  interactions: number
}

export interface DistributionItem {
  name: string
  value: number
}

export interface PerformanceItem {
  category: string
  current: number
  previous: number
}

export interface RecentActivity {
  title: string
  description: string
  timestamp: string
  type: 'success' | 'warning' | 'info'
}

// Alert System Types
export interface Alert {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  timestamp: string
  read: boolean
  business_id?: string
}

// Data Quality Types
export interface DataQualityMetrics {
  overall_score: number
  completeness: number
  accuracy: number
  anomalies_count: number
  duplicates_count: number
  last_updated: string
  issues: DataQualityIssue[]
  trends: QualityTrend[]
  recommendations: QualityRecommendation[]
}

export interface DataQualityIssue {
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  affected_records: number
}

export interface QualityTrend {
  metric: string
  period: string
  change: number
  current_value: number
}

export interface QualityRecommendation {
  title: string
  description: string
  priority: string
  impact: string
}

// Feedback & Survey Types
export interface FeedbackData {
  nps_score: number
  response_rate: number
  total_responses: number
  average_rating: number
  sentiment_breakdown: SentimentBreakdown[]
  recent_feedback: RecentFeedback[]
  nps_trends: NPSTrend[]
}

export interface SentimentBreakdown {
  sentiment: string
  percentage: number
}

export interface RecentFeedback {
  rating: number
  comment: string
  sentiment: string
  timestamp: string
}

export interface NPSTrend {
  period: string
  score: number
  responses: number
}

export interface Survey {
  id?: string
  title: string
  description: string
  questions: SurveyQuestion[]
  active: boolean
}

export interface SurveyQuestion {
  question: string
  type: 'rating' | 'text' | 'multiple_choice' | 'yes_no'
  required: boolean
  options?: string[]
}

// Role Management Types
export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  level: number
}

export interface UserAccount {
  id: string
  name: string
  email: string
  role: string
  role_id: string
  active: boolean
  created_at: string
  last_login?: string
}

// Predictive Analytics Types
export interface PredictiveAnalyticsData {
  model_accuracy: number
  total_predictions: number
  high_risk_count: number
  confidence_score: number
  growth_predictions: GrowthPrediction[]
  risk_assessments: RiskAssessment[]
  opportunities: OpportunityPrediction[]
  model_insights: ModelInsight[]
}

export interface GrowthPrediction {
  business_name: string
  sector: string
  region: string
  growth_score: number
  time_frame: string
  confidence: number
}

export interface RiskAssessment {
  business_name: string
  risk_level: string
  risk_score: number
  risk_factors: string[]
  last_updated: string
}

export interface OpportunityPrediction {
  title: string
  description: string
  sector: string
  score: number
  estimated_value: number
}

export interface ModelInsight {
  title: string
  description: string
  model_type: string
  confidence: number
}

// External Integration Types
export interface Integration {
  id: string
  name: string
  type: 'webhook' | 'crm' | 'erp' | 'email' | 'analytics'
  endpoint: string
  api_key: string
  active: boolean
  events: string[]
  headers: Record<string, string>
  description: string
  last_success?: string
  total_calls?: number
  success_rate?: number
}