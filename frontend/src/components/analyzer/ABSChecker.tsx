import { useState, useEffect } from 'react'
import type {
  ABSFormData,
  ABSAssessmentResult,
  ABSInvolvement,
  ABSStatus,
  InnovationProfile,
  EvidenceItem,
} from '../../types/analyzer'
import EvidencePanel from './EvidencePanel'

interface ABSCheckerProps {
  initialResult: ABSAssessmentResult
  profile: InnovationProfile
}

export default function ABSChecker({ initialResult, profile }: ABSCheckerProps) {
  const [formData, setFormData] = useState<ABSFormData>({
    involvesBiologicalResource: 'YES',
    resourceName: profile?.ingredients?.join(', ') || 'Withania somnifera / Curcuma longa',
    resourceSource: profile?.ingredientSource || 'Cultivated',
    communityKnowledge: profile?.ingredientSource === 'Traditional community' ? 'Yes' : 'Not sure',
    purpose: 'Commercial utilization',
  })

  const [assessment, setAssessment] = useState<ABSAssessmentResult>(initialResult)

  // Re-evaluate ABS assessment dynamically when user changes inputs
  useEffect(() => {
    evaluateABS(formData)
  }, [formData])

  function evaluateABS(data: ABSFormData) {
    if (data.involvesBiologicalResource === 'NO') {
      setAssessment({
        involvesBiologicalResource: false,
        resource: 'None',
        source: 'N/A',
        communityKnowledge: false,
        purpose: 'Non-biological formulation',
        status: 'Likely Not Applicable',
        reason:
          'No biological resources or associated traditional knowledge are involved in this formulation. Standard ABS approval under Section 3/4 of the Biological Diversity Act, 2002 is unlikely to be triggered.',
        evidence: [
          {
            sourceTitle: 'Biological Diversity Act, 2002 — Section 2(c) Exclusions',
            sourceType: 'Biodiversity Law',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Ministry of Environment, Forest and Climate Change (MoEFCC)',
            reference: 'BD Act 2002, Sec 2(c)',
            excerpt:
              'Biological resources do not include value-added products and commodities where the morphological state is fully synthetically processed without biological identity.',
            relevance: 0.95,
          },
        ],
        nextStep:
          'Maintain procurement records confirming purely synthetic/non-biological origin to satisfy patent office Form 1 declarations.',
        authority: 'National Biodiversity Authority (NBA, Chennai)',
      })
      return
    }

    if (data.involvesBiologicalResource === 'NOT SURE') {
      setAssessment({
        involvesBiologicalResource: true,
        resource: data.resourceName || 'Unspecified botanical matter',
        source: data.resourceSource,
        communityKnowledge: null,
        purpose: data.purpose,
        status: 'More Information Needed',
        reason:
          'Sourcing origin and botanical species identification require clarification before determining whether State Biodiversity Board (SBB) intimation or National Biodiversity Authority (NBA) prior approval is legally mandatory.',
        evidence: [
          {
            sourceTitle: 'Guidelines on Access to Biological Resources and Associated Knowledge, 2014',
            sourceType: 'Biodiversity Law',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'National Biodiversity Authority Gazette Notification G.S.R. 823(E)',
            reference: 'NBA Regulation 2014, Rule 2 & 3',
            excerpt:
              'Any Indian entity accessing biological resources from wild or cultivated sources for commercial utilization is required to give prior intimation to the concerned State Biodiversity Board under Form I.',
            relevance: 0.91,
          },
        ],
        nextStep:
          'Identify exact botanical taxa, state of harvest, and commercial entity status (Indian vs Non-Indian shareholding) to finalize compliance path.',
        authority: 'State Biodiversity Board (SBB) & National Biodiversity Authority (NBA)',
      })
      return
    }

    // YES flow
    const isWildOrCommunity =
      data.resourceSource === 'Wild sourced' ||
      data.resourceSource === 'Traditional community' ||
      data.communityKnowledge === 'Yes'

    const isForeignOrExport = data.purpose === 'Foreign patent / export'

    let status: ABSStatus = 'Review Required'
    let reason = ''
    let nextStep = ''

    if (isWildOrCommunity || isForeignOrExport) {
      status = 'Review Required'
      reason =
        'The innovation accesses biological resources from natural forest/tribal community sources or involves foreign IP filings. Under Section 3 and Section 6 of the Biological Diversity Act, 2002, prior approval from the National Biodiversity Authority (Form III) is mandatory before patent grant.'
      nextStep =
        'Submit Form III to the National Biodiversity Authority (NBA) prior to patent grant or commercial extraction, and enter into an Access & Benefit Sharing (ABS) agreement.'
    } else {
      status = 'Potential ABS Consideration'
      reason =
        'Cultivated herbs sourced commercially by Indian entities typically require prior intimation to the State Biodiversity Board (SBB) rather than full NBA clearance, unless exported or applied for foreign patents.'
      nextStep =
        'File Form I intimation with the concerned State Biodiversity Board (SBB) and retain vendor Certificate of Origin verifying cultivated origin.'
    }

    const evidenceList: EvidenceItem[] = [
      {
        sourceTitle: 'Biological Diversity Act, 2002 — Section 6 (Application for IPR)',
        sourceType: 'Biodiversity Law',
        jurisdiction: 'India (IPO/AYUSH/NBA)',
        publication: 'Gazette of India, Extraordinary Part II Sec 1',
        reference: 'BD Act 2002, Sec 6(1)',
        url: 'http://nbaindia.org',
        excerpt:
          'No person shall apply for any intellectual property right, by whatever name called, in or outside India for any invention based on any research or information on a biological resource obtained from India without obtaining the previous approval of the National Biodiversity Authority.',
        relevance: 0.98,
      },
      {
        sourceTitle: 'Section 10(4)(d)(ii) Indian Patents Act, 1970 — Mandatory Disclosure',
        sourceType: 'Patent Law / Statute',
        jurisdiction: 'India (IPO/AYUSH/NBA)',
        publication: 'The Patents Act, 1970 (as amended 2005)',
        reference: 'Patents Act 1970, Sec 10(4)(d)(ii)',
        excerpt:
          'Every complete specification shall disclose the source and geographical origin of the biological material in the specification, when used in an invention.',
        relevance: 0.94,
      },
    ]

    setAssessment({
      involvesBiologicalResource: true,
      resource: data.resourceName,
      source: data.resourceSource,
      communityKnowledge: data.communityKnowledge === 'Yes',
      purpose: data.purpose,
      status,
      reason,
      evidence: evidenceList,
      nextStep,
      authority:
        status === 'Review Required'
          ? 'National Biodiversity Authority (NBA, Chennai)'
          : 'State Biodiversity Board (SBB)',
      exemptionNotes:
        'Normally Traded Commodities (NTC) under Section 40 notification may be exempt if purchased solely as raw agri-produce.',
    })
  }

  const statusStyleMap: Record<
    ABSStatus,
    { badgeClass: string; icon: string; text: string }
  > = {
    'Review Required': {
      badgeClass: 'abs-status-review',
      icon: '⚠️',
      text: 'Review Required (Section 3/6 BD Act)',
    },
    'Potential ABS Consideration': {
      badgeClass: 'abs-status-potential',
      icon: '🌿',
      text: 'Potential ABS Consideration (SBB Intimation)',
    },
    'More Information Needed': {
      badgeClass: 'abs-status-info',
      icon: '❓',
      text: 'More Information Needed',
    },
    'Likely Not Applicable': {
      badgeClass: 'abs-status-exempt',
      icon: '✅',
      text: 'Likely Not Applicable / Exempt',
    },
  }

  const currentTheme = statusStyleMap[assessment.status]

  return (
    <section className="abs-checker-section">
      {/* SECTION HEADER */}
      <div className="section-header-wrap">
        <div className="section-title-box">
          <span className="section-label">FEATURE 9 — BIODIVERSITY & ABS CHECKER</span>
          <h2>Biological Resources Access and Benefit-Sharing (ABS) Screening</h2>
          <p>
            Assess compliance under the Biological Diversity Act, 2002 and Nagoya Protocol.
            Determines whether National Biodiversity Authority (NBA) approval or State Biodiversity Board (SBB)
            intimation is required for your botanical innovation.
          </p>
        </div>

        <div className="abs-framework-pill">
          <span>🌿 Nagoya Protocol & BD Act 2002</span>
        </div>
      </div>

      {/* GUIDED QUESTION: INVOLVES BIOLOGICAL RESOURCES? */}
      <div className="abs-card">
        <div className="abs-question-box">
          <label className="abs-main-question">
            Does your innovation involve biological resources (herbs, plants, seeds, extracts, bio-materials)?
          </label>

          <div className="abs-involvement-options">
            {(['YES', 'NO', 'NOT SURE'] as ABSInvolvement[]).map((opt) => {
              const isSelected = formData.involvesBiologicalResource === opt
              return (
                <button
                  key={opt}
                  type="button"
                  className={`abs-involvement-btn ${isSelected ? 'active' : ''}`}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, involvesBiologicalResource: opt }))
                  }
                >
                  <span className="abs-involvement-radio">
                    {isSelected && <span className="abs-radio-dot" />}
                  </span>
                  <span className="abs-involvement-text">
                    {opt === 'YES' ? 'YES — Involves Plants / Botanicals' : opt === 'NO' ? 'NO — Purely Synthetic' : 'NOT SURE / Pending'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* IF YES OR NOT SURE: SHOW DETAILED GUIDED FORM */}
        {formData.involvesBiologicalResource !== 'NO' && (
          <div className="abs-details-form">
            {/* 1. BIOLOGICAL RESOURCE */}
            <div className="abs-field-item">
              <label className="abs-field-label">
                <span>1. Biological Resource(s) Identified:</span>
              </label>
              <input
                type="text"
                className="abs-input"
                value={formData.resourceName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, resourceName: e.target.value }))
                }
                placeholder="e.g. Withania somnifera (Ashwagandha), Curcuma longa"
              />
            </div>

            {/* 2. SOURCE */}
            <div className="abs-field-item">
              <label className="abs-field-label">
                <span>2. Where did the biological resource come from?</span>
              </label>
              <select
                className="abs-select"
                value={formData.resourceSource}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, resourceSource: e.target.value }))
                }
              >
                <option value="Cultivated">Cultivated on Farm / GACP Agriculture</option>
                <option value="Wild sourced">Wild Sourced from Forest / Natural Habitat</option>
                <option value="Traditional community">Traditional Tribal / Indigenous Community</option>
                <option value="Supplier">Commercial Raw Material Supplier</option>
                <option value="Unknown">Unknown / Multiple Sources</option>
              </select>
            </div>

            {/* 3. TRADITIONAL KNOWLEDGE INVOLVEMENT */}
            <div className="abs-field-item">
              <label className="abs-field-label">
                <span>3. Does the innovation involve traditional or community knowledge?</span>
              </label>
              <div className="abs-radio-group">
                {(['Yes', 'No', 'Not sure'] as const).map((choice) => (
                  <label key={choice} className="abs-radio-label">
                    <input
                      type="radio"
                      name="communityKnowledge"
                      checked={formData.communityKnowledge === choice}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, communityKnowledge: choice }))
                      }
                    />
                    <span>{choice}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. PURPOSE */}
            <div className="abs-field-item">
              <label className="abs-field-label">
                <span>4. Intended Utilization Purpose:</span>
              </label>
              <select
                className="abs-select"
                value={formData.purpose}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, purpose: e.target.value as any }))
                }
              >
                <option value="Commercial utilization">Commercial Utilization (Manufacturing & Sale)</option>
                <option value="Research & Development">Research & Development (Pre-commercial)</option>
                <option value="Foreign patent / export">Foreign Patent Application / Export of Biomaterial</option>
                <option value="Bio-survey & bio-utilization">Bio-survey and Bio-utilization</option>
                <option value="Other">Other Specific ASU Purpose</option>
              </select>
            </div>
          </div>
        )}

        {/* ABS ASSESSMENT RESULT SECTION */}
        <div className="abs-assessment-result-card">
          <div className="abs-result-header">
            <div>
              <span className="abs-result-label">ABS ASSESSMENT RESULT</span>
              <h3 className="abs-result-title">Access & Benefit-Sharing Evaluation</h3>
            </div>

            <div className={`abs-status-pill ${currentTheme.badgeClass}`}>
              <span>{currentTheme.icon}</span>
              <span>{currentTheme.text}</span>
            </div>
          </div>

          <div className="abs-result-body">
            <div className="abs-result-row">
              <strong className="abs-block-label">Reason & Statutory Analysis:</strong>
              <p className="abs-reason-text">{assessment.reason}</p>
            </div>

            <div className="abs-result-row">
              <strong className="abs-block-label">Jurisdictional Authority:</strong>
              <span className="abs-authority-tag">🏛️ {assessment.authority}</span>
            </div>

            {assessment.exemptionNotes && (
              <div className="abs-exemption-box">
                <span className="abs-exemption-icon">ℹ️</span>
                <span className="abs-exemption-text">{assessment.exemptionNotes}</span>
              </div>
            )}

            <div className="abs-next-step-box">
              <span className="next-step-icon">⚡</span>
              <div>
                <strong className="next-step-heading">Recommended Next Step:</strong>
                <p className="next-step-text">{assessment.nextStep}</p>
              </div>
            </div>

            <div className="abs-evidence-wrapper">
              <EvidencePanel evidenceList={assessment.evidence} title="Biodiversity Act & Patent Disclosure Evidence" compact />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
