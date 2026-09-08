import type { IPProtectionStrategyResult } from '../../types/analyzer'
import IPRouteCard from './IPRouteCard'

interface IPProtectionStrategyProps {
  strategy: IPProtectionStrategyResult
}

export default function IPProtectionStrategy({
  strategy,
}: IPProtectionStrategyProps) {
  const routes = strategy?.routes || []

  return (
    <section className="ip-protection-strategy-section">
      <div className="section-header-wrap">
        <div className="section-title-box">
          <span className="section-label">FEATURE 7 — IP PROTECTION STRATEGY</span>
          <h2>Tailored Intellectual Property Protection Routes</h2>
          <p>
            Systematic IP route mapping evaluated against Indian Patent Act Section 3(p)/3(e),
            Trade Marks Act 1999, Designs Act 2000, and Trade Secret jurisprudence.
          </p>
        </div>

        <div className="strategy-summary-badge">
          <span>🛡️ {routes.filter((r) => r.status === 'Recommended').length} Recommended Routes</span>
        </div>
      </div>

      <div className="strategy-summary-callout">
        <span className="callout-icon">💡</span>
        <p>{strategy?.summary || 'Comprehensive IP route mapping computed for this formulation.'}</p>
      </div>

      <div className="ip-routes-grid">
        {routes.map((routeData) => (
          <IPRouteCard key={routeData.id} routeData={routeData} />
        ))}
      </div>
    </section>
  )
}
