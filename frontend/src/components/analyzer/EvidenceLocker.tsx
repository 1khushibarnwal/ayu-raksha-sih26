import React, { useState, useMemo } from 'react'
import type { EvidenceLockerResult, EvidenceLockerItem } from '../../types/analyzer'


interface EvidenceLockerProps {
  evidenceLockerData: EvidenceLockerResult
}

export const EvidenceLocker: React.FC<EvidenceLockerProps> = ({ evidenceLockerData }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [whyModalItem, setWhyModalItem] = useState<EvidenceLockerItem | null>(null)


  const categories = ['ALL', 'IP', 'TK', 'Regulatory', 'ABS', 'Global Market']

  const filteredItems = useMemo(() => {
    return (evidenceLockerData?.items || []).filter((item) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const inTitle = item.sourceTitle.toLowerCase().includes(q)
        const inExcerpt = item.excerpt.toLowerCase().includes(q)
        const inAuth = item.authority?.toLowerCase().includes(q) || false
        const inProv = item.provision?.toLowerCase().includes(q) || false
        const inRef = item.reference.toLowerCase().includes(q)
        if (!inTitle && !inExcerpt && !inAuth && !inProv && !inRef) {
          return false
        }
      }
      return true
    })
  }, [evidenceLockerData, selectedCategory, searchQuery])

  const getAuthorityLevelClass = (level?: string) => {
    switch (level) {
      case 'Statutory':
      case 'Authoritative':
        return 'auth-badge-statutory'
      case 'Defensive Prior Art':
        return 'auth-badge-tk'
      case 'Regulatory':
        return 'auth-badge-regulatory'
      default:
        return 'auth-badge-secondary'
    }
  }

  return (
    <div className="evidence-locker-container">
      <div className="locker-header">
        <div className="locker-title-area">
          <div className="feature-pill">Feature 12 • Audit-Grade Traceability</div>
          <h2 className="section-title">Evidence Locker</h2>
          <p className="section-subtitle">
            Centralized verifiable statutory repository. Every high-impact AI conclusion in IP-SAKTI
            is indexed with exact gazette citations, provisions, and legal authorities.
          </p>
        </div>

        <div className="locker-stats-badge">
          <span className="stats-count">{evidenceLockerData.totalItems}</span>
          <span className="stats-label">Indexed Statutory Citations</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="locker-controls">
        <div className="category-filter-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'ALL' ? 'All Authorities' : cat}
            </button>
          ))}
        </div>

        <div className="search-input-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by statute, section (e.g. 3(p)), herb name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="locker-search-input"
          />
          {searchQuery && (
            <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>
      </div>

      {/* Evidence Cards List */}
      <div className="locker-items-grid">
        {filteredItems.length === 0 ? (
          <div className="locker-empty-state">
            <p>No statutory evidence items match the selected criteria.</p>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <div key={item.id || index} className="locker-evidence-card">

                <div className="card-top-bar">
                  <span className="category-tag">{item.category}</span>
                  <span className={`authority-level-tag ${getAuthorityLevelClass(item.authorityLevel)}`}>
                    {item.authorityLevel || 'Statutory Authority'}
                  </span>
                  <span className="jurisdiction-tag">{item.jurisdiction}</span>
                </div>

                <h3 className="evidence-title">{item.sourceTitle}</h3>

                <div className="evidence-meta-row">
                  <span className="meta-item">
                    <strong>Reference:</strong> {item.reference}
                  </span>
                  {item.provision && (
                    <span className="meta-item">
                      <strong>Provision:</strong> {item.provision}
                    </span>
                  )}
                  {item.effectiveDate && (
                    <span className="meta-item">
                      <strong>Effective:</strong> {item.effectiveDate}
                    </span>
                  )}
                </div>

                {item.taggedConclusion && (
                  <div className="tagged-conclusion-box">
                    <span className="conclusion-label">Traceable Conclusion:</span>
                    <p className="conclusion-text">{item.taggedConclusion}</p>
                  </div>
                )}

                <div className="evidence-excerpt-box">
                  <div className="excerpt-label">Statutory Text / Codified Excerpt:</div>
                  <blockquote className="excerpt-quote">"{item.excerpt}"</blockquote>
                </div>

                {/* Card Actions */}
                <div className="locker-card-actions">
                  <button
                    type="button"
                    className="action-btn-why"
                    onClick={() => setWhyModalItem(item)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    Why this source?
                  </button>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="action-btn-source"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      View Source
                    </a>
                  )}
                </div>
              </div>
            )
          )
        )}

      </div>

      {/* "Why This Source?" Explainer Modal */}
      {whyModalItem && (
        <div className="why-modal-overlay" onClick={() => setWhyModalItem(null)}>
          <div className="why-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="why-modal-header">
              <h3>Source Traceability & Rationale</h3>
              <button type="button" className="close-modal-btn" onClick={() => setWhyModalItem(null)}>
                ×
              </button>
            </div>

            <div className="why-modal-body">
              <div className="modal-section">
                <h4>{whyModalItem.sourceTitle}</h4>
                <p className="modal-meta">
                  {whyModalItem.authority || whyModalItem.jurisdiction} • {whyModalItem.reference}
                </p>
              </div>

              <div className="modal-section">
                <strong>Why was this authoritative source selected?</strong>
                <p>
                  {whyModalItem.whyRelevant ||
                    `This statutory provision directly governs the legal threshold for Ayurvedic classification, IP patentability, or regulatory compliance under ${whyModalItem.jurisdiction}.`}
                </p>
              </div>

              <div className="modal-section">
                <strong>Linked AI Recommendation / Analysis:</strong>
                <p className="modal-quote">{whyModalItem.taggedConclusion}</p>
              </div>

              <div className="modal-section">
                <strong>Legal Weight & Hierarchy:</strong>
                <p>
                  Classified as <strong>{whyModalItem.authorityLevel || 'Statutory'}</strong> authority with an
                  algorithmic confidence score of {Math.round(whyModalItem.relevance * 100)}%.
                </p>
              </div>
            </div>

            <div className="why-modal-footer">
              {whyModalItem.url && (
                <a
                  href={whyModalItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-open-link-btn"
                >
                  Open Official Gazette / Portal ↗
                </a>
              )}
              <button
                type="button"
                className="modal-dismiss-btn"
                onClick={() => setWhyModalItem(null)}
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
