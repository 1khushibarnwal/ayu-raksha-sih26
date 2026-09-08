export type ProductType =
  | 'Classical'
  | 'Proprietary'
  | 'New formulation'
  | 'Phytopharmaceutical'
  | 'Ayurveda-Aahar'
  | 'Cosmetic'
  | 'Other'
  | 'Not sure'

export type IngredientSource =
  | 'Cultivated'
  | 'Wild sourced'
  | 'Traditional community'
  | 'Supplier'
  | 'Unknown'

export type NoveltyOption =
  | 'Combination'
  | 'Extraction'
  | 'Manufacturing'
  | 'Therapeutic use'
  | 'Dosage'
  | 'Formulation'
  | 'Packaging'
  | 'Brand'

export type TargetMarket =
  | 'India'
  | 'USA'
  | 'EU'
  | 'Japan'
  | 'Australia'
  | 'Others'

export interface InnovationFormData {
  productType: ProductType | ''
  ingredients: string[]
  ingredientSource: IngredientSource | ''
  noveltyElements: NoveltyOption[]
  targetMarkets: TargetMarket[]
  productName?: string
  intendedUse?: string
}

export interface InnovationProfile {
  productType: ProductType
  ingredients: string[]
  ingredientSource: IngredientSource
  noveltyElements: NoveltyOption[]
  targetMarkets: TargetMarket[]
  productName?: string
  submittedAt: string
}

export interface AIClassification {
  classification: string
  confidence: number // e.g. 91 (for 91%)
  explanation: string
  regulatoryCategory: string
  riskFactors: string[]
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

// ============================================================================
// GLOBAL EVIDENCE ARCHITECTURE (Features 11–20 Unified)
// ============================================================================
export type EvidenceSourceType =
  | 'Classical Text'
  | 'TKDL Database'
  | 'Pharmacopoeia'
  | 'Patent Law / Statute'
  | 'Biodiversity Law'
  | 'Regulatory Rule'
  | 'Court Precedent'
  | 'International Material'
  | 'Research / Academic Source'
  | 'Government Document'

export type EvidenceJurisdiction =
  | 'India (IPO/AYUSH/NBA)'
  | 'USA (USPTO/FDA)'
  | 'EU (EPO/EMA)'
  | 'WIPO / International'
  | 'Japan (JPO/MHLW)'
  | 'Australia (IP Australia/TGA)'

export type EvidenceAuthorityLevel =
  | 'Authoritative'
  | 'Statutory'
  | 'Regulatory'
  | 'Defensive Prior Art'
  | 'Secondary'

export type EvidenceStatus = 'Current' | 'Superseded' | 'Historical' | 'Future / Scheduled'

export interface EvidenceItem {
  id?: string
  sourceTitle: string
  sourceType: EvidenceSourceType
  jurisdiction: EvidenceJurisdiction
  publication: string
  reference: string
  authority?: string
  authorityLevel?: EvidenceAuthorityLevel
  effectiveDate?: string
  version?: string
  provision?: string
  url?: string
  excerpt: string
  whyRelevant?: string
  documentId?: string
  status?: EvidenceStatus
  relevance: number // 0.0 - 1.0 (e.g. 0.94)
}

// Backward-compatible alias for existing TK detector
export type EvidenceSource = EvidenceItem

export interface TraditionalKnowledgeMatch {
  id: string
  name: string
  classicalContext: string
  similarity: number
  matchReason: string
  matchedIngredients: string[]
  evidence: EvidenceItem
}

export interface TraditionalKnowledgeRisk {
  score: number
  level: RiskLevel
  summary: string
  identifiedClassicalReferencesCount: number
}

// 7. IP PROTECTION STRATEGY
export type IPRouteType = 'Patent' | 'Trademark' | 'Design' | 'Trade Secret' | 'Geographical Indication (GI)' | 'Copyright'
export type IPRouteStatus = 'Recommended' | 'Investigate' | 'Not applicable / uncertain'

export interface IPProtectionRoute {
  id: string
  route: IPRouteType
  status: IPRouteStatus
  reason: string
  keyConsiderations: string[]
  evidence: EvidenceItem[]
  suggestedAction: string
}

export interface IPProtectionStrategyResult {
  summary: string
  routes: IPProtectionRoute[]
}

// 8. IP RISK CENTER
export interface RiskDimensionFactor {
  factor: string
  contribution: number
  description: string
  evidence: EvidenceItem[]
}

export interface RiskDimension {
  id: 'tk' | 'patent' | 'regulatory' | 'abs' | 'international'
  name: string
  shortLabel: string
  score: number
  level: RiskLevel
  weight: number
  whyAssigned: string
  factors: RiskDimensionFactor[]
  evidence: EvidenceItem[]
  relevantRule: string
  recommendedAction: string
}

export interface IPRiskCenterResult {
  overallScore: number
  overallLevel: RiskLevel
  overallSummary: string
  dimensions: RiskDimension[]
}

// 9. BIODIVERSITY & ABS CHECKER
export type ABSInvolvement = 'YES' | 'NO' | 'NOT SURE'
export type ABSStatus =
  | 'Review Required'
  | 'Likely Not Applicable'
  | 'More Information Needed'
  | 'Potential ABS Consideration'

export interface ABSFormData {
  involvesBiologicalResource: ABSInvolvement
  resourceName: string
  resourceSource: string
  communityKnowledge: 'Yes' | 'No' | 'Not sure'
  purpose: 'Commercial utilization' | 'Research & Development' | 'Bio-survey & bio-utilization' | 'Foreign patent / export' | 'Other'
}

export interface ABSAssessmentResult {
  involvesBiologicalResource: boolean
  resource: string
  source: string
  communityKnowledge: boolean | null
  purpose: string
  status: ABSStatus
  reason: string
  evidence: EvidenceItem[]
  nextStep: string
  authority: string
  exemptionNotes?: string
}

// 10. REGULATORY NAVIGATOR
export type RequirementStatus = 'Complete' | 'Review Required' | 'Missing' | 'Not Applicable' | 'Uncertain'

export interface RegulatoryRequirementItem {
  id: string
  name: string
  category: 'Classification' | 'Manufacturing' | 'Labelling' | 'Claims / Advertising' | 'Safety / Evidence' | 'Documentation'
  status: RequirementStatus
  explanation: string
  evidence: EvidenceItem[]
}

export interface RequiredDocumentItem {
  id: string
  name: string
  status: 'Ready' | 'Review Required' | 'Drafting Needed' | 'Mandatory Prior to Filing'
  reason: string
  evidence: EvidenceItem[]
}

export interface ComplianceSummary {
  completedCount: number
  reviewRequiredCount: number
  pendingCount: number
  warnings: string[]
  nextSteps: string[]
}

export interface RegulatoryNavigatorResult {
  productClassification: string
  jurisdiction: string
  pathway: string
  pathwayReason: string
  pathwayEvidence: EvidenceItem[]
  requirements: RegulatoryRequirementItem[]
  documents: RequiredDocumentItem[]
  complianceSummary: ComplianceSummary
}

// ============================================================================
// 11. GLOBAL MARKET SIMULATOR
// ============================================================================
export type MarketCode = 'IN' | 'US' | 'EU' | 'JP' | 'AU'
export type MarketStatus = 'Ready' | 'In Progress' | 'Review Required' | 'Missing Items' | 'High Risk' | 'Not Ready' | 'Exempt' | 'Investigate'

export interface MarketStatusItem {
  status: MarketStatus
  explanation: string
  evidence: EvidenceItem[]
  recommendedAction: string
}

export interface MarketReadinessData {
  marketName: string
  marketCode: MarketCode
  flag: string
  regulatoryFramework: string
  ip: MarketStatusItem
  regulatory: MarketStatusItem
  documentation: MarketStatusItem
  traditionalKnowledge: MarketStatusItem
  marketEntry: MarketStatusItem
  overallReadinessScore: number
  evidence: EvidenceItem[]
}

export interface GlobalMarketSimulatorResult {
  selectedMarket: MarketCode
  markets: Record<MarketCode, MarketReadinessData>
}

// ============================================================================
// 12. EVIDENCE LOCKER
// ============================================================================
export interface EvidenceLockerItem extends EvidenceItem {
  category: 'IP' | 'TK' | 'Regulatory' | 'ABS' | 'Global Market' | 'Compliance'
  taggedConclusion: string
  documentTitle?: string
  documentDownloadUrl?: string
}

export interface EvidenceLockerResult {
  totalItems: number
  items: EvidenceLockerItem[]
}

// ============================================================================
// 13 & 14. ASK AYU-RAKSHA CHATBOT & MULTILINGUAL / VOICE
// ============================================================================
export interface ChatMessage {
  id: string
  sender: 'user' | 'bot'
  text: string
  timestamp: string
  reasoning?: string
  confidence?: number
  sources?: EvidenceItem[]
  nextStep?: string
  uploadedDocName?: string
  language?: string
}

export interface VoiceRecognitionState {
  isListening: boolean
  transcript: string
  error?: string
  providerName: string
}

// ============================================================================
// 15. AYU-IP PASSPORT
// ============================================================================
export interface AYUIPPassportData {
  passportId: string
  version: string
  generatedDate: string
  isMock: boolean
  overallReadiness: number
  whyScoreAssigned: string
  identity: {
    product: string
    ingredients: string[]
    origin: string
    organization: string
  }
  ipStatus: {
    patent: string
    trademark: string
    design: string
    tradeSecret: string
    gi: string
  }
  riskCompliance: {
    tkRisk: string
    absStatus: string
    regulatoryStatus: string
  }
  marketReadiness: {
    india: string
    usa: string
    eu: string
    japan: string
    australia: string
  }
  evidenceReferences: EvidenceItem[]
  nextSteps: string[]
}

// ============================================================================
// 16. COMMERCIALIZATION ROADMAP
// ============================================================================
export type RoadmapStageId =
  | 'innovation'
  | 'classification'
  | 'tk_screening'
  | 'ip_assessment'
  | 'abs_assessment'
  | 'regulatory_classification'
  | 'ip_protection'
  | 'compliance'
  | 'market_authorization'
  | 'global_expansion'

export type RoadmapStageStatus = 'Not Started' | 'In Progress' | 'Review Required' | 'Blocked' | 'Completed'

export interface RoadmapTask {
  id: string
  title: string
  completed: boolean
  requiredDoc?: string
}

export interface RoadmapStage {
  id: RoadmapStageId
  stageNumber: number
  title: string
  subtitle: string
  icon: string
  status: RoadmapStageStatus
  tasks: RoadmapTask[]
  dependencies: string[]
  recommendedAction: string
  relevantDocuments: string[]
  evidence: EvidenceItem[]
}

export interface CommercializationRoadmapResult {
  stages: RoadmapStage[]
  currentStageId: RoadmapStageId
  completionPercentage: number
}

// ============================================================================
// 17. ACTION CENTER
// ============================================================================
export type ActionTaskPriority = 'High Priority' | 'Medium Priority' | 'Upcoming' | 'Completed'
export type ActionTaskStatus = 'Pending' | 'In Progress' | 'Done'

export interface ActionTask {
  id: string
  title: string
  priority: ActionTaskPriority
  status: ActionTaskStatus
  sourceFeature: string
  reason: string
  dueDate?: string
  evidence: EvidenceItem[]
  suggestedAction: string
}

export interface ActionCenterResult {
  tasks: ActionTask[]
  summary: {
    highCount: number
    mediumCount: number
    upcomingCount: number
    completedCount: number
  }
}

// ============================================================================
// 18. DOCUMENT UPLOAD
// ============================================================================
export type DocumentProcessingState =
  | 'idle'
  | 'uploading'
  | 'validating'
  | 'extracting'
  | 'chunking'
  | 'ready'
  | 'complete'
  | 'failed'

export interface UploadedDocumentMetadata {
  id: string
  documentName: string
  documentType: 'Formulation' | 'Research Paper' | 'Patent Spec' | 'Regulatory Dossier' | 'CoA Report' | 'Other'
  sizeBytes: number
  uploadedAt: string
  processingStatus: DocumentProcessingState
  extractedChunksCount: number
  relevantSections: string[]
  jurisdiction: string
  evidenceGenerated?: EvidenceItem[]
}

// ============================================================================
// 19. SOURCE EXPLORER
// ============================================================================
export interface KnowledgeSourceFilter {
  query: string
  sourceType?: string
  jurisdiction?: string
  authorityLevel?: string
  status?: string
}

export interface KnowledgeSourceItem extends EvidenceItem {
  fullTextSnippet?: string
  lastUpdated: string
  citationsCount?: number
}

// ============================================================================
// 20. LEGAL / REGULATORY TIMELINE
// ============================================================================
export interface LegalTimelineVersion {
  id: string
  documentTitle: string
  version: string
  status: EvidenceStatus
  effectiveDate: string
  supersededDate?: string
  amendmentDate?: string
  jurisdiction: string
  whatChanged: {
    previous: string
    current: string
    changeType: string
    source: string
  }
  relevantProvisions: string[]
  sourceUrl?: string
  authority: string
}

export interface LegalTimelineAct {
  actId: string
  actName: string
  category: string
  jurisdiction: string
  versions: LegalTimelineVersion[]
}

// ============================================================================
// 21. HUMAN EXPERT ESCALATION
// ============================================================================
export type ExpertRequestStatus =
  | 'Pending'
  | 'Assigned'
  | 'In Review'
  | 'Awaiting User Information'
  | 'Resolved'
  | 'Closed'

export type ExpertIssueCategory =
  | 'Section 3(p) Patent Eligibility'
  | 'TKDL Prior Art Invalidation'
  | 'NBA / Biological Diversity ABS'
  | 'US FDA Botanical Drug Guidance'
  | 'EU EMA Traditional Herbal Registry'
  | 'Novel Synergy & Non-Obviousness'
  | 'Regulatory Dossier Review'

export type ExpertUrgency = 'Standard' | 'Urgent' | 'Critical (Pre-Filing Deadline)'

export interface AssignedExpertInfo {
  name: string
  title: string
  organization: string
  avatarUrl?: string
  specialization: string
}

export interface ExpertRequest {
  id: string
  innovationId?: string
  productName: string
  requesterName: string
  requesterEmail: string
  requesterRole: string
  issueCategory: ExpertIssueCategory
  urgency: ExpertUrgency
  description: string
  extractedContext: string
  missingInformation: string[]
  attachedEvidenceCount: number
  status: ExpertRequestStatus
  assignedExpert?: AssignedExpertInfo
  expertNotes?: string
  createdAt: string
  updatedAt: string
}

// ============================================================================
// 22. CONFIDENCE INDICATOR & EXPLAINABILITY
// ============================================================================
export type ConfidenceLevel = 'High' | 'Moderate' | 'Low'

export interface ConfidenceFactor {
  id: string
  name: string
  score: number // 0-100
  weight: number // 0.0 - 1.0
  status: 'positive' | 'warning' | 'negative'
  explanation: string
}

export interface ConfidenceExplanation {
  level: ConfidenceLevel
  overallScore: number // 0 - 100
  isAbstaining: boolean
  abstentionReason?: string
  factors: ConfidenceFactor[]
  knownFacts: string[]
  missingInformation: string[]
  recommendedAction: string
}

// ============================================================================
// 23. MY INNOVATIONS & VERSION HISTORY
// ============================================================================
export interface AnalysisVersionSnapshot {
  version: number
  createdAt: string
  summary: string
  readinessScore: number
  riskLevel: RiskLevel
  confidenceScore: number
  formData: InnovationFormData
  result: AnalysisResult
}

export interface SavedInnovation {
  id: string
  name: string
  productType: ProductType
  ingredients: string[]
  targetMarkets: TargetMarket[]
  currentVersion: number
  isStale: boolean
  lastAnalyzedAt: string
  currentFormData: InnovationFormData
  currentResult: AnalysisResult
  versions: AnalysisVersionSnapshot[]
  tags?: string[]
}

// ============================================================================
// 24. PROFILE & SETTINGS
// ============================================================================
export type UserRole =
  | 'Ayurvedic Practitioner (Vaidya)'
  | 'Pharma / Biotech Researcher'
  | 'Startup Founder'
  | 'AYUSH Manufacturer'
  | 'IP Attorney / Patent Agent'
  | 'Academic / Student'
  | 'Regulatory Consultant'

export interface UserProfile {
  id: string
  fullName: string
  email: string
  organization: string
  role: UserRole
  preferredLanguage: 'en' | 'hi' | 'bn'
  primaryJurisdictions: string[]
  avatarUrl?: string
  memberSince: string
}

export interface UserPreferences {
  reasoningRigor: 'conservative' | 'balanced' | 'exploratory'
  abstentionSensitivity: 'strict' | 'standard' | 'relaxed'
  emailAlerts: {
    regulatoryChanges: boolean
    expertResponses: boolean
    highRiskAlerts: boolean
  }
  dataRetentionMode: 'local_storage' | 'isolated' | 'zero_retention'
}

// ============================================================================
// UNIFIED MASTER ANALYSIS RESULT (Features 1–24)
// ============================================================================
export interface AnalysisResult {
  id: string
  profile: InnovationProfile
  aiClassification: AIClassification
  traditionalKnowledgeRisk: TraditionalKnowledgeRisk
  possibleMatches: TraditionalKnowledgeMatch[]
  ipStrategy: IPProtectionStrategyResult
  ipRiskCenter: IPRiskCenterResult
  absAssessment: ABSAssessmentResult
  regulatoryNavigator: RegulatoryNavigatorResult
  globalMarkets: GlobalMarketSimulatorResult
  evidenceLocker: EvidenceLockerResult
  ipPassport: AYUIPPassportData
  roadmap: CommercializationRoadmapResult
  actionCenter: ActionCenterResult
  confidenceExplanation?: ConfidenceExplanation
  recommendations: string[]
  isMock: boolean
}

