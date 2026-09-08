import { useState } from 'react'
import type { IPRiskCenterResult, RiskDimension } from '../../types/analyzer'
import RiskDimensionCard from './RiskDimensionCard'
import RiskExplanationModal from './RiskExplanationModal'

interface IPRiskCenterProps {
  riskCenter: IPRiskCenterResult
}

export default function IPRiskCenter({ riskCenter }: IPRiskCenterProps) {
  const [selectedDimension, setSelectedDimension] = useState<RiskDimension | null>(null)

  const overallTheme =
    riskCenter.overallLevel === 'HIGH'
      ? { badge: 'risk-badge-high', color: '#c0392b' }
      : riskCenter.overallLevel === 'MEDIUM'
      ? { badge: 'risk-badge-med', color: '#d35400' }
      : { badge: 'risk-badge-low', color: '#2f6b4f' }

  return (
    <section className="ip-risk-center-section">
      {/* SECTION HEADER */}
      <div className="section-header-wrap">
        <div className="section-title-box">
          <span className="section-label">FEATURE 8 — IP RISK CENTER</span>
          <h2>Multi-Dimensional IP & Regulatory Risk Matrix</h2>
          <p>
            Explainable risk indexing computed across 5 regulatory dimensions. Click any dimension to inspect
            the factor contribution breakdown, case law citations, and statutory references.
          </p>
        </div>

        <div className="risk-disclaimer-tag">
          <span>⚖️ Analytical Risk Indicators (Not Definitive Legal Rulings)</span>
        </div>
      </div>

      {/* OVERALL SCORE BANNER */}
      <div className="overall-risk-banner">
        <div className="overall-score-left">
          <span className="overall-score-label">Overall IP Risk Index</span>
          <div className="overall-score-row">
            <span className="overall-score-number" style={{ color: overallTheme.color }}>
              {riskCenter.overallScore}
            </span>
            <span className="overall-score-max">/ 100</span>
            <span className={`overall-level-pill ${overallTheme.badge}`}>
              {riskCenter.overallLevel} RISK
            </span>
          </div>
          <p className="overall-score-summary">{riskCenter.overallSummary}</p>
        </div>

        <div className="overall-score-right">
          <div className="risk-pillars-legend">
            <span>5 Analyzed Dimensions</span>
            <div className="legend-dots">
              <span className="legend-item"><span className="dot dot-high" /> High: &gt;70</span>
              <span className="legend-item"><span className="dot dot-med" /> Med: 40-70</span>
              <span className="legend-item"><span className="dot dot-low" /> Low: &lt;40</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 RISK DIMENSION CARDS */}
      <div className="risk-dimensions-grid">
        {(riskCenter?.dimensions || []).map((dim) => (
          <RiskDimensionCard
            key={dim.id}
            dimension={dim}
            onClick={() => setSelectedDimension(dim)}
          />
        ))}
      </div>

      {/* EXPANDABLE DEEP-DIVE MODAL */}
      {selectedDimension && (
        <RiskExplanationModal
          dimension={selectedDimension}
          onClose={() => setSelectedDimension(null)}
        />
      )}
    </section>
  )
}
