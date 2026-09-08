import { useState } from 'react'
import type {
  RegulatoryNavigatorResult,
  InnovationProfile,
  AIClassification,
  RequirementStatus,
} from '../../types/analyzer'
import EvidencePanel from './EvidencePanel'

interface RegulatoryNavigatorProps {
  navigatorData: RegulatoryNavigatorResult
  profile: InnovationProfile
  classification: AIClassification
}

export default function RegulatoryNavigator({
  navigatorData,
  profile,
  classification,
}: RegulatoryNavigatorProps) {
  const [currentStep, setCurrentStep] = useState<number>(1)

  const steps = [
    { num: 1, label: 'Product', icon: '📦' },
    { num: 2, label: 'Classification', icon: '🏷️' },
    { num: 3, label: 'Pathway', icon: '🛣️' },
    { num: 4, label: 'Requirements', icon: '📋' },
    { num: 5, label: 'Documents', icon: '📄' },
    { num: 6, label: 'Compliance', icon: '🛡️' },
  ]

  const statusBadgeMap: Record<
    RequirementStatus,
    { badgeClass: string; icon: string }
  > = {
    Complete: { badgeClass: 'req-complete', icon: '✓' },
    'Review Required': { badgeClass: 'req-review', icon: '⚠️' },
    Missing: { badgeClass: 'req-missing', icon: '✕' },
    'Not Applicable': { badgeClass: 'req-na', icon: '—' },
    Uncertain: { badgeClass: 'req-uncertain', icon: '❓' },
  }

  return (
    <section className="regulatory-navigator-section">
      {/* SECTION HEADER */}
      <div className="section-header-wrap">
        <div className="section-title-box">
          <span className="section-label">FEATURE 10 — REGULATORY NAVIGATOR</span>
          <h2>Interactive 6-Step Regulatory Decision Pathway</h2>
          <p>
            Guided compliance wizard mapping product attributes through statutory classification,
            manufacturing standards, dossier documentation, and market authorization requirements.
          </p>
        </div>

        <div className="navigator-jurisdiction-pill">
          <span>🏛️ Jurisdiction: {navigatorData.jurisdiction}</span>
        </div>
      </div>

      {/* STEP PROGRESS WIZARD BAR */}
      <div className="navigator-progress-card">
        <div className="navigator-steps-bar">
          {steps.map((step) => {
            const isCurrent = currentStep === step.num
            const isDone = currentStep > step.num
            return (
              <button
                key={step.num}
                type="button"
                className={`nav-step-btn ${isCurrent ? 'active' : ''} ${isDone ? 'done' : ''}`}
                onClick={() => setCurrentStep(step.num)}
              >
                <div className="nav-step-circle">
                  {isDone ? '✓' : step.icon}
                </div>
                <div className="nav-step-text">
                  <span className="nav-step-num">Step {step.num}</span>
                  <span className="nav-step-name">{step.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* STEP 1 — PRODUCT */}
      {currentStep === 1 && (
        <div className="navigator-step-content">
          <div className="step-content-header">
            <span className="step-badge">STEP 1 OF 6</span>
            <h3>Product Information & Botanical Matrix</h3>
            <p>Characteristics submitted during Innovation Assessment.</p>
          </div>

          <div className="product-step-grid">
            <div className="step-info-card">
              <span className="step-card-lbl">Product Category</span>
              <strong>{profile.productType}</strong>
            </div>

            <div className="step-info-card">
              <span className="step-card-lbl">Botanical Source Provenance</span>
              <strong>{profile.ingredientSource}</strong>
            </div>

            <div className="step-info-card step-card-full">
              <span className="step-card-lbl">Active Botanical Ingredients</span>
              <div className="step-chips-wrap">
                {profile.ingredients.map((ing) => (
                  <span key={ing} className="step-chip">
                    🌿 {ing}
                  </span>
                ))}
              </div>
            </div>

            <div className="step-info-card step-card-full">
              <span className="step-card-lbl">Novelty Elements Claimed</span>
              <div className="step-chips-wrap">
                {profile.noveltyElements.map((nov) => (
                  <span key={nov} className="step-chip step-chip-accent">
                    ✦ {nov}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="step-nav-footer">
            <button
              type="button"
              className="primary-button"
              onClick={() => setCurrentStep(2)}
            >
              Proceed to Classification (Step 2) <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 — CLASSIFICATION */}
      {currentStep === 2 && (
        <div className="navigator-step-content">
          <div className="step-content-header">
            <span className="step-badge">STEP 2 OF 6</span>
            <h3>Product Regulatory Classification</h3>
            <p>Statutory classification derived from formulation attributes.</p>
          </div>

          <div className="classification-step-box">
            <div className="step-class-header">
              <span className="step-class-tag">DETERMINED CLASSIFICATION</span>
              <h4>{classification.classification}</h4>
              <span className="step-class-reg">
                📋 Statutory Category: <strong>{classification.regulatoryCategory}</strong>
              </span>
            </div>

            <div className="step-class-why">
              <strong>Why this classification?</strong>
              <p>{classification.explanation}</p>
            </div>
          </div>

          <div className="step-nav-footer">
            <button
              type="button"
              className="step-back-btn"
              onClick={() => setCurrentStep(1)}
            >
              ← Back to Product
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => setCurrentStep(3)}
            >
              Proceed to Regulatory Pathway (Step 3) <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — REGULATORY PATHWAY */}
      {currentStep === 3 && (
        <div className="navigator-step-content">
          <div className="step-content-header">
            <span className="step-badge">STEP 3 OF 6</span>
            <h3>Applicable Regulatory Pathway</h3>
            <p>Official licensing and approval pathway recommended for market launch.</p>
          </div>

          <div className="pathway-step-card">
            <div className="pathway-step-badge">
              <span>🛣️ RECOMMENDED AUTHORIZATION PATHWAY</span>
            </div>
            <h4>{navigatorData.pathway}</h4>

            <div className="pathway-reason-block">
              <strong>Statutory Rationale:</strong>
              <p>{navigatorData.pathwayReason}</p>
            </div>

            <div className="pathway-evidence-wrap">
              <EvidencePanel evidenceList={navigatorData.pathwayEvidence} title="Regulatory Gazette & Rule Citations" />
            </div>
          </div>

          <div className="step-nav-footer">
            <button
              type="button"
              className="step-back-btn"
              onClick={() => setCurrentStep(2)}
            >
              ← Back to Classification
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => setCurrentStep(4)}
            >
              Proceed to Requirements Checklist (Step 4) <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 — REQUIREMENTS */}
      {currentStep === 4 && (
        <div className="navigator-step-content">
          <div className="step-content-header">
            <span className="step-badge">STEP 4 OF 6</span>
            <h3>Statutory Requirements Checklist</h3>
            <p>Verification of mandatory compliance checkpoints.</p>
          </div>

          <div className="requirements-checklist">
            {navigatorData.requirements.map((req) => {
              const currentStatus = statusBadgeMap[req.status] || statusBadgeMap['Uncertain']
              return (
                <div key={req.id} className="requirement-check-item">
                  <div className="req-item-top">
                    <div className="req-item-title-group">
                      <span className="req-category-tag">{req.category}</span>
                      <h4 className="req-item-name">{req.name}</h4>
                    </div>

                    <div className={`req-status-pill ${currentStatus.badgeClass}`}>
                      <span>{currentStatus.icon}</span>
                      <span>{req.status}</span>
                    </div>
                  </div>

                  <p className="req-item-explanation">{req.explanation}</p>

                  {req.evidence && req.evidence.length > 0 && (
                    <div className="req-evidence-box">
                      <EvidencePanel evidenceList={req.evidence} title="Regulatory Standard Reference" compact />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="step-nav-footer">
            <button
              type="button"
              className="step-back-btn"
              onClick={() => setCurrentStep(3)}
            >
              ← Back to Pathway
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => setCurrentStep(5)}
            >
              Proceed to Required Documents (Step 5) <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5 — DOCUMENTS */}
      {currentStep === 5 && (
        <div className="navigator-step-content">
          <div className="step-content-header">
            <span className="step-badge">STEP 5 OF 6</span>
            <h3>Required Dossier Documentation</h3>
            <p>Mandatory documentation files required for submission to State Licensing Authorities.</p>
          </div>

          <div className="documents-list-grid">
            {navigatorData.documents.map((doc) => (
              <div key={doc.id} className="document-card-item">
                <div className="doc-card-top">
                  <span className="doc-icon">📄</span>
                  <div className="doc-title-wrap">
                    <h4 className="doc-name">{doc.name}</h4>
                    <span className="doc-status-badge">{doc.status}</span>
                  </div>
                </div>

                <p className="doc-reason">{doc.reason}</p>

                {doc.evidence && doc.evidence.length > 0 && (
                  <EvidencePanel evidenceList={doc.evidence} title="Statutory Filing Monograph" compact />
                )}
              </div>
            ))}
          </div>

          <div className="step-nav-footer">
            <button
              type="button"
              className="step-back-btn"
              onClick={() => setCurrentStep(4)}
            >
              ← Back to Requirements
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => setCurrentStep(6)}
            >
              View Compliance Summary (Step 6) <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 6 — COMPLIANCE SUMMARY */}
      {currentStep === 6 && (
        <div className="navigator-step-content">
          <div className="step-content-header">
            <span className="step-badge">STEP 6 OF 6</span>
            <h3>Final Guided Compliance Summary</h3>
            <p>Overall readiness overview and prioritized action plan.</p>
          </div>

          {/* METRICS ROW */}
          <div className="compliance-metrics-row">
            <div className="compliance-metric-box metric-done">
              <span className="metric-num">{navigatorData.complianceSummary.completedCount}</span>
              <span className="metric-lbl">Completed Checkpoints</span>
            </div>
            <div className="compliance-metric-box metric-review">
              <span className="metric-num">{navigatorData.complianceSummary.reviewRequiredCount}</span>
              <span className="metric-lbl">Review Required</span>
            </div>
            <div className="compliance-metric-box metric-pending">
              <span className="metric-num">{navigatorData.complianceSummary.pendingCount}</span>
              <span className="metric-lbl">Pending Documents</span>
            </div>
          </div>

          {/* WARNINGS */}
          {navigatorData.complianceSummary.warnings.length > 0 && (
            <div className="compliance-warnings-card">
              <div className="warnings-header">
                <span className="warning-icon">⚠️</span>
                <strong>Critical Statutory Notices:</strong>
              </div>
              <ul className="warnings-list">
                {navigatorData.complianceSummary.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* RECOMMENDED NEXT STEPS */}
          <div className="compliance-next-steps-card">
            <div className="next-steps-header">
              <span className="next-icon">🎯</span>
              <strong>Recommended Execution Roadmap:</strong>
            </div>
            <div className="next-steps-list">
              {navigatorData.complianceSummary.nextSteps.map((step, idx) => (
                <div key={idx} className="roadmap-step-item">
                  <span className="roadmap-num">{idx + 1}</span>
                  <p className="roadmap-text">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="step-nav-footer">
            <button
              type="button"
              className="step-back-btn"
              onClick={() => setCurrentStep(5)}
            >
              ← Back to Documents
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => setCurrentStep(1)}
            >
              Restart Navigator Walkthrough <span>↺</span>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
