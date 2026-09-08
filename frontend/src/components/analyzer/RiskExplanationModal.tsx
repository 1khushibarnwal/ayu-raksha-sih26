import { useEffect } from 'react'
import type { RiskDimension } from '../../types/analyzer'
import EvidencePanel from './EvidencePanel'

interface RiskExplanationModalProps {
  dimension: RiskDimension | null
  onClose: () => void
}

export default function RiskExplanationModal({
  dimension,
  onClose,
}: RiskExplanationModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (dimension) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [dimension, onClose])

  if (!dimension) return null

  const levelColorMap: Record<string, { bg: string; badge: string; text: string }> = {
    HIGH: { bg: 'rgba(231, 76, 60, 0.08)', badge: '#e74c3c', text: '#c0392b' },
    MEDIUM: { bg: 'rgba(230, 126, 34, 0.08)', badge: '#e67e22', text: '#d35400' },
    LOW: { bg: 'rgba(47, 107, 79, 0.08)', badge: '#2f6b4f', text: '#2f6b4f' },
  }

  const theme = levelColorMap[dimension.level] || levelColorMap['MEDIUM']

  return (
    <div className="risk-modal-overlay" onClick={onClose}>
      <div
        className="risk-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="risk-modal-header">
          <div className="risk-modal-title-group">
            <span className="risk-modal-tag">RISK DIMENSION DEEP-DIVE</span>
            <h2>{dimension.name} Analysis</h2>
            <span className="risk-modal-sub">Weight in Overall Index: {dimension.weight}%</span>
          </div>

          <button
            type="button"
            className="risk-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="risk-modal-body">
          {/* TOP SCORE DISPLAY */}
          <div className="risk-modal-score-banner" style={{ backgroundColor: theme.bg }}>
            <div className="risk-modal-score-left">
              <span className="risk-modal-score-num" style={{ color: theme.text }}>
                {dimension.score} / 100
              </span>
              <span className="risk-modal-score-label">Calculated Risk Index</span>
            </div>
            <div
              className="risk-modal-level-badge"
              style={{ backgroundColor: theme.badge }}
            >
              {dimension.level} RISK
            </div>
          </div>

          {/* WHY THIS SCORE WAS ASSIGNED */}
          <div className="risk-modal-section">
            <h3 className="risk-modal-heading">💡 Why this score was assigned:</h3>
            <p className="risk-modal-paragraph">{dimension.whyAssigned}</p>
          </div>

          {/* EXPLAINABLE CONTRIBUTING FACTORS */}
          {dimension.factors && dimension.factors.length > 0 && (
            <div className="risk-modal-section">
              <h3 className="risk-modal-heading">📊 Explainable Contributing Factors:</h3>
              <div className="risk-factors-list">
                {dimension.factors.map((factor, idx) => (
                  <div key={idx} className="risk-factor-item">
                    <div className="risk-factor-top">
                      <strong className="risk-factor-name">{factor.factor}</strong>
                      <span className="risk-factor-contrib">+{factor.contribution} pts</span>
                    </div>
                    <p className="risk-factor-desc">{factor.description}</p>
                    {factor.evidence && factor.evidence.length > 0 && (
                      <EvidencePanel evidenceList={factor.evidence} title="Supporting Citation" compact />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RELEVANT STATUTE / RULE */}
          {dimension.relevantRule && (
            <div className="risk-modal-section">
              <h3 className="risk-modal-heading">📜 Relevant Statutory Rule / Reference:</h3>
              <div className="risk-statute-box">
                <code>{dimension.relevantRule}</code>
              </div>
            </div>
          )}

          {/* RECOMMENDED ACTION */}
          <div className="risk-modal-section">
            <h3 className="risk-modal-heading">⚡ Recommended Next Action:</h3>
            <div className="risk-recommended-action-box">
              <span className="action-icon">🎯</span>
              <p className="action-text">{dimension.recommendedAction}</p>
            </div>
          </div>

          {/* EVIDENCE / SOURCES */}
          <div className="risk-modal-section">
            <EvidencePanel evidenceList={dimension.evidence} title="Authoritative Precedent & Source Documents" />
          </div>
        </div>

        <div className="risk-modal-footer">
          <button type="button" className="risk-modal-dismiss-btn" onClick={onClose}>
            Close Deep-Dive
          </button>
        </div>
      </div>
    </div>
  )
}
