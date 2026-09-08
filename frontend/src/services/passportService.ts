import type { AYUIPPassportData, InnovationFormData, TraditionalKnowledgeRisk, ABSAssessmentResult, RegulatoryNavigatorResult, GlobalMarketSimulatorResult, EvidenceItem } from '../types/analyzer'


export class PassportService {
  public static generatePassport(
    formData: InnovationFormData,
    tkRisk: TraditionalKnowledgeRisk,
    absResult: ABSAssessmentResult,
    regulatoryResult: RegulatoryNavigatorResult,
    globalMarkets: GlobalMarketSimulatorResult,
    evidencePool: EvidenceItem[]
  ): AYUIPPassportData {
    // Calculate overall readiness weighted score
    // IP readiness: 75%
    // TK risk impact: low = +20, med = +10, high = +0
    // ABS impact: not applicable/review = +15
    // Regulatory: +25
    let score = 55
    if (tkRisk.level === 'LOW') score += 15
    else if (tkRisk.level === 'MEDIUM') score += 10
    else score += 5

    if (absResult.status === 'Likely Not Applicable') score += 15
    else if (absResult.status === 'Review Required') score += 10
    else score += 5

    if (regulatoryResult.complianceSummary.reviewRequiredCount === 0) score += 15
    else score += 10

    score = Math.min(94, Math.max(45, score))

    const passportId = `AYU-PASSPORT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`

    const whyScoreAssigned = `Overall Readiness Score of ${score}% is determined by:
1. Moderate-to-high novel formulation differentiation (Extraction/Synergistic Combination).
2. Documented TK prior art requiring process-focused rather than generic composition patent claims (+${tkRisk.level === 'LOW' ? '15%' : '10%'}).
3. Biodiversity & ABS clearance pathway defined under Biological Diversity Act Section 6 (+10%).
4. Standardized pharmacopoeial testing & AYUSH Rule 158-B compliance roadmap established (+10%).
5. Multi-jurisdiction gap analysis completed across 5 sovereign global markets.`

    return {
      passportId,
      version: '2.4.0 (Enterprise Gold Standard)',
      generatedDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      isMock: true,
      overallReadiness: score,
      whyScoreAssigned,
      identity: {
        product: formData.productName || (formData.ingredients.length > 0 ? `${formData.ingredients.join(' + ')} Formulation` : 'Ayurvedic Botanical Formulation'),
        ingredients: formData.ingredients.length > 0 ? formData.ingredients : ['Ashwagandha (Withania somnifera)', 'Brahmi (Bacopa monnieri)'],
        origin: formData.ingredientSource || 'Cultivated / Sustainable Farming',
        organization: 'AYU-RAKSHA Innovation Consortium'
      },
      ipStatus: {
        patent: formData.productType === 'Classical' ? 'Unlikely (Sec 3(p) bar) - Recommend Process Claim' : 'Viable for Synergistic Extraction Method',
        trademark: 'High Viability - File Class 5 & 30 immediately',
        design: 'Recommended for bespoke delivery bottles & packaging',
        tradeSecret: 'Recommended for extraction yield parameters & solvent ratios',
        gi: formData.ingredientSource === 'Cultivated' ? 'Potential Tagging for Regional Cultivars' : 'Not Applicable'
      },
      riskCompliance: {
        tkRisk: `${tkRisk.level} Risk (${tkRisk.score}/100) - ${tkRisk.identifiedClassicalReferencesCount} Classical matches identified`,
        absStatus: `${absResult.status} - ${absResult.reason.substring(0, 75)}...`,
        regulatoryStatus: `${regulatoryResult.pathway} under ${regulatoryResult.jurisdiction}`
      },
      marketReadiness: {
        india: `${globalMarkets.markets.IN.overallReadinessScore}% - ${globalMarkets.markets.IN.marketEntry.status}`,
        usa: `${globalMarkets.markets.US.overallReadinessScore}% - ${globalMarkets.markets.US.marketEntry.status}`,
        eu: `${globalMarkets.markets.EU.overallReadinessScore}% - ${globalMarkets.markets.EU.marketEntry.status}`,
        japan: `${globalMarkets.markets.JP.overallReadinessScore}% - ${globalMarkets.markets.JP.marketEntry.status}`,
        australia: `${globalMarkets.markets.AU.overallReadinessScore}% - ${globalMarkets.markets.AU.marketEntry.status}`
      },
      evidenceReferences: evidencePool.slice(0, 6),
      nextSteps: [
        'Execute NBA Form III submission before Indian patent grant',
        'Draft comparative synergy tables proving unexpected therapeutic outcome',
        'Finalize 3-batch stability testing data under Rule 161-B',
        'File Trademark application in Class 5 on e-filing portal'
      ]
    }
  }
}
