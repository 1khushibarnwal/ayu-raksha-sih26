import type {
  InnovationFormData,
  ConfidenceExplanation,
  ConfidenceFactor,
  ConfidenceLevel,
  TraditionalKnowledgeRisk,
  EvidenceItem,
} from '../types/analyzer'

/**
 * Calculates algorithmic explainable confidence score.
 * Separates Risk (outcome severity) from Confidence (evidence reliability).
 */
export function calculateConfidence(
  formData: InnovationFormData,
  _tkRisk?: TraditionalKnowledgeRisk,
  evidenceList?: EvidenceItem[]
): ConfidenceExplanation {
  const factors: ConfidenceFactor[] = []
  const knownFacts: string[] = []
  const missingInfo: string[] = []

  // 1. Source Authority & Statutory Baseline (Weight: 30%)
  const hasAuthoritativeSources =
    evidenceList && evidenceList.some((e) => e.authorityLevel === 'Authoritative' || e.authorityLevel === 'Statutory')
  const sourceScore = hasAuthoritativeSources ? 92 : 68
  factors.push({
    id: 'source_authority',
    name: 'Statutory & Database Authority',
    score: sourceScore,
    weight: 0.3,
    status: sourceScore >= 80 ? 'positive' : 'warning',
    explanation: hasAuthoritativeSources
      ? 'Supported by primary statutory references (Patents Act 1970, BD Act 2002) and indexed TKDL/Ayush Pharmacopoeia records.'
      : 'Supported by secondary academic and preliminary regulatory guidance; primary case citations pending verification.',
  })

  // 2. Input Completeness & Botanical Specificity (Weight: 25%)
  let inputScore = 90
  const ingredientCount = formData.ingredients.length

  if (ingredientCount === 0) {
    inputScore -= 40
    missingInfo.push('No botanical actives or ingredients provided')
  } else {
    knownFacts.push(`${ingredientCount} defined botanical active(s): ${formData.ingredients.join(', ')}`)
  }

  if (!formData.ingredientSource || formData.ingredientSource === 'Unknown') {
    inputScore -= 25
    missingInfo.push('Biological sourcing chain / geographical procurement origin is unspecified')
  } else {
    knownFacts.push(`Procurement Origin: ${formData.ingredientSource}`)
  }

  if (!formData.productType || formData.productType === 'Not sure') {
    inputScore -= 20
    missingInfo.push('Uncertain therapeutic/commercial product classification')
  } else {
    knownFacts.push(`Product Class: ${formData.productType}`)
  }

  factors.push({
    id: 'input_completeness',
    name: 'Input Completeness & Lineage Data',
    score: Math.max(20, inputScore),
    weight: 0.25,
    status: inputScore >= 80 ? 'positive' : inputScore >= 50 ? 'warning' : 'negative',
    explanation:
      inputScore >= 80
        ? 'Botanical nomenclature, sourcing origin, and intended product category are explicitly defined.'
        : 'Missing critical lineage parameters (sourcing origin or standard botanical identifiers) required for definitive clearance.',
  })

  // 3. Multi-Jurisdictional Certainty (Weight: 25%)
  const targetMarkets = formData.targetMarkets || []
  let jurisScore = 85

  if (targetMarkets.includes('USA') && targetMarkets.includes('EU')) {
    jurisScore = 78
    knownFacts.push('Cross-regime compliance mapped across IPO, US FDA Botanical Guidance, and EU EMA THMPD.')
  } else if (targetMarkets.includes('India') && targetMarkets.length === 1) {
    jurisScore = 94
    knownFacts.push('High statutory certainty under Indian Patent Office (IPO) Guidelines for Ayush & TKDL.')
  } else {
    jurisScore = 80
    knownFacts.push(`Covered jurisdictions: ${targetMarkets.join(', ')}`)
  }

  if (targetMarkets.includes('Others')) {
    missingInfo.push('Target markets include unspecified countries; regional herbal compliance not fully codified')
    jurisScore -= 15
  }

  factors.push({
    id: 'jurisdiction_certainty',
    name: 'Jurisdictional Precedent & Regulatory Harmonization',
    score: jurisScore,
    weight: 0.25,
    status: jurisScore >= 80 ? 'positive' : 'warning',
    explanation:
      jurisScore >= 80
        ? 'Clear regulatory guidelines and established precedents exist for target market entry.'
        : 'Cross-border harmonization varies significantly across botanical drug vs dietary supplement pathways.',
  })

  // 4. Synergy & Obviousness Evidence Strength (Weight: 20%)
  let noveltyScore = 82

  if (formData.noveltyElements?.includes('Combination') && (formData.noveltyElements?.length || 0) === 1) {
    noveltyScore = 58
    missingInfo.push('Comparative synergistic bio-assay / isobologram data needed to overcome Section 3(e) mere admixture bar')
  } else if (formData.noveltyElements?.includes('Extraction') || formData.noveltyElements?.includes('Formulation')) {
    noveltyScore = 90
    knownFacts.push(`Novel technical features: ${formData.noveltyElements.join(', ')}`)
  }

  factors.push({
    id: 'synergy_evidence',
    name: 'Non-Obviousness & Synergy Proof Strength',
    score: noveltyScore,
    weight: 0.2,
    status: noveltyScore >= 75 ? 'positive' : 'warning',
    explanation:
      noveltyScore >= 75
        ? 'Technical differentiation (process/formulation/delivery) reduces Section 3(d)/3(e) obviousness vulnerability.'
        : 'Relies primarily on polyherbal combination; requires robust in-vitro/in-vivo synergistic validation.',
  })

  // Weighted aggregate score
  const overallScore = Math.round(
    factors.reduce((acc, factor) => acc + factor.score * factor.weight, 0)
  )

  let level: ConfidenceLevel = 'High'
  if (overallScore < 60) {
    level = 'Low'
  } else if (overallScore < 80) {
    level = 'Moderate'
  }

  // Explicit Abstention Trigger
  const isAbstaining = level === 'Low' || formData.ingredientSource === 'Unknown' || formData.ingredients.length === 0

  let abstentionReason: string | undefined
  if (isAbstaining) {
    if (formData.ingredients.length === 0) {
      abstentionReason = 'No botanical active ingredients provided to cross-reference against TKDL or Indian Patent Office indices.'
    } else if (formData.ingredientSource === 'Unknown') {
      abstentionReason = 'Unspecified biological source precludes definitive determination of Section 6 Biodiversity Act (NBA) approval requirements.'
    } else {
      abstentionReason = "We don't have sufficient authoritative evidence to provide a reliable conclusion. We recommend consulting a specialized IP attorney or regulatory expert."
    }
  }

  const recommendedAction = isAbstaining
    ? 'Escalate to a certified Ayurvedic IP Attorney or Ayush Regulatory Consultant for formal prior-art clearance.'
    : level === 'Moderate'
    ? 'Review identified missing items and furnish synergistic data prior to patent drafting.'
    : 'Evidence is strong and authoritative. Proceed to draft patent specifications and prepare Form 1/2 filing dossier.'

  return {
    level,
    overallScore,
    isAbstaining,
    abstentionReason,
    factors,
    knownFacts,
    missingInformation: missingInfo,
    recommendedAction,
  }
}
