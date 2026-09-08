import { useState } from 'react'
import type { ConfidenceExplanation } from '../../types/analyzer'

interface ConfidenceIndicatorProps {
  confidence?: ConfidenceExplanation
  onEscalateToExpert?: () => void
}

export function ConfidenceIndicator({
  confidence,
  onEscalateToExpert,
}: ConfidenceIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!confidence) {
    return null
  }

  const { level, overallScore, isAbstaining, abstentionReason, factors = [], knownFacts = [], missingInformation = [], recommendedAction } = confidence

  const levelColor =
    level === 'High'
      ? { bg: '#eef8f2', text: '#1b693f', border: '#b7e4c7', icon: '🛡️' }
      : level === 'Moderate'
      ? { bg: '#fff9e6', text: '#976100', border: '#ffe08a', icon: '⚠️' }
      : { bg: '#fdf2f2', text: '#c53030', border: '#fecaca', icon: '🛑' }

  return (
    <>
      <div className="confidence-pill-container">
        <button
          type="button"
          className="confidence-trigger-pill"
          style={{
            backgroundColor: levelColor.bg,
            color: levelColor.text,
            borderColor: levelColor.border,
          }}
          onClick={() => setIsOpen(true)}
          title="Click to view explainable source authority and confidence breakdown"
        >
          <span className="confidence-icon">{levelColor.icon}</span>
          <span className="confidence-label">
            Confidence: <strong>{overallScore}% ({level})</strong>
          </span>
          <span className="confidence-info-glyph">ⓘ Why?</span>
        </button>

        {isAbstaining && (
          <div className="confidence-abstention-tag">
            <span>⚠️ Evidence Gaps Detected</span>
          </div>
        )}
      </div>

      {/* EXPLAINABILITY MODAL */}
      {isOpen && (
        <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
          <div
            className="modal-card confidence-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <div className="modal-badge-row">
                  <span
                    className="confidence-level-tag"
                    style={{
                      backgroundColor: levelColor.bg,
                      color: levelColor.text,
                      borderColor: levelColor.border,
                    }}
                  >
                    {levelColor.icon} {level} Evidence Confidence ({overallScore}/100)
                  </span>
                  <span className="modal-category-label">EXPLAINABLE AI REASONING</span>
                </div>
                <h3 className="modal-title">Source Authority & Evidence Confidence Breakdown</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* RISK VS CONFIDENCE NOTICE */}
              <div className="concept-distinction-banner">
                <div className="concept-col">
                  <strong>⚠️ Risk Assessment</strong>
                  <p>Likelihood of legal obstacles (e.g., Section 3(p) TKDL citations or NBA scrutiny).</p>
                </div>
                <div className="concept-divider" />
                <div className="concept-col">
                  <strong>🛡️ Evidence Confidence</strong>
                  <p>Completeness, statutory authority, and reliability of the data backing this dossier.</p>
                </div>
              </div>

              {/* ABSTENTION WARNING IF APPLICABLE */}
              {isAbstaining && (
                <div className="abstention-alert-box">
                  <div className="abstention-icon">🛑</div>
                  <div className="abstention-text">
                    <strong>Statutory Abstention Advisory</strong>
                    <p>{abstentionReason}</p>
                    <p className="abstention-sub">
                      AYU-RAKSHA adheres to strict legal safety guardrails and abstains from asserting definitive statutory clearance when primary botanical or sourcing credentials are missing.
                    </p>
                  </div>
                </div>
              )}

              {/* FACTOR SCORING BARS */}
              <div className="confidence-factors-section">
                <h4>Confidence Dimension Breakdown</h4>
                <div className="factors-list">
                  {factors.map((factor) => (
                    <div key={factor.id} className="factor-row">
                      <div className="factor-header">
                        <span className="factor-name">{factor.name}</span>
                        <span className="factor-score">
                          Weight: {Math.round(factor.weight * 100)}% | <strong>{factor.score}%</strong>
                        </span>
                      </div>
                      <div className="factor-bar-bg">
                        <div
                          className="factor-bar-fill"
                          style={{
                            width: `${factor.score}%`,
                            backgroundColor:
                              factor.status === 'positive'
                                ? '#2f6b4f'
                                : factor.status === 'warning'
                                ? '#d97706'
                                : '#dc2626',
                          }}
                        />
                      </div>
                      <p className="factor-desc">{factor.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* KNOWN FACTS VS MISSING INFO */}
              <div className="evidence-audit-grid">
                <div className="audit-col known-facts">
                  <h5>✓ Verified Established Facts ({knownFacts.length})</h5>
                  <ul>
                    {knownFacts.map((fact, idx) => (
                      <li key={idx}>{fact}</li>
                    ))}
                  </ul>
                </div>
                <div className="audit-col missing-facts">
                  <h5>⚠️ Data Gaps / Items for Confirmation ({missingInformation.length})</h5>
                  {missingInformation.length > 0 ? (
                    <ul>
                      {missingInformation.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="audit-clean">No critical evidentiary gaps identified.</p>
                  )}
                </div>
              </div>

              {/* RECOMMENDED ACTION */}
              <div className="recommended-action-box">
                <span className="action-tag">Recommended Next Action</span>
                <p>{recommendedAction}</p>
              </div>
            </div>

            <div className="modal-footer">
              {onEscalateToExpert && (
                <button
                  type="button"
                  className="primary-button expert-cta-btn"
                  onClick={() => {
                    setIsOpen(false)
                    onEscalateToExpert()
                  }}
                >
                  ⚖️ Escalate to Specialized Ayurvedic IP Expert →
                </button>
              )}
              <button
                type="button"
                className="secondary-button"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default ConfidenceIndicator
