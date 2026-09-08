import type { RiskDimension } from '../../types/analyzer'

interface RiskDimensionCardProps {
  dimension: RiskDimension
  onClick: () => void
}

export default function RiskDimensionCard({
  dimension,
  onClick,
}: RiskDimensionCardProps) {
  const { name, shortLabel, score, level, whyAssigned } = dimension

  const levelColorMap: Record<string, { badge: string; text: string; fill: string }> = {
    HIGH: { badge: 'risk-badge-high', text: '#c0392b', fill: '#e74c3c' },
    MEDIUM: { badge: 'risk-badge-med', text: '#d35400', fill: '#e67e22' },
    LOW: { badge: 'risk-badge-low', text: '#2f6b4f', fill: '#2f6b4f' },
  }

  const theme = levelColorMap[level] || levelColorMap['MEDIUM']

  return (
    <button
      type="button"
      className="risk-dimension-card"
      onClick={onClick}
      aria-label={`View deep dive for ${name}`}
    >
      <div className="risk-card-top">
        <span className="risk-dim-short">{shortLabel}</span>
        <span className={`risk-dim-level-pill ${theme.badge}`}>
          {level}
        </span>
      </div>

      <h4 className="risk-dim-name">{name}</h4>

      <div className="risk-dim-score-row">
        <span className="risk-dim-score-big" style={{ color: theme.text }}>
          {score}
        </span>
        <span className="risk-dim-score-max">/ 100</span>
      </div>

      <div className="risk-dim-meter">
        <div
          className="risk-dim-meter-fill"
          style={{ width: `${score}%`, backgroundColor: theme.fill }}
        />
      </div>

      <p className="risk-dim-snippet">{whyAssigned}</p>

      <div className="risk-dim-footer">
        <span className="risk-click-hint">Click for Evidence & Breakdown →</span>
      </div>
    </button>
  )
}
