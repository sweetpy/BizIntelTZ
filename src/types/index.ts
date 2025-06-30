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

export interface CrawlerStats {
  total_runs: number
  total_pages: number
  total_businesses: number
  last_run: string | null
  avg_pages_per_run: number
  avg_businesses_per_run: number
  uptime_seconds: number
}

export interface DocumentFile {
  id: number
  filename: string
  processed: boolean
  uploaded_at: string
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

// Rankings & Leaderboard Types
export interface BusinessRanking {
  id: string
  name: string
  bi_id: string
  region: string
  sector: string
  digital_score: number
  rank: number
  previous_rank: number
  rank_change: number
  views_count: number
  reviews_count: number
  average_rating: number
  badges: Badge[]
  buzz_score: number
  market_share_percentage: number
  sentiment_score: number
  growth_rate: number
  premium: boolean
  verified: boolean
  claimed: boolean
}

export interface Badge {
  id: string
  name: string
  icon: string
  color: string
  description: string
  earned_date: string
  category: 'performance' | 'growth' | 'popularity' | 'quality' | 'achievement'
}

export interface LeaderboardData {
  overall_leaders: BusinessRanking[]
  regional_leaders: RegionalLeaderboard[]
  sector_leaders: SectorLeaderboard[]
  trending_businesses: BusinessRanking[]
  fastest_growing: BusinessRanking[]
  most_viewed: BusinessRanking[]
  top_rated: BusinessRanking[]
  recent_badge_winners: BadgeWinner[]
}

export interface RegionalLeaderboard {
  region: string
  leaders: BusinessRanking[]
  total_businesses: number
  market_size: number
}

export interface SectorLeaderboard {
  sector: string
  leaders: BusinessRanking[]
  total_businesses: number
  avg_digital_score: number
}

export interface BadgeWinner {
  business_id: string
  business_name: string
  badge: Badge
  earned_date: string
  region: string
  sector: string
}

export interface MarketShareData {
  sector: string
  region?: string
  total_market_size: number
  businesses: MarketShareBusiness[]
  competition_intensity: number
}

export interface MarketShareBusiness {
  id: string
  name: string
  market_share: number
  views_share: number
  reviews_share: number
  rank: number
  color: string
}

export interface CompetitorComparison {
  business_a: CompetitorProfile
  business_b: CompetitorProfile
  comparison_metrics: ComparisonMetric[]
  winner: 'a' | 'b' | 'tie'
  recommendation: string
}

export interface CompetitorProfile {
  id: string
  name: string
  bi_id: string
  region: string
  sector: string
  digital_score: number
  rank: number
  views_count: number
  reviews_count: number
  average_rating: number
  badges: Badge[]
  sentiment_score: number
  growth_rate: number
  market_share: number
  strengths: string[]
  weaknesses: string[]
}

export interface ComparisonMetric {
  name: string
  business_a_value: number | string
  business_b_value: number | string
  winner: 'a' | 'b' | 'tie'
  difference: string
}

export interface BuzzMeterData {
  business_id: string
  business_name: string
  overall_buzz: number
  sentiment_trend: SentimentPoint[]
  review_velocity: ReviewVelocity[]
  social_mentions: SocialMention[]
  buzz_factors: BuzzFactor[]
  competitive_position: number
}

export interface SentimentPoint {
  date: string
  positive: number
  neutral: number
  negative: number
  overall_score: number
}

export interface ReviewVelocity {
  period: string
  review_count: number
  average_rating: number
  growth_rate: number
}

export interface SocialMention {
  platform: string
  mentions: number
  sentiment: number
  reach: number
}

export interface BuzzFactor {
  factor: string
  impact: number
  trend: 'up' | 'down' | 'stable'
  description: string
}

export interface VisibilityHeatmap {
  region: string
  businesses: HeatmapBusiness[]
  dominance_scores: DominanceScore[]
  competition_density: number
  market_opportunities: string[]
}

export interface HeatmapBusiness {
  id: string
  name: string
  latitude: number
  longitude: number
  dominance_score: number
  visibility_radius: number
  color: string
  size: number
}

export interface DominanceScore {
  area: string
  leader: string
  leader_id: string
  dominance_percentage: number
  competition_level: 'low' | 'medium' | 'high'
}

export interface CompetitiveAlert {
  id: string
  business_id: string
  type: 'rank_drop' | 'competitor_surge' | 'new_threat' | 'opportunity' | 'badge_lost'
  title: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  competitor_id?: string
  competitor_name?: string
  rank_change?: number
  metric_change?: number
  action_required: boolean
  created_at: string
  read: boolean
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

// Adaptive AI Types
export interface AdaptiveInsights {
  ranking_updates_today: number
  last_ranking_update: string
  anomalies_detected: number
  tips_generated: number
  ai_confidence: number
  real_time_rankings: AIRankedBusiness[]
  anomaly_alerts: AnomalyAlert[]
}

export interface AIRankedBusiness {
  id: string
  name: string
  sector: string
  region: string
  ai_score: number
  rank_change: number
}

export interface AnomalyAlert {
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  business_name: string
  timestamp: string
}

export interface PersonalizedTip {
  title: string
  description: string
  category: string
  impact: string
}

export interface RankingSettings {
  weightDigitalScore: number
  weightReviews: number
  weightActivity: number
  weightLocation: number
  weightPremium: number
  enableRealTimeUpdates: boolean
  anomalyThreshold: number
}

// Community Forum Types
export interface ForumPost {
  id: string
  title: string
  content: string
  category: string
  author_name: string
  upvotes: number
  downvotes: number
  replies_count: number
  created_at: string
  tags: string[]
  is_featured: boolean
}

export interface CommunityTag {
  name: string
  member_count: number
  is_member: boolean
}

export interface ForumCategory {
  name: string
  description: string
  post_count: number
}

// Marketplace Types
export interface MarketplaceListing {
  id: string
  title: string
  description: string
  category: string
  type: 'product' | 'service' | 'promotion' | 'b2b-offer'
  price: string
  location: string
  expiry_date: string
  business_id: string
  business_name: string
  images: string[]
}

export interface MarketplaceCategory {
  name: string
  listing_count: number
}

export interface Transaction {
  id: string
  item_title: string
  buyer_name: string
  seller_name: string
  amount: string
  status: 'completed' | 'pending' | 'cancelled'
  created_at: string
}

// SEO Content Engine Types
export interface SEOPage {
  id: string
  title: string
  url: string
  meta_description: string
  keywords: string
  content_type: 'landing' | 'directory' | 'blog' | 'category'
  region?: string
  business_type?: string
  monthly_visits: number
  avg_position: number
}

export interface TrafficStats {
  organic_visits: number
  ranking_keywords: number
  total_pageviews: number
  top_pages: TopPage[]
  top_keywords: TopKeyword[]
}

export interface TopPage {
  title: string
  url: string
  visits: number
}

export interface TopKeyword {
  keyword: string
  position: number
  search_volume: number
}

export interface SEOMetrics {
  total_pages: number
  indexed_pages: number
  average_position: number
  organic_traffic_growth: number
}

// AI Marketing Assistant Types
export interface MarketingContent {
  business_id: string
  business_name: string
  content_type: string
  generated_at: string
  performance_score: number
}

export interface ContentSuggestion {
  title: string
  content: string
  type: string
  confidence: number
  tags: string[]
}

export interface VisualAsset {
  title: string
  description: string
  type: 'image' | 'video' | 'graphic'
  url: string
  filename: string
}

// Skill Building Types
export interface Course {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number // in hours
  price: number
  rating: number
  enrolled_count: number
  is_enrolled: boolean
  category: string
}

export interface Webinar {
  id: string
  title: string
  description: string
  scheduled_date: string
  duration: number // in minutes
  status: 'live' | 'upcoming' | 'recorded'
  registered_count: number
  instructor: string
}

export interface Certification {
  id: string
  title: string
  description: string
  duration: number // in weeks
  price: number
  prerequisites: string
  issuer: string
  validity_period: string
}

export interface UserProgress {
  course_id: string
  progress_percentage: number
  completed_at?: string
  certificate_earned: boolean
}
