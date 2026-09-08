import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type {
  InnovationFormData,
  AnalysisResult,
  ProductType,
  IngredientSource,
  NoveltyOption,
  TargetMarket,
} from '../types/analyzer'
import { analyzeInnovation } from '../services/analyzerService'
import { saveOrUpdateInnovation } from '../services/innovationStoreService'
import { translations, type SupportedLanguage } from '../data/translations'
import ProductTypeSelector from '../components/analyzer/ProductTypeSelector'
import IngredientSearch from '../components/analyzer/IngredientSearch'
import IngredientSourceSelector from '../components/analyzer/IngredientSourceSelector'
import NoveltySelector from '../components/analyzer/NoveltySelector'
import TargetMarketSelector from '../components/analyzer/TargetMarketSelector'
import AnalysisLoading from '../components/analyzer/AnalysisLoading'
import InnovationProfileView from '../components/analyzer/InnovationProfileView'
import AIClassificationCard from '../components/analyzer/AIClassificationCard'
import TraditionalKnowledgeDetector from '../components/analyzer/TraditionalKnowledgeDetector'
import IPProtectionStrategy from '../components/analyzer/IPProtectionStrategy'
import IPRiskCenter from '../components/analyzer/IPRiskCenter'
import ABSChecker from '../components/analyzer/ABSChecker'
import RegulatoryNavigator from '../components/analyzer/RegulatoryNavigator'
import { GlobalMarketSimulator } from '../components/analyzer/GlobalMarketSimulator'
import { EvidenceLocker } from '../components/analyzer/EvidenceLocker'
import { AskAyuRaksha } from '../components/analyzer/AskAyuRaksha'
import { AyuIPPassport } from '../components/analyzer/AyuIPPassport'
import { CommercializationRoadmap } from '../components/analyzer/CommercializationRoadmap'
import { ActionCenter } from '../components/analyzer/ActionCenter'
import { DocumentUpload } from '../components/analyzer/DocumentUpload'
import { SourceExplorer } from '../components/analyzer/SourceExplorer'
import { LegalTimeline } from '../components/analyzer/LegalTimeline'
import ConfidenceIndicator from '../components/analyzer/ConfidenceIndicator'
import HumanExpertAssistance from '../components/analyzer/HumanExpertAssistance'
import Navbar from '../components/Navbar'

const initialForm: InnovationFormData = {
  productType: '',
  ingredients: [],
  ingredientSource: '',
  noveltyElements: [],
  targetMarkets: ['India'],
  productName: '',
}

type WorkspaceTab =
  | 'overview'
  | 'passport'
  | 'markets'
  | 'roadmap'
  | 'action_center'
  | 'evidence_locker'
  | 'chat_assistant'
  | 'expert_escalation'
  | 'doc_upload'
  | 'source_explorer'
  | 'legal_timeline'


export default function InnovationAnalyzer() {
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState<InnovationFormData>(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en')
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview')
  const [activeDocForChat, setActiveDocForChat] = useState<string | undefined>()
  const [saveToast, setSaveToast] = useState<string | null>(null)

  const t = translations[currentLang]

  // Check if an innovation was selected from "My Innovations" portfolio or query parameter
  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('active_innovation_data')
      const storedResult = sessionStorage.getItem('active_innovation_result')
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        if (parsedData && typeof parsedData === 'object') {
          setFormData((prev) => ({ ...prev, ...parsedData }))
        }
      }
      if (storedResult) {
        const parsedResult = JSON.parse(storedResult)
        if (parsedResult && typeof parsedResult === 'object' && parsedResult.profile) {
          setResult(parsedResult)
        } else {
          sessionStorage.removeItem('active_innovation_result')
        }
      }
    } catch (err) {
      console.error('Failed to load session innovation:', err)
      sessionStorage.removeItem('active_innovation_data')
      sessionStorage.removeItem('active_innovation_result')
    }
  }, [])

  // Handle URL query parameter ?tab=
  useEffect(() => {
    const tabParam = searchParams.get('tab') as WorkspaceTab | null
    if (tabParam) {
      setActiveTab(tabParam)
      // If result is not present, auto-load sample data so all tabs render with full rich data
      if (!result) {
        handleFillSample(tabParam)
      }
    }
  }, [searchParams])

  function handleSaveToPortfolio() {
    if (!result) return
    const saved = saveOrUpdateInnovation(formData, result)
    setSaveToast(`Saved "${saved.name}" to My Innovations portfolio (v${saved.currentVersion})!`)
    setTimeout(() => setSaveToast(null), 4000)
  }

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {}

    if (!formData.productType) {
      newErrors.productType = 'Please select a product type'
    }
    if (formData.ingredients.length === 0) {
      newErrors.ingredients = 'Please add at least one botanical ingredient / active'
    }
    if (!formData.ingredientSource) {
      newErrors.ingredientSource = 'Please select the ingredient source'
    }
    if (formData.noveltyElements.length === 0) {
      newErrors.noveltyElements = 'Please select at least one novel element'
    }
    if (formData.targetMarkets.length === 0) {
      newErrors.targetMarkets = 'Please select at least one target market'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleAnalyze() {
    if (!validateForm()) {
      window.scrollTo({ top: 180, behavior: 'smooth' })
      return
    }

    setIsAnalyzing(true)
    try {
      const analysisResult = await analyzeInnovation(formData)
      setResult(analysisResult)
      setActiveTab('overview')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  function handleReset() {
    setFormData(initialForm)
    setErrors({})
    setResult(null)
    setActiveTab('overview')
    sessionStorage.removeItem('active_innovation_data')
    sessionStorage.removeItem('active_innovation_result')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleFillSample(targetTab: WorkspaceTab = 'overview') {
    const sampleData: InnovationFormData = {
      productName: 'AyurSnooze Stress Relief Matrix',
      productType: 'Proprietary',
      ingredients: ['Ashwagandha', 'Brahmi', 'Shankhpushpi', 'Licorice (Mulethi / Yashtimadhu)'],
      ingredientSource: 'Cultivated',
      noveltyElements: ['Combination', 'Extraction', 'Formulation'],
      targetMarkets: ['India', 'USA', 'EU'],
    }
    setFormData(sampleData)
    setErrors({})
    
    // Auto trigger analysis for instant review
    setIsAnalyzing(true)
    try {
      const analysisResult = await analyzeInnovation(sampleData)
      setResult(analysisResult)
      setActiveTab(targetTab)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }


  const handleDocumentSelectForChat = (docName: string) => {
    setActiveDocForChat(docName)
    setActiveTab('chat_assistant')
  }

  return (
    <div className="app">
      <Navbar />

      <main className="analyzer-page-container">
        {/* TOP HERO / BANNER */}
        <section className="analyzer-banner">
          <div className="analyzer-banner-content">
            <div className="analyzer-banner-top-row">
              <span className="eyebrow">
                <span>✦</span> IP-SAKTI SAHAYAK • {t.innovationAnalyzer}
              </span>

              {/* MULTILINGUAL LANGUAGE SWITCHER */}
              <div className="analyzer-lang-switcher" aria-label="Language Selector">
                <button
                  type="button"
                  className={`lang-pill ${currentLang === 'en' ? 'active' : ''}`}
                  onClick={() => setCurrentLang('en')}
                >
                  English
                </button>
                <button
                  type="button"
                  className={`lang-pill ${currentLang === 'hi' ? 'active' : ''}`}
                  onClick={() => setCurrentLang('hi')}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  className={`lang-pill ${currentLang === 'bn' ? 'active' : ''}`}
                  onClick={() => setCurrentLang('bn')}
                >
                  বাংলা
                </button>
              </div>
            </div>

            <h1>
              Assess Ayurvedic <span>Product Innovations.</span>
            </h1>
            <p className="analyzer-banner-desc">
              {t.subtitle} — Multi-regime source-cited evaluation covering statutory patentability,
              Traditional Knowledge overlap, Biodiversity ABS, and CDSCO/Ayush regulatory compliance.
            </p>

            {!result && (
              <div className="analyzer-banner-actions">
                <button
                  type="button"
                  className="analyzer-sample-fill-btn"
                  onClick={() => handleFillSample('overview')}
                >
                  ✨ Run Sample Innovation (Ashwagandha & Brahmi Matrix)
                </button>

                <div className="banner-quick-tools">
                  <span>Quick Access Tools:</span>
                  <button
                    type="button"
                    className="quick-tool-link"
                    onClick={() => {
                      if (!result) handleFillSample()
                      setActiveTab('chat_assistant')
                    }}
                  >
                    🤖 Ask AYU-RAKSHA AI
                  </button>
                  <button
                    type="button"
                    className="quick-tool-link"
                    onClick={() => {
                      if (!result) handleFillSample()
                      setActiveTab('source_explorer')
                    }}
                  >
                    📚 Source Explorer
                  </button>
                  <button
                    type="button"
                    className="quick-tool-link"
                    onClick={() => {
                      if (!result) handleFillSample()
                      setActiveTab('legal_timeline')
                    }}
                  >
                    ⚖️ Legal Timeline
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* LOADING STATE */}
        {isAnalyzing && <AnalysisLoading />}

        {/* RESULTS WORKSPACE VIEW */}
        {!isAnalyzing && result && (
          <div className="analyzer-results-wrapper">
            {/* ACTION BAR */}
            <div className="results-action-bar">
              <div className="results-action-left">
                <button
                  type="button"
                  className="results-back-button"
                  onClick={() => setResult(null)}
                >
                  ← Edit Inputs
                </button>
                <ConfidenceIndicator
                  confidence={result.confidenceExplanation}
                  onEscalateToExpert={() => setActiveTab('expert_escalation')}
                />
              </div>

              <div className="results-action-group">
                <button
                  type="button"
                  className="results-save-button"
                  onClick={handleSaveToPortfolio}
                >
                  💼 Save to My Innovations
                </button>
                <button
                  type="button"
                  className="results-new-button"
                  onClick={handleReset}
                >
                  Start New
                </button>
                <button
                  type="button"
                  className="results-print-button"
                  onClick={() => window.print()}
                >
                  🖨️ Export / Print
                </button>
              </div>
            </div>

            {saveToast && (
              <div className="portfolio-toast results-toast">
                <span>✓</span> {saveToast}
              </div>
            )}

            {/* SUITE WORKSPACE TABS */}
            <div className="workspace-tabs-navbar no-print">
              <button
                type="button"
                className={`workspace-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                📊 Executive Dossier
              </button>
              <button
                type="button"
                className={`workspace-tab-btn ${activeTab === 'passport' ? 'active' : ''}`}
                onClick={() => setActiveTab('passport')}
              >
                🛂 AYU-IP Passport
              </button>
              <button
                type="button"
                className={`workspace-tab-btn ${activeTab === 'markets' ? 'active' : ''}`}
                onClick={() => setActiveTab('markets')}
              >
                🌐 Global Markets
              </button>
              <button
                type="button"
                className={`workspace-tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
                onClick={() => setActiveTab('roadmap')}
              >
                🗺️ 10-Stage Roadmap
              </button>
              <button
                type="button"
                className={`workspace-tab-btn ${activeTab === 'action_center' ? 'active' : ''}`}
                onClick={() => setActiveTab('action_center')}
              >
                ⚡ Action Center
              </button>
              <button
                type="button"
                className={`workspace-tab-btn ${activeTab === 'expert_escalation' ? 'active' : ''}`}
                onClick={() => setActiveTab('expert_escalation')}
              >
                👨‍⚖️ Human Expert Review
              </button>
              <button
                type="button"
                className={`workspace-tab-btn ${activeTab === 'evidence_locker' ? 'active' : ''}`}
                onClick={() => setActiveTab('evidence_locker')}
              >
                🗄️ Evidence Locker ({result.evidenceLocker?.totalItems ?? 0})
              </button>
              <button
                type="button"
                className={`workspace-tab-btn ${activeTab === 'chat_assistant' ? 'active' : ''}`}
                onClick={() => setActiveTab('chat_assistant')}
              >
                🤖 Ask AYU-RAKSHA
              </button>
              <button
                type="button"
                className={`workspace-tab-btn ${activeTab === 'doc_upload' ? 'active' : ''}`}
                onClick={() => setActiveTab('doc_upload')}
              >
                📁 Document Upload
              </button>
              <button
                type="button"
                className={`workspace-tab-btn ${activeTab === 'source_explorer' ? 'active' : ''}`}
                onClick={() => setActiveTab('source_explorer')}
              >
                🔍 Source Explorer
              </button>
              <button
                type="button"
                className={`workspace-tab-btn ${activeTab === 'legal_timeline' ? 'active' : ''}`}
                onClick={() => setActiveTab('legal_timeline')}
              >
                📜 Legal Timeline
              </button>
            </div>

            {/* TAB CONTENT ROUTING */}
            {activeTab === 'overview' && (
              <div className="tab-pane-content">
                {/* FEATURE 2: INNOVATION PROFILE */}
                {result.profile && <InnovationProfileView profile={result.profile} />}

                {/* FEATURE 2: AI CLASSIFICATION */}
                {result.aiClassification && (
                  <AIClassificationCard classification={result.aiClassification} />
                )}

                {/* FEATURE 3: TRADITIONAL KNOWLEDGE DETECTOR */}
                {result.traditionalKnowledgeRisk && (
                  <TraditionalKnowledgeDetector
                    risk={result.traditionalKnowledgeRisk}
                    matches={result.possibleMatches || []}
                    isMock={result.isMock}
                  />
                )}

                {/* FEATURE 7: IP PROTECTION STRATEGY */}
                {result.ipStrategy && (
                  <IPProtectionStrategy strategy={result.ipStrategy} />
                )}

                {/* FEATURE 8: IP RISK CENTER */}
                {result.ipRiskCenter && (
                  <IPRiskCenter riskCenter={result.ipRiskCenter} />
                )}

                {/* FEATURE 9: BIODIVERSITY & ABS CHECKER */}
                {result.absAssessment && (
                  <ABSChecker initialResult={result.absAssessment} profile={result.profile} />
                )}

                {/* FEATURE 10: REGULATORY NAVIGATOR */}
                {result.regulatoryNavigator && (
                  <RegulatoryNavigator
                    navigatorData={result.regulatoryNavigator}
                    profile={result.profile}
                    classification={result.aiClassification}
                  />
                )}

                {/* FEATURE 11: GLOBAL MARKET SIMULATOR */}
                {result.globalMarkets && (
                  <GlobalMarketSimulator simulatorData={result.globalMarkets} />
                )}

                {/* FEATURE 15: AYU-IP PASSPORT */}
                {result.ipPassport && (
                  <AyuIPPassport passportData={result.ipPassport} />
                )}

                {/* FEATURE 16: COMMERCIALIZATION ROADMAP */}
                {result.roadmap && (
                  <CommercializationRoadmap roadmapData={result.roadmap} />
                )}

                {/* FEATURE 17: ACTION CENTER */}
                {result.actionCenter && (
                  <ActionCenter actionCenterData={result.actionCenter} />
                )}

                {/* FEATURE 12: EVIDENCE LOCKER */}
                {result.evidenceLocker && (
                  <EvidenceLocker evidenceLockerData={result.evidenceLocker} />
                )}

                {/* FEATURE 21: HUMAN EXPERT ESCALATION & ASSISTANCE */}
                <HumanExpertAssistance
                  profile={result.profile}
                  confidence={result.confidenceExplanation}
                  evidenceCount={result.evidenceLocker?.totalItems || 0}
                />

                {/* STRATEGIC RECOMMENDATIONS */}
                {result.recommendations && result.recommendations.length > 0 && (
                  <section className="recommendations-section">
                    <div className="recommendations-header">
                      <span className="recommendations-icon">⚖️</span>
                      <div>
                        <h3>Strategic IP & Regulatory Recommendations</h3>
                        <p>Suggested action items prior to commercialization & patent filing.</p>
                      </div>
                    </div>

                    <div className="recommendations-list">
                      {result.recommendations.map((rec, i) => (
                        <div key={i} className="recommendation-item">
                          <span className="rec-bullet">{i + 1}</span>
                          <p className="rec-text">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {activeTab === 'expert_escalation' && (
              <div className="tab-pane-content">
                <HumanExpertAssistance
                  profile={result.profile}
                  confidence={result.confidenceExplanation}
                  evidenceCount={result.evidenceLocker?.totalItems || 0}
                />
              </div>
            )}

            {activeTab === 'passport' && result.ipPassport && (
              <div className="tab-pane-content">
                <AyuIPPassport passportData={result.ipPassport} />
              </div>
            )}

            {activeTab === 'markets' && result.globalMarkets && (
              <div className="tab-pane-content">
                <GlobalMarketSimulator simulatorData={result.globalMarkets} />
              </div>
            )}

            {activeTab === 'roadmap' && result.roadmap && (
              <div className="tab-pane-content">
                <CommercializationRoadmap roadmapData={result.roadmap} />
              </div>
            )}

            {activeTab === 'action_center' && result.actionCenter && (
              <div className="tab-pane-content">
                <ActionCenter actionCenterData={result.actionCenter} />
              </div>
            )}

            {activeTab === 'evidence_locker' && result.evidenceLocker && (
              <div className="tab-pane-content">
                <EvidenceLocker evidenceLockerData={result.evidenceLocker} />
              </div>
            )}

            {activeTab === 'chat_assistant' && (
              <div className="tab-pane-content">
                <AskAyuRaksha
                  currentFormData={formData}
                  activeDocumentName={activeDocForChat}
                />
              </div>
            )}

            {activeTab === 'doc_upload' && (
              <div className="tab-pane-content">
                <DocumentUpload onDocumentSelectForChat={handleDocumentSelectForChat} />
              </div>
            )}

            {activeTab === 'source_explorer' && (
              <div className="tab-pane-content">
                <SourceExplorer />
              </div>
            )}

            {activeTab === 'legal_timeline' && (
              <div className="tab-pane-content">
                <LegalTimeline />
              </div>
            )}

            {/* BOTTOM RETAKE CTA */}
            <div className="results-bottom-cta no-print">
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  setResult(null)
                  window.scrollTo({ top: 120, behavior: 'smooth' })
                }}
              >
                Modify Innovation Inputs <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* FORM VIEW */}
        {!isAnalyzing && !result && (
          <div className="analyzer-form-wrapper">
            <div className="analyzer-form-card">
              <div className="analyzer-form-title-bar">
                <div>
                  <span className="section-label">GUIDED ASSESSMENT</span>
                  <h2>Innovation Profile Questionnaire</h2>
                  <p>Provide specific formulation characteristics to evaluate novelty and risk.</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleAnalyze()
                }}
                className="analyzer-form"
              >
                {/* 1. PRODUCT TYPE */}
                <ProductTypeSelector
                  value={formData.productType}
                  onChange={(val: ProductType) => {
                    setFormData((prev) => ({ ...prev, productType: val }))
                    if (errors.productType) {
                      setErrors((prev) => ({ ...prev, productType: '' }))
                    }
                  }}
                  error={errors.productType}
                />

                {/* 2. INGREDIENTS */}
                <IngredientSearch
                  selectedIngredients={formData.ingredients}
                  onChange={(ingredients: string[]) => {
                    setFormData((prev) => ({ ...prev, ingredients }))
                    if (errors.ingredients) {
                      setErrors((prev) => ({ ...prev, ingredients: '' }))
                    }
                  }}
                  error={errors.ingredients}
                />

                {/* 3. INGREDIENT SOURCE */}
                <IngredientSourceSelector
                  value={formData.ingredientSource}
                  onChange={(val: IngredientSource) => {
                    setFormData((prev) => ({ ...prev, ingredientSource: val }))
                    if (errors.ingredientSource) {
                      setErrors((prev) => ({ ...prev, ingredientSource: '' }))
                    }
                  }}
                  error={errors.ingredientSource}
                />

                {/* 4. WHAT IS NOVEL? */}
                <NoveltySelector
                  selectedOptions={formData.noveltyElements}
                  onChange={(noveltyElements: NoveltyOption[]) => {
                    setFormData((prev) => ({ ...prev, noveltyElements }))
                    if (errors.noveltyElements) {
                      setErrors((prev) => ({ ...prev, noveltyElements: '' }))
                    }
                  }}
                  error={errors.noveltyElements}
                />

                {/* 5. TARGET MARKETS */}
                <TargetMarketSelector
                  selectedMarkets={formData.targetMarkets}
                  onChange={(targetMarkets: TargetMarket[]) => {
                    setFormData((prev) => ({ ...prev, targetMarkets }))
                    if (errors.targetMarkets) {
                      setErrors((prev) => ({ ...prev, targetMarkets: '' }))
                    }
                  }}
                  error={errors.targetMarkets}
                />

                {/* FINAL CTA */}
                <div className="analyzer-submit-box">
                  <div className="submit-box-info">
                    <strong>Ready to evaluate your innovation?</strong>
                    <p>
                      AYU-RAKSHA will run classification models and cross-reference
                      classical Samhitas & TKDL prior-art indices.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="analyze-submit-button"
                  >
                    <span>Analyze My Innovation</span>
                    <span className="analyze-submit-arrow">→</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <span className="brand-mark">✦</span>
          <strong>AYU-RAKSHA</strong>
        </div>
        <p>AI-Powered Ayurvedic Innovation & Traditional Knowledge Protection.</p>
        <span className="footer-copy">© 2026 AYU-RAKSHA</span>
      </footer>
    </div>
  )
}
