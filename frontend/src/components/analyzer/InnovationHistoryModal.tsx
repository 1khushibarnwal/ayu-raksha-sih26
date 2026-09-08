import type { SavedInnovation, AnalysisVersionSnapshot } from '../../types/analyzer'

interface InnovationHistoryModalProps {
  innovation: SavedInnovation
  onClose: () => void
  onRestoreSnapshot?: (snapshot: AnalysisVersionSnapshot) => void
}

export function InnovationHistoryModal({
  innovation,
  onClose,
  onRestoreSnapshot,
}: InnovationHistoryModalProps) {
  const versions = innovation.versions || []

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-badge-row">
              <span className="badge-history-version">VERSION TIMELINE ({versions.length} Snapshots)</span>
              <span className="modal-category-label">AUDIT TRAIL</span>
            </div>
            <h3 className="modal-title">{innovation.name} — Version History</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body history-body">
          <p className="history-intro">
            Every re-analysis creates an immutable point-in-time snapshot of the formulation inputs, risk levels, and statutory readiness score.
          </p>

          <div className="version-timeline-list">
            {versions.map((ver, idx) => {
              const isCurrent = ver.version === innovation.currentVersion
              const dateStr = new Date(ver.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })

              return (
                <div
                  key={ver.version}
                  className={`version-timeline-item ${isCurrent ? 'current-version-item' : ''}`}
                >
                  <div className="version-node">
                    <span className="version-number-tag">v{ver.version}</span>
                    {idx < versions.length - 1 && <div className="version-line" />}
                  </div>

                  <div className="version-card">
                    <div className="version-card-top">
                      <div>
                        <div className="version-title-row">
                          <strong className="ver-title">Version {ver.version} Analysis</strong>
                          {isCurrent && <span className="current-badge">CURRENT ACTIVE</span>}
                        </div>
                        <span className="version-date">Analyzed on {dateStr}</span>
                      </div>

                      <div className="version-metrics-summary">
                        <div className="ver-metric">
                          <span className="ver-label">Readiness</span>
                          <span className="ver-val readiness-val">{ver.readinessScore}%</span>
                        </div>
                        <div className="ver-metric">
                          <span className="ver-label">Risk</span>
                          <span
                            className={`ver-val risk-${ver.riskLevel.toLowerCase()}`}
                          >
                            {ver.riskLevel}
                          </span>
                        </div>
                        <div className="ver-metric">
                          <span className="ver-label">Confidence</span>
                          <span className="ver-val conf-val">{ver.confidenceScore}%</span>
                        </div>
                      </div>
                    </div>

                    <p className="version-summary-text">{ver.summary}</p>

                    <div className="version-details-grid">
                      <div className="detail-box">
                        <span className="detail-heading">Actives / Ingredients ({ver.formData.ingredients.length})</span>
                        <div className="ver-tags">
                          {ver.formData.ingredients.map((ing, i) => (
                            <span key={i} className="ver-tag-pill">
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="detail-box">
                        <span className="detail-heading">Novelty Claimed</span>
                        <div className="ver-tags">
                          {ver.formData.noveltyElements.map((nov, i) => (
                            <span key={i} className="ver-tag-pill novelty-tag">
                              {nov}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {onRestoreSnapshot && !isCurrent && (
                      <div className="version-restore-row">
                        <button
                          type="button"
                          className="secondary-button restore-btn"
                          onClick={() => {
                            onRestoreSnapshot(ver)
                            onClose()
                          }}
                        >
                          ↺ Load Version {ver.version} in Analyzer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="secondary-button" onClick={onClose}>
            Close History
          </button>
        </div>
      </div>
    </div>
  )
}
export default InnovationHistoryModal
