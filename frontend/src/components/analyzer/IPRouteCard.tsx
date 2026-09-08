import type { IPProtectionRoute } from '../../types/analyzer'
import EvidencePanel from './EvidencePanel'

interface IPRouteCardProps {
  routeData: IPProtectionRoute
}

export default function IPRouteCard({ routeData }: IPRouteCardProps) {
  const { route, status, reason, keyConsiderations, evidence, suggestedAction } = routeData

  const statusStyleMap: Record<
    string,
    { badgeClass: string; icon: string; label: string }
  > = {
    Recommended: {
      badgeClass: 'status-recommended',
      icon: '✅',
      label: 'Recommended',
    },
    Investigate: {
      badgeClass: 'status-investigate',
      icon: '🔍',
      label: 'Investigate',
    },
    'Not applicable / uncertain': {
      badgeClass: 'status-uncertain',
      icon: '⏸️',
      label: 'Not Applicable / Uncertain',
    },
  }

  const currentStatus = statusStyleMap[status] || statusStyleMap['Investigate']

  const routeIconMap: Record<string, string> = {
    Patent: '📜',
    Trademark: '🏷️',
    Design: '🎨',
    'Trade Secret': '🔐',
    'Geographical Indication (GI)': '🗺️',
    Copyright: '©️',
  }

  return (
    <article className="ip-route-card">
      <div className="ip-route-card-header">
        <div className="ip-route-title-group">
          <span className="ip-route-icon">{routeIconMap[route] || '🛡️'}</span>
          <div>
            <h3 className="ip-route-name">{route}</h3>
            <span className="ip-route-subtitle">Intellectual Property Pathway</span>
          </div>
        </div>

        <div className={`ip-status-badge ${currentStatus.badgeClass}`}>
          <span>{currentStatus.icon}</span>
          <span>{currentStatus.label}</span>
        </div>
      </div>

      <div className="ip-route-reason-box">
        <strong className="ip-box-label">Strategic Assessment & Why:</strong>
        <p className="ip-reason-text">{reason}</p>
      </div>

      {keyConsiderations && keyConsiderations.length > 0 && (
        <div className="ip-considerations-wrap">
          <strong className="ip-box-label">Key Statutory Criteria:</strong>
          <ul className="ip-considerations-list">
            {keyConsiderations.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {suggestedAction && (
        <div className="ip-action-box">
          <span className="ip-action-icon">⚡</span>
          <div>
            <strong className="ip-action-label">Recommended Next Step:</strong>
            <p className="ip-action-text">{suggestedAction}</p>
          </div>
        </div>
      )}

      <div className="ip-route-evidence-section">
        <EvidencePanel evidenceList={evidence} title="Statutory & Case Law Evidence" compact />
      </div>
    </article>
  )
}
