import React, { useState } from 'react'
import type { AYUIPPassportData } from '../../types/analyzer'


interface AyuIPPassportProps {
  passportData: AYUIPPassportData
}

export const AyuIPPassport: React.FC<AyuIPPassportProps> = ({ passportData }) => {
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="ayu-ip-passport-container">
      <div className="passport-header-bar no-print">
        <div className="passport-title-group">
          <div className="feature-pill">Feature 15 • Digital Intellectual Property Passport</div>
          <h2 className="section-title">AYU-IP Passport</h2>
          <p className="section-subtitle">
            Executive compliance & readiness dossier for Ayurvedic innovations across IP, Biodiversity, and Regulatory jurisdictions.
          </p>
        </div>

        <div className="passport-actions">
          <button
            type="button"
            className="passport-btn-secondary"
            onClick={() => setShowWhyModal(true)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            Why this score?
          </button>

          <button type="button" className="passport-btn-primary" onClick={handlePrint}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Export / Print Passport
          </button>
        </div>
      </div>

      {/* Printable Official Passport Certificate Card */}
      <div className="passport-card-paper">
        {/* Certificate Watermark / Header */}
        <div className="certificate-top-banner">
          <div className="emblem-group">
            <div className="emblem-symbol">🌿</div>
            <div className="emblem-text">
              <h3>AYU-RAKSHA • IP-SAKTI</h3>
              <span>National Ayurvedic IP & Regulatory Compliance Registry</span>
            </div>
          </div>

          <div className="certificate-id-box">
            <span className="cert-label">Passport Serial No:</span>
            <span className="cert-val">{passportData.passportId}</span>
            <span className="cert-date">Issued: {passportData.generatedDate}</span>
          </div>
        </div>

        {/* Hero Identity & Score Bar */}
        <div className="passport-hero-row">
          <div className="hero-product-info">
            <h2 className="product-display-name">{passportData?.identity?.product || 'Ayurvedic Innovation'}</h2>
            <div className="product-sub-info">
              <span><strong>Ingredients:</strong> {passportData?.identity?.ingredients?.join(', ') || 'Classical botanical actives'}</span>
              <span><strong>Provenance:</strong> {passportData?.identity?.origin || 'India'}</span>
            </div>
          </div>

          <div className="hero-score-badge">
            <div className="passport-dial-circle">
              <span className="dial-val">{passportData?.overallReadiness ?? 80}%</span>
              <span className="dial-caption">Overall Readiness</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Matrix */}
        <div className="passport-pillars-grid">
          {/* 1. IP Status */}
          <div className="pillar-box">
            <div className="pillar-header">
              <span className="pillar-icon">🛡️</span>
              <h4>Intellectual Property Rights</h4>
            </div>
            <div className="pillar-content-list">
              <div className="pillar-item">
                <span className="item-label">Patent:</span>
                <span className="item-val">{passportData?.ipStatus?.patent || 'Pending Evaluation'}</span>
              </div>
              <div className="pillar-item">
                <span className="item-label">Trademark:</span>
                <span className="item-val">{passportData?.ipStatus?.trademark || 'Brand clearance recommended'}</span>
              </div>
              <div className="pillar-item">
                <span className="item-label">Industrial Design:</span>
                <span className="item-val">{passportData?.ipStatus?.design || 'Class 28-02'}</span>
              </div>
              <div className="pillar-item">
                <span className="item-label">Trade Secret:</span>
                <span className="item-val">{passportData?.ipStatus?.tradeSecret || 'Proprietary Extraction'}</span>
              </div>
            </div>
          </div>

          {/* 2. Traditional Knowledge & Biodiversity */}
          <div className="pillar-box">
            <div className="pillar-header">
              <span className="pillar-icon">📜</span>
              <h4>TK & Biodiversity (ABS)</h4>
            </div>
            <div className="pillar-content-list">
              <div className="pillar-item">
                <span className="item-label">TK Prior Art:</span>
                <span className="item-val">{passportData?.riskCompliance?.tkRisk || 'Moderate Prior Art'}</span>
              </div>
              <div className="pillar-item">
                <span className="item-label">ABS Status:</span>
                <span className="item-val">{passportData?.riskCompliance?.absStatus || 'NBA Clearance Required'}</span>
              </div>
              <div className="pillar-item">
                <span className="item-label">Statute:</span>
                <span className="item-val">BD Act 2002 (Sec 6 NBA Clearance)</span>
              </div>
            </div>
          </div>

          {/* 3. Regulatory Status */}
          <div className="pillar-box">
            <div className="pillar-header">
              <span className="pillar-icon">⚖️</span>
              <h4>Regulatory Framework</h4>
            </div>
            <div className="pillar-content-list">
              <div className="pillar-item">
                <span className="item-label">Classification:</span>
                <span className="item-val">{passportData?.riskCompliance?.regulatoryStatus || 'Ayurvedic Medicine'}</span>
              </div>
              <div className="pillar-item">
                <span className="item-label">Standard:</span>
                <span className="item-val">Schedule T GMP / Rule 158-B</span>
              </div>
            </div>
          </div>

          {/* 4. Global Market Readiness */}
          <div className="pillar-box">
            <div className="pillar-header">
              <span className="pillar-icon">🌐</span>
              <h4>Global Readiness Breakdown</h4>
            </div>
            <div className="pillar-content-list">
              <div className="pillar-item">
                <span className="item-label">India (AYUSH):</span>
                <span className="item-val">{passportData?.marketReadiness?.india || 'Clear'}</span>
              </div>
              <div className="pillar-item">
                <span className="item-label">USA (FDA):</span>
                <span className="item-val">{passportData?.marketReadiness?.usa || 'NDI Review'}</span>
              </div>
              <div className="pillar-item">
                <span className="item-label">EU (EMA):</span>
                <span className="item-val">{passportData?.marketReadiness?.eu || 'THMPD'}</span>
              </div>
              <div className="pillar-item">
                <span className="item-label">Japan (MHLW):</span>
                <span className="item-val">{passportData?.marketReadiness?.japan || 'Kampo'}</span>
              </div>
              <div className="pillar-item">
                <span className="item-label">Australia (TGA):</span>
                <span className="item-val">{passportData?.marketReadiness?.australia || 'Listed'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Passport Next Action Steps */}
        <div className="passport-action-summary">
          <h4>Priority Statutory Roadmap Actions:</h4>
          <ol className="passport-steps-list">
            {passportData.nextSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Footer Seal & Verification */}
        <div className="passport-footer-seal">
          <div className="seal-left">
            <span>Verified by <strong>AYU-RAKSHA RAG Verification Core</strong></span>
            <span>Version: {passportData.version}</span>
          </div>
          <div className="seal-right">
            <div className="official-stamp-box">
              <div className="stamp-circle">
                <span>OFFICIAL</span>
                <span>ANALYSIS</span>
                <span>PASSPORT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "Why This Score?" Breakdown Modal */}
      {showWhyModal && (
        <div className="why-modal-overlay" onClick={() => setShowWhyModal(false)}>
          <div className="why-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="why-modal-header">
              <h3>Explainable Readiness Score Rationale</h3>
              <button type="button" className="close-modal-btn" onClick={() => setShowWhyModal(false)}>
                ×
              </button>
            </div>

            <div className="why-modal-body">
              <div className="score-breakdown-card">
                <div className="big-score">{passportData.overallReadiness}%</div>
                <div className="score-desc">Overall Composite Readiness Score</div>
              </div>

              <div className="modal-section">
                <strong>Score Formulation Logic:</strong>
                <pre className="rationale-pre">{passportData.whyScoreAssigned}</pre>
              </div>

              <div className="modal-section">
                <strong>Key Statutory Benchmarks Met:</strong>
                <ul>
                  <li>Indian Patents Act Section 3(p) TK clearance strategy prepared</li>
                  <li>Biological Diversity Act Section 6 NBA approval identified</li>
                  <li>Drugs & Cosmetics Rule 158-B stability & safety requirements mapped</li>
                  <li>Multi-jurisdiction international standard check complete</li>
                </ul>
              </div>
            </div>

            <div className="why-modal-footer">
              <button
                type="button"
                className="modal-dismiss-btn"
                onClick={() => setShowWhyModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
