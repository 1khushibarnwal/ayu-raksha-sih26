import { useState, useEffect } from 'react'
import type {
  InnovationProfile,
  ConfidenceExplanation,
  ExpertRequest,
} from '../../types/analyzer'
import { getExpertRequests } from '../../services/expertService'
import ExpertRequestModal from './ExpertRequestModal'

interface HumanExpertAssistanceProps {
  profile?: InnovationProfile
  confidence?: ConfidenceExplanation
  evidenceCount?: number
}

export function HumanExpertAssistance({
  profile,
  confidence,
  evidenceCount = 0,
}: HumanExpertAssistanceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [requests, setRequests] = useState<ExpertRequest[]>([])
  const [successToast, setSuccessToast] = useState<string | null>(null)

  useEffect(() => {
    setRequests(getExpertRequests())
  }, [])

  const isLowConfidence = confidence?.level === 'Low' || confidence?.isAbstaining

  function handleSuccess(newReq: ExpertRequest) {
    setIsModalOpen(false)
    setRequests(getExpertRequests())
    setSuccessToast(`Request #${newReq.id} successfully queued! An IP expert will contact you at ${newReq.requesterEmail}.`)
    setTimeout(() => setSuccessToast(null), 6000)
  }

  return (
    <div className={`expert-assistance-container ${isLowConfidence ? 'escalation-prominent' : ''}`}>
      {successToast && (
        <div className="expert-toast-success">
          <span>✓</span> {successToast}
        </div>
      )}

      <div className="expert-assistance-header">
        <div className="expert-header-left">
          <div className="expert-avatar-badge">
            <span>👨‍⚖️</span>
          </div>
          <div>
            <div className="expert-eyebrow">
              <span className="expert-tag">HUMAN-IN-THE-LOOP ASSURANCE</span>
              {isLowConfidence && <span className="escalation-alert-tag">ACTION REQUIRED</span>}
            </div>
            <h3 className="expert-title">Ayurvedic IP & Regulatory Expert Escalation</h3>
            <p className="expert-desc">
              Connect directly with verified Indian Patent Attorneys, National Biodiversity Authority (NBA) consultants, and US FDA/EU EMA herbal regulatory specialists.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="primary-button expert-open-modal-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <span>⚖️ Request Expert Assistance</span>
          <span className="btn-arrow">→</span>
        </button>
      </div>

      {/* TRIGGERS AND WHEN TO ESCALATE */}
      <div className="expert-triggers-grid">
        <div className="trigger-card">
          <div className="trigger-icon">📜</div>
          <div>
            <strong>Section 3(p) / 3(e) Synergistic Objections</strong>
            <p>Formulate claim language and empirical test matrices to rebut mere-admixture challenges.</p>
          </div>
        </div>

        <div className="trigger-card">
          <div className="trigger-icon">🌿</div>
          <div>
            <strong>NBA Access & Benefit Sharing (ABS)</strong>
            <p>Determine exact Form I vs Form III requirements and negotiate local BMC benefit rates.</p>
          </div>
        </div>

        <div className="trigger-card">
          <div className="trigger-icon">🌐</div>
          <div>
            <strong>Global Market Classification</strong>
            <p>Navigate US FDA Botanical Drug Guidance vs DSHEA Supplement and EU THMPD registration.</p>
          </div>
        </div>
      </div>

      {/* ACTIVE REQUESTS TRACKER */}
      {requests.length > 0 && (
        <div className="active-requests-section">
          <div className="active-requests-header">
            <h4>Active Escalation Requests ({requests.length})</h4>
            <span className="requests-sub">Live status tracking & assigned attorney notes</span>
          </div>

          <div className="requests-table-wrapper">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Product / Topic</th>
                  <th>Category</th>
                  <th>Urgency</th>
                  <th>Assigned Specialist</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <span className="request-id-badge">{req.id}</span>
                    </td>
                    <td>
                      <strong>{req.productName}</strong>
                      <p className="table-subtext">{req.description.slice(0, 60)}...</p>
                    </td>
                    <td>
                      <span className="category-pill">{req.issueCategory}</span>
                    </td>
                    <td>
                      <span
                        className={`urgency-pill ${
                          req.urgency.includes('Critical')
                            ? 'urgency-critical'
                            : req.urgency === 'Urgent'
                            ? 'urgency-urgent'
                            : 'urgency-standard'
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </td>
                    <td>
                      {req.assignedExpert ? (
                        <div className="assigned-expert-cell">
                          <strong>{req.assignedExpert.name}</strong>
                          <span className="table-subtext">{req.assignedExpert.organization}</span>
                        </div>
                      ) : (
                        <span className="unassigned-pill">Routing to specialist...</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`status-pill status-${req.status.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td>
                      <span className="table-date">
                        {new Date(req.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <ExpertRequestModal
          profile={profile}
          missingInfo={confidence?.missingInformation}
          evidenceCount={evidenceCount}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}
export default HumanExpertAssistance
