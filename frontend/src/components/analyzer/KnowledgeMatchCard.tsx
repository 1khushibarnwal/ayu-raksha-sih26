import type { TraditionalKnowledgeMatch } from '../../types/analyzer'

interface KnowledgeMatchCardProps {
  match: TraditionalKnowledgeMatch
  index: number
}

export default function KnowledgeMatchCard({
  match,
  index,
}: KnowledgeMatchCardProps) {
  const { name, classicalContext, similarity, matchReason, matchedIngredients, evidence } = match

  return (
    <article className="knowledge-match-card">
      <div className="match-card-top">
        <div className="match-card-title-group">
          <div className="match-num-badge">Match #{index + 1}</div>
          <h3 className="match-title">{name}</h3>
          <span className="match-context">📜 {classicalContext}</span>
        </div>

        <div className="match-similarity-pill">
          <span className="similarity-num">{similarity}%</span>
          <span className="similarity-label">Similarity</span>
        </div>
      </div>

      {/* WHY IT MATCHES */}
      <div className="match-reason-box">
        <strong className="match-reason-label">Why it matches:</strong>
        <p className="match-reason-text">{matchReason}</p>
      </div>

      {/* MATCHED INGREDIENTS */}
      {matchedIngredients.length > 0 && (
        <div className="matched-herbs-wrap">
          <span className="matched-herbs-label">Overlapping Actives:</span>
          <div className="matched-herbs-list">
            {matchedIngredients.map((ing) => (
              <span key={ing} className="matched-herb-tag">
                🌿 {ing}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* EVIDENCE / SOURCE SECTION */}
      <div className="match-evidence-section">
        <div className="evidence-header">
          <div className="evidence-title-group">
            <span className="evidence-icon">🔍</span>
            <strong>Evidence / Source:</strong>
          </div>
          <span className="evidence-type-badge">{evidence.sourceType}</span>
        </div>

        <div className="evidence-content-box">
          <div className="evidence-source-name">
            <strong>{evidence.sourceTitle}</strong>
            {evidence.publication && (
              <span className="evidence-pub-name">— {evidence.publication}</span>
            )}
          </div>

          {evidence.reference && (
            <div className="evidence-ref-id">
              <span>Citation ID: </span>
              <code>{evidence.reference}</code>
            </div>
          )}

          {evidence.excerpt && (
            <p className="evidence-snippet-text">
              <span className="quote-mark">“</span>
              {evidence.excerpt}
              <span className="quote-mark">”</span>
            </p>
          )}

          {evidence.url && (
            <a
              href={evidence.url}
              target="_blank"
              rel="noopener noreferrer"
              className="evidence-link"
            >
              <span>View Registry Reference ↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
