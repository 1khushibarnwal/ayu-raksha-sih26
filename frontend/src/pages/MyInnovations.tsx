import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  SavedInnovation,
  AnalysisVersionSnapshot,
  RiskLevel,
} from '../types/analyzer'
import {
  getSavedInnovations,
  deleteInnovation,
  saveOrUpdateInnovation,
} from '../services/innovationStoreService'
import { analyzeInnovation } from '../services/analyzerService'
import Navbar from '../components/Navbar'
import InnovationHistoryModal from '../components/analyzer/InnovationHistoryModal'

export default function MyInnovations() {
  const navigate = useNavigate()
  const [innovations, setInnovations] = useState<SavedInnovation[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRisk, setFilterRisk] = useState<string>('ALL')
  const [filterType, setFilterType] = useState<string>('ALL')
  const [selectedHistoryInv, setSelectedHistoryInv] = useState<SavedInnovation | null>(null)
  const [reanalyzingId, setReanalyzingId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    setInnovations(getSavedInnovations())
  }, [])

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  function handleDelete(id: string, name: string) {
    if (window.confirm(`Are you sure you want to remove "${name}" from your portfolio?`)) {
      deleteInnovation(id)
      setInnovations(getSavedInnovations())
      showToast(`Removed "${name}" from innovations portfolio.`)
    }
  }

  async function handleReanalyze(inv: SavedInnovation) {
    setReanalyzingId(inv.id)
    try {
      const freshResult = await analyzeInnovation(inv.currentFormData)
      const updated = saveOrUpdateInnovation(inv.currentFormData, freshResult, inv.id)
      setInnovations(getSavedInnovations())
      showToast(`Successfully re-analyzed "${inv.name}"! Version ${updated.currentVersion} created.`)
    } catch (err) {
      console.error('Re-analysis error:', err)
      showToast('Re-analysis failed. Please try again.')
    } finally {
      setReanalyzingId(null)
    }
  }

  function handleOpenWorkspace(inv: SavedInnovation) {
    // Save to active session storage so InnovationAnalyzer can load it
    sessionStorage.setItem('active_innovation_data', JSON.stringify(inv.currentFormData))
    sessionStorage.setItem('active_innovation_result', JSON.stringify(inv.currentResult))
    navigate('/analyzer')
  }

  function handleRestoreSnapshot(snapshot: AnalysisVersionSnapshot) {
    sessionStorage.setItem('active_innovation_data', JSON.stringify(snapshot.formData))
    sessionStorage.setItem('active_innovation_result', JSON.stringify(snapshot.result))
    navigate('/analyzer')
  }

  const filtered = innovations.filter((inv) => {
    const matchesQuery =
      inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inv.targetMarkets.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesRisk =
      filterRisk === 'ALL' ||
      inv.currentResult?.traditionalKnowledgeRisk?.level === filterRisk

    const matchesType = filterType === 'ALL' || inv.productType === filterType

    return matchesQuery && matchesRisk && matchesType
  })

  // Aggregate stats
  const totalCount = innovations.length
  const avgReadiness =
    totalCount > 0
      ? Math.round(
          innovations.reduce(
            (acc, i) => acc + (i.currentResult?.ipPassport?.overallReadiness || 70),
            0
          ) / totalCount
        )
      : 0
  const highRiskCount = innovations.filter(
    (i) => i.currentResult?.traditionalKnowledgeRisk?.level === 'HIGH'
  ).length

  return (
    <div className="page-wrapper innovations-page">
      <Navbar />

      <main className="container main-content">
        {toastMessage && (
          <div className="portfolio-toast">
            <span>✓</span> {toastMessage}
          </div>
        )}

        {/* HERO BANNER */}
        <section className="analyzer-banner no-print">
          <div className="analyzer-banner-content">
            <div className="analyzer-badge">
              <span className="badge-icon">💼</span>
              <span>INNOVATION PORTFOLIO & AUDIT HUB</span>
            </div>
            <h1 className="analyzer-banner-title">My Innovations</h1>
            <p className="analyzer-banner-desc">
              Manage your Ayurvedic formulation pipeline, track point-in-time version histories, monitor Section 3(p) risk shifts, and export verified statutory dossiers.
            </p>

            <div className="analyzer-banner-actions">
              <button
                type="button"
                className="analyzer-sample-fill-btn"
                onClick={() => {
                  sessionStorage.removeItem('active_innovation_data')
                  sessionStorage.removeItem('active_innovation_result')
                  navigate('/analyzer')
                }}
              >
                + Analyze New Innovation
              </button>
            </div>
          </div>
        </section>

        {/* STATS STRIP */}
        <div className="portfolio-stats-grid">
          <div className="portfolio-stat-card">
            <span className="stat-glyph">📦</span>
            <div>
              <span className="stat-number">{totalCount}</span>
              <span className="stat-label">Total Active Innovations</span>
            </div>
          </div>

          <div className="portfolio-stat-card">
            <span className="stat-glyph">📈</span>
            <div>
              <span className="stat-number">{avgReadiness}%</span>
              <span className="stat-label">Average IP Readiness</span>
            </div>
          </div>

          <div className="portfolio-stat-card">
            <span className="stat-glyph">🛡️</span>
            <div>
              <span className="stat-number">
                {innovations.reduce((acc, i) => acc + (i.currentResult?.ipPassport ? 3 : 0), 0)}
              </span>
              <span className="stat-label">Verified Statutory Badges</span>
            </div>
          </div>

          <div className="portfolio-stat-card">
            <span className="stat-glyph">⚠️</span>
            <div>
              <span className="stat-number">{highRiskCount}</span>
              <span className="stat-label">High Prior-Art Risks</span>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="portfolio-controls-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by innovation name, active botanicals, or target markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="portfolio-search-input"
            />
          </div>

          <div className="filter-dropdowns">
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="portfolio-filter-select"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="portfolio-filter-select"
            >
              <option value="ALL">All Product Types</option>
              <option value="Classical">Classical ASU</option>
              <option value="Proprietary">Proprietary</option>
              <option value="New formulation">New formulation</option>
              <option value="Phytopharmaceutical">Phytopharmaceutical</option>
              <option value="Ayurveda-Aahar">Ayurveda-Aahar</option>
              <option value="Cosmetic">Cosmetic</option>
            </select>
          </div>
        </div>

        {/* INNOVATIONS GRID */}
        {filtered.length === 0 ? (
          <div className="empty-portfolio-card">
            <span className="empty-icon">🍃</span>
            <h3>No innovations found</h3>
            <p>Try clearing your search query or analyze your first Ayurvedic product innovation.</p>
            <button
              type="button"
              className="primary-button"
              onClick={() => navigate('/analyzer')}
            >
              Start New Analysis →
            </button>
          </div>
        ) : (
          <div className="innovations-grid">
            {filtered.map((inv) => {
              const riskLevel: RiskLevel = inv.currentResult?.traditionalKnowledgeRisk?.level || 'MEDIUM'
              const readiness = inv.currentResult?.ipPassport?.overallReadiness || 75
              const confScore = inv.currentResult?.confidenceExplanation?.overallScore || 85
              const confLevel = inv.currentResult?.confidenceExplanation?.level || 'High'
              const isReanalyzing = reanalyzingId === inv.id

              return (
                <div key={inv.id} className="innovation-card">
                  {inv.isStale && (
                    <div className="stale-alert-banner">
                      <span>⚠️ Inputs modified — Re-analysis recommended</span>
                    </div>
                  )}

                  <div className="inv-card-header">
                    <div>
                      <div className="inv-card-badges">
                        <span className="inv-type-badge">{inv.productType}</span>
                        <span className="inv-version-badge">v{inv.currentVersion}</span>
                      </div>
                      <h3 className="inv-title">{inv.name}</h3>
                    </div>

                    <div className="inv-risk-badge-wrapper">
                      <span className={`risk-badge risk-${riskLevel.toLowerCase()}`}>
                        {riskLevel} RISK
                      </span>
                    </div>
                  </div>

                  {/* METRICS ROW */}
                  <div className="inv-metrics-bar">
                    <div className="inv-metric-col">
                      <span className="metric-lbl">Statutory Readiness</span>
                      <strong className="metric-val readiness-accent">{readiness}%</strong>
                    </div>
                    <div className="inv-metric-col">
                      <span className="metric-lbl">Confidence</span>
                      <strong className="metric-val">{confScore}% ({confLevel})</strong>
                    </div>
                    <div className="inv-metric-col">
                      <span className="metric-lbl">Target Markets</span>
                      <strong className="metric-val">{inv.targetMarkets.join(', ')}</strong>
                    </div>
                  </div>

                  {/* INGREDIENTS LIST */}
                  <div className="inv-ingredients-section">
                    <span className="section-micro-label">Botanical Actives ({inv.ingredients.length})</span>
                    <div className="inv-tags-row">
                      {inv.ingredients.map((ing, i) => (
                        <span key={i} className="inv-ing-pill">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* FOOTER & ACTIONS */}
                  <div className="inv-card-footer">
                    <div className="inv-date-stamp">
                      <span>Last Analyzed:</span>{' '}
                      <strong>
                        {new Date(inv.lastAnalyzedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </strong>
                    </div>

                    <div className="inv-actions-grid">
                      <button
                        type="button"
                        className="inv-action-btn btn-primary-inv"
                        onClick={() => handleOpenWorkspace(inv)}
                      >
                        📂 Open Workspace
                      </button>

                      <button
                        type="button"
                        className="inv-action-btn btn-secondary-inv"
                        disabled={isReanalyzing}
                        onClick={() => handleReanalyze(inv)}
                      >
                        {isReanalyzing ? 'Analyzing...' : '↺ Re-Analyze'}
                      </button>

                      <button
                        type="button"
                        className="inv-action-btn btn-secondary-inv"
                        onClick={() => setSelectedHistoryInv(inv)}
                      >
                        ⏱️ History ({inv.versions.length})
                      </button>

                      <button
                        type="button"
                        className="inv-action-btn btn-delete-inv"
                        onClick={() => handleDelete(inv.id, inv.name)}
                        title="Delete from portfolio"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* HISTORY MODAL */}
      {selectedHistoryInv && (
        <InnovationHistoryModal
          innovation={selectedHistoryInv}
          onClose={() => setSelectedHistoryInv(null)}
          onRestoreSnapshot={handleRestoreSnapshot}
        />
      )}

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
