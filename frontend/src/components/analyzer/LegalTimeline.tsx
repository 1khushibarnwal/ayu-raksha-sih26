import React, { useState } from 'react'
import type { LegalTimelineAct } from '../../types/analyzer'
import { LegalTimelineService } from '../../services/legalTimelineService'


export const LegalTimeline: React.FC = () => {
  const [acts] = useState<LegalTimelineAct[]>(LegalTimelineService.getAllTimelines())
  const [selectedActId, setSelectedActId] = useState<string>(acts[0]?.actId || '')

  const selectedAct = acts.find((a) => a.actId === selectedActId) || acts[0]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Current':
        return 'timeline-status-current'
      case 'Superseded':
      case 'Historical':
        return 'timeline-status-historical'
      case 'Future / Scheduled':
        return 'timeline-status-future'
      default:
        return 'timeline-status-neutral'
    }
  }

  return (
    <div className="legal-timeline-container">
      <div className="timeline-header">
        <div className="title-area">
          <div className="feature-pill">Feature 20 • Statutory Evolution Tracker</div>
          <h2 className="section-title">Legal & Regulatory Timeline</h2>
          <p className="section-subtitle">
            Chronological statutory version history detailing amendments, superseded clauses, and "What changed?" comparative legal diffs.
          </p>
        </div>

        <div className="act-selector-pills">
          {acts.map((act) => (
            <button
              key={act.actId}
              type="button"
              className={`act-pill-btn ${selectedActId === act.actId ? 'active' : ''}`}
              onClick={() => setSelectedActId(act.actId)}
            >
              <span>{act.actName}</span>
              <span className="act-cat-tag">{act.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Act Timeline Track */}
      <div className="timeline-track-view">
        <div className="track-hero">
          <h3>{selectedAct.actName}</h3>
          <span className="jurisdiction-badge">Jurisdiction: {selectedAct.jurisdiction}</span>
        </div>

        <div className="versions-timeline-list">
          {selectedAct.versions.map((ver, idx) => {
            const isCurrent = ver.status === 'Current'

            return (
              <div key={ver.id} className={`version-timeline-card ${isCurrent ? 'is-current-version' : ''}`}>
                <div className="version-timeline-marker">
                  <div className="marker-dot">{isCurrent ? '★' : idx + 1}</div>
                  {idx < selectedAct.versions.length - 1 && <div className="marker-line" />}
                </div>

                <div className="version-content-card">
                  <div className="version-header-row">
                    <div className="version-title-group">
                      <h4>{ver.documentTitle}</h4>
                      <span className="version-badge">{ver.version}</span>
                    </div>

                    <div className="version-status-group">
                      <span className={`status-badge ${getStatusBadge(ver.status)}`}>
                        {ver.status}
                      </span>
                      <span className="effective-date-tag">Effective: {ver.effectiveDate}</span>
                    </div>
                  </div>

                  <div className="authority-row">
                    <strong>Enacting Authority:</strong> {ver.authority}
                  </div>

                  {/* "What Changed?" Comparative Diff Box */}
                  <div className="what-changed-diff-box">
                    <div className="diff-header">
                      <span className="diff-icon">⚖️</span>
                      <span className="diff-title">What Changed? — {ver.whatChanged.changeType}</span>
                    </div>

                    <div className="diff-grid">
                      <div className="diff-col previous-col">
                        <span className="col-label">Previous Statutory Position:</span>
                        <p>{ver.whatChanged.previous}</p>
                      </div>

                      <div className="diff-arrow">➔</div>

                      <div className="diff-col current-col">
                        <span className="col-label">Amended / Current Provision:</span>
                        <p>{ver.whatChanged.current}</p>
                      </div>
                    </div>

                    <div className="diff-source-footnote">
                      <strong>Legislative Instrument:</strong> {ver.whatChanged.source}
                    </div>
                  </div>

                  {/* Relevant Provisions */}
                  {ver.relevantProvisions && ver.relevantProvisions.length > 0 && (
                    <div className="provisions-row">
                      <span className="prov-label">Key Provisions:</span>
                      <div className="prov-chips">
                        {ver.relevantProvisions.map((p, pIdx) => (
                          <span key={pIdx} className="prov-chip">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {ver.sourceUrl && (
                    <div className="version-link-row">
                      <a
                        href={ver.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="official-gazette-link"
                      >
                        Official Gazette Notification ↗
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
