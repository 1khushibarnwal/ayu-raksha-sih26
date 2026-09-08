import type { TraditionalKnowledgeRisk, TraditionalKnowledgeMatch } from '../../types/analyzer'
import RiskScoreBadge from './RiskScoreBadge'
import KnowledgeMatchCard from './KnowledgeMatchCard'

interface TraditionalKnowledgeDetectorProps {
  risk: TraditionalKnowledgeRisk
  matches: TraditionalKnowledgeMatch[]
  isMock?: boolean
}

export default function TraditionalKnowledgeDetector({
  risk,
  matches,
  isMock = true,
}: TraditionalKnowledgeDetectorProps) {
  const safeMatches = matches || []

  return (
    <section className="traditional-knowledge-detector-section">
      {/* SECTION HEADER */}
      <div className="tk-detector-header">
        <div className="tk-title-wrap">
          <div className="tk-title-pill">
            <span className="brand-mark">✦</span>
            <span>CORE DETECTOR</span>
          </div>
          <h2>Traditional Knowledge Detector</h2>
          <p>
            Automated screening against codified classical texts (Charaka, Sushruta, Vagbhata)
            and Traditional Knowledge Digital Library (TKDL) databases to identify prior-art overlap.
          </p>
        </div>

        {isMock && (
          <div className="demo-analysis-notice">
            <span className="demo-notice-dot" />
            <span>Demo / Mock Analysis Layer</span>
          </div>
        )}
      </div>

      {/* 3A. RISK SCORE BADGE */}
      {risk && <RiskScoreBadge risk={risk} />}

      {/* 3B & 3C. POSSIBLE MATCHES LIST */}
      <div className="possible-matches-container">
        <div className="possible-matches-header">
          <div>
            <h3>Possible Matching Formulations / Uses</h3>
            <span className="matches-count-label">
              Found {safeMatches.length} relevant classical prior-art correspondences
            </span>
          </div>
        </div>

        <div className="matches-grid">
          {safeMatches.map((match, index) => (
            <KnowledgeMatchCard key={match.id || index} match={match} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
