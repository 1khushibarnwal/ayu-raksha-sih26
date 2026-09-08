import type { TraditionalKnowledgeRisk, RiskLevel } from '../../types/analyzer'

interface RiskScoreBadgeProps {
  risk: TraditionalKnowledgeRisk
}

export default function RiskScoreBadge({ risk }: RiskScoreBadgeProps) {
  const { score, level, summary } = risk

  const levelColorMap: Record<
    RiskLevel,
    {
      bg: string
      text: string
      badgeBg: string
      border: string
      icon: string
      desc: string
    }
  > = {
    HIGH: {
      bg: 'rgba(217, 83, 79, 0.08)',
      text: '#c0392b',
      badgeBg: '#e74c3c',
      border: 'rgba(231, 76, 60, 0.25)',
      icon: '⚠️',
      desc: 'Significant prior art overlap in codified classical Samhitas & TKDL databases.',
    },
    MEDIUM: {
      bg: 'rgba(230, 126, 34, 0.08)',
      text: '#d35400',
      badgeBg: '#e67e22',
      border: 'rgba(230, 126, 34, 0.25)',
      icon: '⚡',
      desc: 'Moderate overlap. Specific novel processing/adjuvant claims required for IP protection.',
    },
    LOW: {
      bg: 'rgba(47, 107, 79, 0.08)',
      text: '#2f6b4f',
      badgeBg: '#2f6b4f',
      border: 'rgba(47, 107, 79, 0.25)',
      icon: '🛡️',
      desc: 'Distinct novel formulation profile with minimal direct textual confrontation.',
    },
  }

  const currentTheme = levelColorMap[level]

  return (
    <div
      className="risk-score-container"
      style={{
        backgroundColor: currentTheme.bg,
        borderColor: currentTheme.border,
      }}
    >
      <div className="risk-score-header">
        <div className="risk-score-label-group">
          <span className="risk-score-main-label">Traditional Knowledge Risk</span>
          <span className="risk-score-subtext">
            Overlap with codified classical Ayurvedic formulations
          </span>
        </div>

        <div
          className="risk-level-badge"
          style={{
            backgroundColor: currentTheme.badgeBg,
          }}
        >
          {currentTheme.icon} {level} RISK
        </div>
      </div>

      <div className="risk-score-body">
        <div className="risk-score-number-box">
          <span className="risk-score-big" style={{ color: currentTheme.text }}>
            {score}%
          </span>
          <span className="risk-score-fraction">Prior Art Overlap</span>
        </div>

        <div className="risk-meter-wrap">
          <div className="risk-meter-bar">
            <div
              className="risk-meter-fill"
              style={{
                width: `${score}%`,
                backgroundColor: currentTheme.badgeBg,
              }}
            />
          </div>
          <div className="risk-meter-labels">
            <span>0% (Novel)</span>
            <span>50% (Moderate)</span>
            <span>100% (Classical Mirror)</span>
          </div>
        </div>
      </div>

      <div className="risk-score-footer">
        <p className="risk-summary-text">{summary}</p>
      </div>
    </div>
  )
}
