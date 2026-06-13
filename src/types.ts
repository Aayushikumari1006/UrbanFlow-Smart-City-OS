export interface MetricDetail {
  congestion_index: number;
  avg_speed_kmh: number;
  road_closures: number;
  peak_hour_delay_min: number;
  public_transit_coverage: number;
}

export interface AQIDetail {
  pm25: number;
  pm10: number;
  aqi_index: number;
  good_air_days_pct: number;
  industrial_zones: number;
}

export interface SafetyDetail {
  incidents_per_lakh: number;
  cctv_coverage_pct: number;
  police_response_min: number;
  women_safety_score: number;
  lit_streets_pct: number;
}

export interface BudgetDetail {
  total_crore: number;
  utilized_pct: number;
  infrastructure_pct: number;
  social_pct: number;
  operations_pct: number;
}

export interface CitizenDetail {
  satisfaction_score: number;
  grivances_monthly: number;
  resolution_rate_pct: number;
  digital_adoption_pct: number;
}

export interface CityBaseline {
  traffic: MetricDetail;
  aqi: AQIDetail;
  safety: SafetyDetail;
  budget: BudgetDetail;
  citizen: CitizenDetail;
}

export interface City {
  id: string;
  name: string;
  state: string;
  population: number;
  area: number;
  baseline: CityBaseline;
}

export interface SliderConfig {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  inverseGood?: boolean;
  group: string;
}

export interface DemoScenario {
  label: string;
  desc: string;
  params: Record<string, number>;
}

export interface AgentAssessment {
  status: "healthy" | "warning" | "critical";
  recommendations: string[];
  confidence: number;
  overall_score?: number;
  summary?: string;
}

export interface AIAnalysis {
  executive_summary: string;
  risk_assessment: string;
  opportunity_assessment: string;
  recommended_actions: string;
  predicted_outcomes: string;
  confidence_score: number;
  reasoning: string;
  trend_interpretation: string;
  citizen_impact_forecast: string;
  budget_impact_forecast: string;
}

export interface SavedScenario {
  id: string;
  name: string;
  cityId: string;
  description: string;
  parameters: Record<string, number>;
  createdAt: string;
}

export interface ProposalAnalysis {
  decision: "APPROVED" | "APPROVED_WITH_CONDITIONS" | "REJECTED";
  confidence: number;
  summary: string;
  traffic_impact: string;
  aqi_impact: string;
  safety_impact: string;
  budget_impact: string;
  citizen_impact: string;
  conditions: string[];
  feasibility_score: number;
  roi_rating: string;
}

export interface Proposal {
  title: string;
  cityId: string;
  analysis: ProposalAnalysis;
  analyzedAt: string;
}

export interface Notification {
  id: string;
  message: string;
  level: "critical" | "warning" | "healthy" | "info";
  time: string;
}

export interface ZoneDetail {
  id: string;
  name: string;
  type: string;
  risk: "high" | "medium" | "low";
  congestion: number;
  aqi: number;
  cctv: number;
  safety: number;
  diagnosis: string;
  treatment: string;
}
