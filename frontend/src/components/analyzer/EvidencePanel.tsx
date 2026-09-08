import { useState } from 'react'
import type { EvidenceItem } from '../../types/analyzer'

interface EvidencePanelProps {
  evidenceList: EvidenceItem[]
  title?: string
  defaultExpanded?: boolean
  compact?: boolean
}

export default function EvidencePanel({
  evidenceList,
  title = 'Authoritative Evidence & Legal / Classical Citations',
  defaultExpanded = false,
  compact = false,
}: EvidencePanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  if (!evidenceList || evidenceList.length === 0) {
    return null
  }

  return (
    <div className={`evidence-panel-wrapper ${compact ? 'evidence-compact' : ''}`}>
      <button
        type="button"
        className="evidence-toggle-btn"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
      >
        <div className="evidence-toggle-left">
          <span className="evidence-badge-icon">🔍</span>
          <span className="evidence-toggle-title">{title}</span>
          <span className="evidence-count-badge">
            {evidenceList.length} source{evidenceList.length > 1 ? 's' : ''}
          </span>
        </div>
        <span className="evidence-toggle-arrow">
          {isExpanded ? '▲ Hide Evidence' : '▼ View Evidence & Sources'}
        </span>
      </button>

      {isExpanded && (
        <div className="evidence-cards-list">
          {evidenceList.map((item, idx) => (
            <div key={idx} className="evidence-source-card">
              <div className="evidence-card-header">
                <div className="evidence-meta-tags">
                  <span className="evidence-type-pill">{item.sourceType}</span>
                  <span className="evidence-jurisdiction-pill">📍 {item.jurisdiction}</span>
                  {item.relevance && (
                    <span className="evidence-relevance-pill">
                      {Math.round(item.relevance * 100)}% Match
                    </span>
                  )}
                </div>

                {item.reference && (
                  <span className="evidence-citation-code">
                    Ref: <code>{item.reference}</code>
                  </span>
                )}
              </div>

              <strong className="evidence-source-title">{item.sourceTitle}</strong>
              <span className="evidence-pub-info">Published in: {item.publication}</span>

              <div className="evidence-excerpt-box">
                <span className="evidence-quote-sym">“</span>
                <p className="evidence-excerpt-text">{item.excerpt}</p>
                <span className="evidence-quote-sym">”</span>
              </div>

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="evidence-ext-link"
                >
                  <span>Verify Reference on Official Registry ↗</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
