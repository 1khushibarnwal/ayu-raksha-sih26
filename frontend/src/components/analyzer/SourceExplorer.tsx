import React, { useState, useMemo } from 'react'
import type { KnowledgeSourceFilter } from '../../types/analyzer'
import { SourceExplorerService } from '../../services/sourceExplorerService'


export const SourceExplorer: React.FC = () => {
  const [filter, setFilter] = useState<KnowledgeSourceFilter>({
    query: '',
    sourceType: '',
    jurisdiction: '',
    authorityLevel: '',
    status: ''
  })

  const [expandedSnippetId, setExpandedSnippetId] = useState<string | null>(null)

  const searchResults = useMemo(() => {
    return SourceExplorerService.searchSources(filter)
  }, [filter])

  const sourceTypes = [
    'Patent Law / Statute',
    'Biodiversity Law',
    'Regulatory Rule',
    'TKDL Database',
    'Pharmacopoeia',
    'International Material'
  ]

  const jurisdictions = ['India', 'USA', 'EU', 'WIPO']
  const authorityLevels = ['Statutory', 'Authoritative', 'Defensive Prior Art', 'Secondary']
  const statuses = ['Current', 'Historical']

  return (
    <div className="source-explorer-container">
      <div className="source-explorer-header">
        <div className="title-area">
          <div className="feature-pill">Feature 19 • Codified Knowledge Base</div>
          <h2 className="section-title">Source Explorer</h2>
          <p className="section-subtitle">
            Searchable legal and traditional knowledge library indexing Indian statutes, TKDL prior art compendia, and international herbal monographs.
          </p>
        </div>

        <div className="sources-count-badge">
          <span className="count-num">{searchResults.length}</span>
          <span className="count-txt">Matched Authorities</span>
        </div>
      </div>

      {/* Search & Faceted Filter Controls */}
      <div className="explorer-filters-panel">
        <div className="search-bar-row">
          <div className="main-search-input-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by keywords, sections, provisions (e.g. 'Section 3(p)', 'Rule 158-B', 'DSHEA')..."
              value={filter.query}
              onChange={(e) => setFilter({ ...filter, query: e.target.value })}
              className="explorer-search-input"
            />
            {filter.query && (
              <button
                type="button"
                className="clear-filter-btn"
                onClick={() => setFilter({ ...filter, query: '' })}
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="facets-row">
          {/* Source Type Filter */}
          <div className="facet-group">
            <label>Source Type:</label>
            <select
              value={filter.sourceType}
              onChange={(e) => setFilter({ ...filter, sourceType: e.target.value })}
              className="facet-select"
            >
              <option value="">All Types</option>
              {sourceTypes.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Jurisdiction Filter */}
          <div className="facet-group">
            <label>Jurisdiction:</label>
            <select
              value={filter.jurisdiction}
              onChange={(e) => setFilter({ ...filter, jurisdiction: e.target.value })}
              className="facet-select"
            >
              <option value="">All Jurisdictions</option>
              {jurisdictions.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>

          {/* Authority Level */}
          <div className="facet-group">
            <label>Authority Level:</label>
            <select
              value={filter.authorityLevel}
              onChange={(e) => setFilter({ ...filter, authorityLevel: e.target.value })}
              className="facet-select"
            >
              <option value="">All Levels</option>
              {authorityLevels.map((al) => (
                <option key={al} value={al}>
                  {al}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="facet-group">
            <label>Status:</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="facet-select"
            >
              <option value="">All Statuses</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {(filter.query || filter.sourceType || filter.jurisdiction || filter.authorityLevel || filter.status) && (
            <button
              type="button"
              className="reset-facets-btn"
              onClick={() =>
                setFilter({
                  query: '',
                  sourceType: '',
                  jurisdiction: '',
                  authorityLevel: '',
                  status: ''
                })
              }
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Sources Search Results Grid */}
      <div className="sources-results-grid">
        {searchResults.length === 0 ? (
          <div className="no-sources-found">
            <p>No knowledge sources matched your search filters. Try broadening your terms.</p>
          </div>
        ) : (
          searchResults.map((source) => {
            const isSnippetOpen = expandedSnippetId === source.id

            return (
              <div key={source.id} className="source-card">
                <div className="source-card-header">
                  <div className="source-type-tag">{source.sourceType}</div>
                  <div className="source-auth-level">{source.authorityLevel}</div>
                  <div className="source-jur-tag">{source.jurisdiction}</div>
                </div>

                <h3 className="source-title">{source.sourceTitle}</h3>

                <div className="source-meta-grid">
                  <div><strong>Reference:</strong> {source.reference}</div>
                  <div><strong>Authority:</strong> {source.authority}</div>
                  {source.provision && <div><strong>Provision:</strong> {source.provision}</div>}
                  {source.effectiveDate && <div><strong>Effective:</strong> {source.effectiveDate}</div>}
                </div>

                <div className="source-excerpt-container">
                  <p className="source-excerpt">"{source.excerpt}"</p>
                </div>

                <div className="source-relevance-box">
                  <span className="rel-label">Analytical Utility:</span>
                  <p>{source.whyRelevant}</p>
                </div>

                {/* Full Text Snippet Drawer */}
                {source.fullTextSnippet && (
                  <div className="full-text-drawer">
                    <button
                      type="button"
                      className="snippet-toggle-btn"
                      onClick={() =>
                        setExpandedSnippetId(isSnippetOpen ? null : source.id || '')
                      }
                    >
                      {isSnippetOpen ? 'Hide Statutory Text' : 'View Full Statutory Provision Text'}
                    </button>

                    {isSnippetOpen && (
                      <div className="snippet-body">
                        <pre className="statute-pre">{source.fullTextSnippet}</pre>
                      </div>
                    )}
                  </div>
                )}

                <div className="source-card-footer">
                  <span className="last-updated">Updated: {source.lastUpdated}</span>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="open-source-link"
                    >
                      Open Official Gazette / Source ↗
                    </a>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
