import { useState } from 'react'
import type {
  InnovationProfile,
  ExpertIssueCategory,
  ExpertUrgency,
  ExpertRequest,
} from '../../types/analyzer'
import { createExpertRequest } from '../../services/expertService'
import { getUserProfile } from '../../services/userService'

interface ExpertRequestModalProps {
  profile?: InnovationProfile
  missingInfo?: string[]
  evidenceCount?: number
  onClose: () => void
  onSuccess: (newRequest: ExpertRequest) => void
}

const issueCategories: ExpertIssueCategory[] = [
  'Section 3(p) Patent Eligibility',
  'TKDL Prior Art Invalidation',
  'NBA / Biological Diversity ABS',
  'US FDA Botanical Drug Guidance',
  'EU EMA Traditional Herbal Registry',
  'Novel Synergy & Non-Obviousness',
  'Regulatory Dossier Review',
]

export function ExpertRequestModal({
  profile,
  missingInfo = [],
  evidenceCount = 0,
  onClose,
  onSuccess,
}: ExpertRequestModalProps) {
  const user = getUserProfile()

  const [requesterName, setRequesterName] = useState(user.fullName || '')
  const [requesterEmail, setRequesterEmail] = useState(user.email || '')
  const [requesterRole, setRequesterRole] = useState<string>(user.role || 'Pharma / Biotech Researcher')
  const [issueCategory, setIssueCategory] = useState<ExpertIssueCategory>('Section 3(p) Patent Eligibility')
  const [urgency, setUrgency] = useState<ExpertUrgency>('Standard')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const productName = profile?.productName || 'Ayurvedic Formulation Project'
  const extractedContext = profile
    ? `Product: ${profile.productName || 'N/A'}, Type: ${profile.productType}, Actives: ${profile.ingredients.join(', ')}, Sourcing: ${profile.ingredientSource}, Markets: ${profile.targetMarkets.join(', ')}`
    : 'No active profile loaded.'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) {
      setError('Please provide a brief description of your specific legal or regulatory question.')
      return
    }

    setIsSubmitting(true)
    try {
      const created = createExpertRequest({
        productName,
        requesterName,
        requesterEmail,
        requesterRole,
        issueCategory,
        urgency,
        description,
        extractedContext,
        missingInformation: missingInfo,
        attachedEvidenceCount: evidenceCount,
      })

      onSuccess(created)
    } catch (err) {
      console.error('Failed to create expert request:', err)
      setError('Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card expert-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-badge-row">
              <span className="badge-expert-escalation">⚖️ HUMAN EXPERT ESCALATION</span>
              <span className="modal-category-label">STATUTORY REVIEW GATEWAY</span>
            </div>
            <h3 className="modal-title">Request Certified Ayush IP & Regulatory Expert Review</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body expert-form">
          {error && <div className="expert-form-error">{error}</div>}

          {/* AUTO-ATTACHED CONTEXT BANNER */}
          <div className="expert-context-banner">
            <div className="context-header">
              <strong>📎 Auto-Attached Innovation Dossier Context</strong>
              <span className="context-tag">{evidenceCount} Evidence Citations Attached</span>
            </div>
            <p className="context-summary">{extractedContext}</p>
            {missingInfo.length > 0 && (
              <div className="context-missing">
                <span className="missing-label">Flagged Data Gaps:</span>
                <ul>
                  {missingInfo.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Requester Full Name</label>
              <input
                type="text"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                required
                className="expert-input"
              />
            </div>
            <div className="form-group">
              <label>Official Email</label>
              <input
                type="email"
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
                required
                className="expert-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Requester Role / Designation</label>
            <input
              type="text"
              value={requesterRole}
              onChange={(e) => setRequesterRole(e.target.value)}
              className="expert-input"
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Primary Focus Area / Issue Category</label>
              <select
                value={issueCategory}
                onChange={(e) => setIssueCategory(e.target.value as ExpertIssueCategory)}
                className="expert-select"
              >
                {issueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Filing Urgency & Timeline</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as ExpertUrgency)}
                className="expert-select"
              >
                <option value="Standard">Standard Review (3-5 Business Days)</option>
                <option value="Urgent">Urgent Review (24-48 Hours)</option>
                <option value="Critical (Pre-Filing Deadline)">Critical (Pre-Filing Deadline: 24h)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Specific Legal / Technical Questions for Expert</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (error) setError('')
              }}
              placeholder="Describe your specific queries (e.g., Section 3(e) synergistic isobologram threshold, NBA Form I clearance for export, US FDA NDI vs GRAS pathway)..."
              className="expert-textarea"
              required
            />
          </div>

          <div className="expert-disclaimer">
            <span className="disclaimer-icon">🔒</span>
            <p>
              Your formulation formulas and research notes remain protected under strict client confidentiality and non-disclosure standards.
            </p>
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="primary-button expert-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting Request...' : 'Submit Expert Review Request →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default ExpertRequestModal
