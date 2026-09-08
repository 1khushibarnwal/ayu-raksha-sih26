import React, { useState } from 'react'
import type { GlobalMarketSimulatorResult, MarketCode, MarketReadinessData, MarketStatusItem } from '../../types/analyzer'
import EvidencePanel from './EvidencePanel'


interface GlobalMarketSimulatorProps {
  simulatorData: GlobalMarketSimulatorResult
}

export const GlobalMarketSimulator: React.FC<GlobalMarketSimulatorProps> = ({ simulatorData }) => {
  const [selectedMarketCode, setSelectedMarketCode] = useState<MarketCode>(simulatorData.selectedMarket || 'IN')
  const [activeEvidenceCategory, setActiveEvidenceCategory] = useState<string | null>(null)

  const activeMarket: MarketReadinessData =
    simulatorData.markets[selectedMarketCode] || simulatorData.markets.IN

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Ready':
      case 'Exempt':
        return 'status-badge-ready'
      case 'In Progress':
        return 'status-badge-progress'
      case 'Review Required':
        return 'status-badge-review'
      case 'Missing Items':
      case 'High Risk':
      case 'Not Ready':
        return 'status-badge-risk'
      default:
        return 'status-badge-neutral'
    }
  }

  const renderStatusSection = (
    title: string,
    icon: string,
    item: MarketStatusItem,
    categoryKey: string
  ) => {
    const isEvidenceOpen = activeEvidenceCategory === categoryKey

    return (
      <div className="market-dimension-card">
        <div className="dimension-header">
          <div className="dimension-title-group">
            <span className="dimension-icon">{icon}</span>
            <h4>{title}</h4>
          </div>
          <span className={`dimension-status-badge ${getStatusBadgeClass(item.status)}`}>
            {item.status}
          </span>
        </div>

        <p className="dimension-explanation">{item.explanation}</p>

        {item.recommendedAction && (
          <div className="dimension-action-box">
            <span className="action-tag">Recommended Action:</span> {item.recommendedAction}
          </div>
        )}

        {item.evidence && item.evidence.length > 0 && (
          <div className="dimension-evidence-container">
            <button
              type="button"
              className="evidence-toggle-btn"
              onClick={() => setActiveEvidenceCategory(isEvidenceOpen ? null : categoryKey)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {isEvidenceOpen ? 'Hide Statutory Evidence' : `View Statutory Sources (${item.evidence.length})`}
            </button>

            {isEvidenceOpen && (
              <div className="dimension-evidence-details">
                <EvidencePanel
                  evidenceList={item.evidence}
                  title={`Statutory Authority: ${title}`}
                />
              </div>
            )}

          </div>
        )}
      </div>
    )
  }

  const marketTabs: Array<{ code: MarketCode; label: string; flag: string }> = [
    { code: 'IN', label: 'India', flag: '🇮🇳' },
    { code: 'US', label: 'United States', flag: '🇺🇸' },
    { code: 'EU', label: 'European Union', flag: '🇪🇺' },
    { code: 'JP', label: 'Japan', flag: '🇯🇵' },
    { code: 'AU', label: 'Australia', flag: '🇦🇺' }
  ]

  return (
    <div className="global-market-simulator-container">
      <div className="market-simulator-header">
        <div className="simulator-title-area">
          <div className="feature-pill">Feature 11 • Sovereign Regulatory Simulator</div>
          <h2 className="section-title">Global Market Simulator</h2>
          <p className="section-subtitle">
            Jurisdiction-isolated readiness scoring across 5 sovereign regulatory & IP systems.
            Statutory criteria and compliance pathways are strictly separated per national regime.
          </p>
        </div>

        <div className="market-selector-tabs">
          {marketTabs.map((m) => (
            <button
              key={m.code}
              type="button"
              className={`market-tab-btn ${selectedMarketCode === m.code ? 'active' : ''}`}
              onClick={() => {
                setSelectedMarketCode(m.code)
                setActiveEvidenceCategory(null)
              }}
            >
              <span className="tab-flag">{m.flag}</span>
              <span className="tab-label">{m.label}</span>
              <span className="tab-score-chip">
                {simulatorData.markets[m.code]?.overallReadinessScore || 0}%
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Market Overview Banner */}
      <div className="market-overview-banner">
        <div className="banner-left">
          <div className="market-flag-display">{activeMarket.flag}</div>
          <div className="market-headline">
            <h3>{activeMarket.marketName} Market Dossier</h3>
            <span className="framework-badge">
              <strong>Governing Framework:</strong> {activeMarket.regulatoryFramework}
            </span>
          </div>
        </div>

        <div className="banner-right">
          <div className="score-dial">
            <div className="score-number">{activeMarket.overallReadinessScore}%</div>
            <div className="score-label">Readiness Index</div>
          </div>
        </div>
      </div>

      {/* 5 Dimensions Grid */}
      <div className="market-dimensions-grid">
        {renderStatusSection(
          '1. IP & Patent Protection',
          '🛡️',
          activeMarket.ip,
          `${selectedMarketCode}-ip`
        )}
        {renderStatusSection(
          '2. Regulatory & Licensing Pathway',
          '⚖️',
          activeMarket.regulatory,
          `${selectedMarketCode}-regulatory`
        )}
        {renderStatusSection(
          '3. Documentation & Dossier Filings',
          '📄',
          activeMarket.documentation,
          `${selectedMarketCode}-documentation`
        )}
        {renderStatusSection(
          '4. Traditional Knowledge & Prior Art Risk',
          '📜',
          activeMarket.traditionalKnowledge,
          `${selectedMarketCode}-tk`
        )}
        {renderStatusSection(
          '5. Market Entry Clearance',
          '🚀',
          activeMarket.marketEntry,
          `${selectedMarketCode}-entry`
        )}
      </div>

      {/* Market Statutory Citations Summary */}
      {activeMarket.evidence && activeMarket.evidence.length > 0 && (
        <div className="market-citations-footer">
          <h4>Authoritative Statutory Sources for {activeMarket.marketName}:</h4>
          <div className="citations-pills-list">
            {activeMarket.evidence.map((ev, idx) => (
              <a
                key={idx}
                href={ev.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="citation-link-pill"
              >
                <span>{ev.sourceTitle}</span>
                <span className="citation-auth">{ev.authority || ev.jurisdiction}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
