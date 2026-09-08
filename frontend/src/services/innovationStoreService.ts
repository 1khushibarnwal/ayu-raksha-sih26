import type {
  SavedInnovation,
  InnovationFormData,
  AnalysisResult,
  AnalysisVersionSnapshot,
} from '../types/analyzer'

const STORAGE_KEY = 'ayuraksha_saved_innovations_v1'

const mockResult1: Partial<AnalysisResult> = {
  id: 'res-inv-001-v2',
  profile: {
    productName: 'AyurSnooze Stress Relief Matrix',
    productType: 'New formulation',
    ingredients: ['Ashwagandha (Withania somnifera)', 'Brahmi (Bacopa monnieri)', 'Jatamansi (Nardostachys jatamansi)'],
    ingredientSource: 'Cultivated',
    noveltyElements: ['Combination', 'Extraction', 'Formulation'],
    targetMarkets: ['India', 'USA', 'EU'],
    submittedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
  },
  aiClassification: {
    classification: 'Proprietary Polyherbal Nootropic Formulation',
    confidence: 91,
    explanation: 'Multi-target adaptogenic matrix utilizing supercritical CO2 enriched withanolides.',
    regulatoryCategory: 'Ayush ASU Patent / US Dietary Supplement',
    riskFactors: ['Section 3(p) TKDL Prior Art Citation Risk', 'Nagoya Protocol / ABS Compliance'],
  },
  traditionalKnowledgeRisk: {
    level: 'MEDIUM',
    score: 62,
    summary: 'Direct reference in Charaka Samhita Sutrasthana Ch. 4 for individual herbs.',
    identifiedClassicalReferencesCount: 4,
  },
  possibleMatches: [],
  ipPassport: {
    passportId: 'PASSPORT-IND-2026-8910',
    version: '2.0',
    generatedDate: new Date(Date.now() - 3600 * 1000 * 24).toISOString().split('T')[0],
    isMock: false,
    overallReadiness: 82,
    whyScoreAssigned: 'Supercritical CO2 lipid entrapment establishes technical differentiation.',
    identity: {
      product: 'AyurSnooze Stress Relief Matrix',
      ingredients: ['Ashwagandha', 'Brahmi', 'Jatamansi'],
      origin: 'Cultivated',
      organization: 'AyurVeda Labs',
    },
    ipStatus: {
      patent: 'Drafting Ready',
      trademark: 'Registered',
      design: 'Not Applicable',
      tradeSecret: 'Documented',
      gi: 'Not Applicable',
    },
    riskCompliance: {
      tkRisk: 'Medium (Prior Art Defensible)',
      absStatus: 'SBB Cultivated Exemption',
      regulatoryStatus: 'Ayush ASU Approved',
    },
    marketReadiness: {
      india: '88% Ready',
      usa: '78% Ready',
      eu: '72% Ready',
      japan: '65% Review Required',
      australia: '70% Ready',
    },
    evidenceReferences: [],
    nextSteps: ['File Indian priority patent', 'Submit SBB intimation slip'],
  },
  confidenceExplanation: {
    level: 'High',
    overallScore: 88,
    isAbstaining: false,
    factors: [
      {
        id: 'source_authority',
        name: 'Statutory & Database Authority',
        score: 92,
        weight: 0.3,
        status: 'positive',
        explanation: 'Supported by primary statutory references and verified TKDL references.',
      },
      {
        id: 'input_completeness',
        name: 'Input Completeness & Lineage Data',
        score: 88,
        weight: 0.25,
        status: 'positive',
        explanation: 'Complete botanical specifications and cultivated origin documented.',
      },
      {
        id: 'jurisdiction_certainty',
        name: 'Jurisdictional Precedent',
        score: 85,
        weight: 0.25,
        status: 'positive',
        explanation: 'Harmonized across India IPO and US FDA DSHEA regulations.',
      },
      {
        id: 'synergy_evidence',
        name: 'Non-Obviousness & Synergy Proof',
        score: 86,
        weight: 0.2,
        status: 'positive',
        explanation: 'Supercritical extraction data establishes technical differentiation.',
      },
    ],
    knownFacts: [
      '3 defined botanical active(s): Ashwagandha, Brahmi, Jatamansi',
      'Procurement Origin: Cultivated',
      'Product Class: New formulation',
      'Novel technical features: Combination, Extraction, Formulation',
    ],
    missingInformation: [
      'Comparative isobologram data required for definitive Section 3(e) grant',
    ],
    recommendedAction: 'Proceed to draft patent specifications and prepare Form 1/2 filing dossier.',
  },
  recommendations: [
    'Frame patent claims focusing on the specific ratio of withanolide-to-bacoside enrichment.',
    'File provisional application in IPO before any public exhibition or clinical preprint disclosure.',
  ],
  isMock: false,
}

const mockResult2: Partial<AnalysisResult> = {
  id: 'res-inv-002-v1',
  profile: {
    productName: 'Triphala-Curcumin Bioenhancer Gel',
    productType: 'Proprietary',
    ingredients: ['Amalaki (Phyllanthus emblica)', 'Bibhitaki (Terminalia bellirica)', 'Haritaki (Terminalia chebula)', 'Curcumin (Curcuma longa)'],
    ingredientSource: 'Traditional community',
    noveltyElements: ['Extraction', 'Formulation', 'Therapeutic use'],
    targetMarkets: ['India', 'USA'],
    submittedAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
  },
  aiClassification: {
    classification: 'Topical Bio-enhanced Phytopharmaceutical Matrix',
    confidence: 88,
    explanation: 'Topical transdermal delivery hydrogel combining Triphala polyphenols with nano-curcumin.',
    regulatoryCategory: 'Ayush ASU Patent / US Topical Cosmetic / OTC',
    riskFactors: ['NBA Benefit Sharing compliance needed for tribal procurement'],
  },
  traditionalKnowledgeRisk: {
    level: 'LOW',
    score: 34,
    summary: 'Topical transdermal hydrogel matrix is distinct from classical internal Rasayana churnas.',
    identifiedClassicalReferencesCount: 2,
  },
  possibleMatches: [],
  ipPassport: {
    passportId: 'PASSPORT-IND-2026-9044',
    version: '1.0',
    generatedDate: new Date(Date.now() - 3600 * 1000 * 48).toISOString().split('T')[0],
    isMock: false,
    overallReadiness: 88,
    whyScoreAssigned: 'Novel topical hydrogel delivery vehicle is highly defensible against Section 3(p).',
    identity: {
      product: 'Triphala-Curcumin Bioenhancer Gel',
      ingredients: ['Amalaki', 'Bibhitaki', 'Haritaki', 'Curcumin'],
      origin: 'Traditional community',
      organization: 'Vedic Health Labs',
    },
    ipStatus: {
      patent: 'Filing Ready',
      trademark: 'Pending',
      design: 'Not Applicable',
      tradeSecret: 'Documented',
      gi: 'Not Applicable',
    },
    riskCompliance: {
      tkRisk: 'Low Risk',
      absStatus: 'NBA Form I In Progress',
      regulatoryStatus: 'Ayush Topical Cleared',
    },
    marketReadiness: {
      india: '92% Ready',
      usa: '84% Ready',
      eu: '78% Ready',
      japan: '70% Ready',
      australia: '75% Ready',
    },
    evidenceReferences: [],
    nextSteps: ['Execute NBA Benefit Sharing agreement', 'File US MoCRA listing'],
  },
  confidenceExplanation: {
    level: 'High',
    overallScore: 91,
    isAbstaining: false,
    factors: [
      {
        id: 'source_authority',
        name: 'Statutory & Database Authority',
        score: 94,
        weight: 0.3,
        status: 'positive',
        explanation: 'Fully cited with OECD dermal safety protocols and Indian Patent Act guidelines.',
      },
      {
        id: 'input_completeness',
        name: 'Input Completeness',
        score: 92,
        weight: 0.25,
        status: 'positive',
        explanation: 'All 4 actives and delivery matrix properties clearly specified.',
      },
      {
        id: 'jurisdiction_certainty',
        name: 'Jurisdiction Harmonization',
        score: 90,
        weight: 0.25,
        status: 'positive',
        explanation: 'Unambiguous classification under US MoCRA and Indian ASU regulations.',
      },
      {
        id: 'synergy_evidence',
        name: 'Novelty & Non-Obviousness',
        score: 88,
        weight: 0.2,
        status: 'positive',
        explanation: 'Physical carrier matrix provides high defensibility against Section 3(p) objections.',
      },
    ],
    knownFacts: [
      '4 defined botanical active(s): Amalaki, Bibhitaki, Haritaki, Curcumin',
      'Procurement Origin: Traditional community',
      'Product Class: Proprietary',
      'Novel technical features: Extraction, Formulation, Therapeutic use',
    ],
    missingInformation: [],
    recommendedAction: 'Execute NBA Benefit Sharing agreement and proceed with simultaneous Indian patent filing.',
  },
  recommendations: [
    'Complete the OECD 404 skin irritation study at a GLP-certified laboratory.',
    'File NBA Form I for traditional community benefit-sharing before filing PCT patent.',
  ],
  isMock: false,
}

const initialMockInnovations: SavedInnovation[] = [
  {
    id: 'INV-2026-001',
    name: 'AyurSnooze Stress Relief Matrix',
    productType: 'New formulation',
    ingredients: ['Ashwagandha (Withania somnifera)', 'Brahmi (Bacopa monnieri)', 'Jatamansi (Nardostachys jatamansi)'],
    targetMarkets: ['India', 'USA', 'EU'],
    currentVersion: 2,
    isStale: false,
    lastAnalyzedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    currentFormData: {
      productName: 'AyurSnooze Stress Relief Matrix',
      productType: 'New formulation',
      ingredients: ['Ashwagandha (Withania somnifera)', 'Brahmi (Bacopa monnieri)', 'Jatamansi (Nardostachys jatamansi)'],
      ingredientSource: 'Cultivated',
      noveltyElements: ['Combination', 'Extraction', 'Formulation'],
      targetMarkets: ['India', 'USA', 'EU'],
    },
    currentResult: mockResult1 as AnalysisResult,
    versions: [
      {
        version: 1,
        createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 14).toISOString(),
        summary: 'Initial formulation analysis (Ashwagandha & Brahmi crude powder combination). High Section 3(p) risk identified.',
        readinessScore: 54,
        riskLevel: 'HIGH',
        confidenceScore: 72,
        formData: {
          productName: 'AyurSnooze Stress Relief Matrix',
          productType: 'Classical',
          ingredients: ['Ashwagandha (Withania somnifera)', 'Brahmi (Bacopa monnieri)'],
          ingredientSource: 'Supplier',
          noveltyElements: ['Combination'],
          targetMarkets: ['India'],
        },
        result: {} as any,
      },
      {
        version: 2,
        createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
        summary: 'Updated to standardized CO2 extract with Jatamansi synergistic tertiary active and liposomal delivery.',
        readinessScore: 82,
        riskLevel: 'MEDIUM',
        confidenceScore: 88,
        formData: {
          productName: 'AyurSnooze Stress Relief Matrix',
          productType: 'New formulation',
          ingredients: ['Ashwagandha (Withania somnifera)', 'Brahmi (Bacopa monnieri)', 'Jatamansi (Nardostachys jatamansi)'],
          ingredientSource: 'Cultivated',
          noveltyElements: ['Combination', 'Extraction', 'Formulation'],
          targetMarkets: ['India', 'USA', 'EU'],
        },
        result: mockResult1 as AnalysisResult,
      },
    ],
  },
  {
    id: 'INV-2026-002',
    name: 'Triphala-Curcumin Bioenhancer Gel',
    productType: 'Proprietary',
    ingredients: ['Amalaki (Phyllanthus emblica)', 'Bibhitaki (Terminalia bellirica)', 'Haritaki (Terminalia chebula)', 'Curcumin (Curcuma longa)'],
    targetMarkets: ['India', 'USA'],
    currentVersion: 1,
    isStale: false,
    lastAnalyzedAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    currentFormData: {
      productName: 'Triphala-Curcumin Bioenhancer Gel',
      productType: 'Proprietary',
      ingredients: ['Amalaki (Phyllanthus emblica)', 'Bibhitaki (Terminalia bellirica)', 'Haritaki (Terminalia chebula)', 'Curcumin (Curcuma longa)'],
      ingredientSource: 'Traditional community',
      noveltyElements: ['Extraction', 'Formulation', 'Therapeutic use'],
      targetMarkets: ['India', 'USA'],
    },
    currentResult: mockResult2 as AnalysisResult,
    versions: [
      {
        version: 1,
        createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
        summary: 'Initial transdermal hydrogel formulation. Highly favorable prior-art profile.',
        readinessScore: 88,
        riskLevel: 'LOW',
        confidenceScore: 91,
        formData: {
          productName: 'Triphala-Curcumin Bioenhancer Gel',
          productType: 'Proprietary',
          ingredients: ['Amalaki (Phyllanthus emblica)', 'Bibhitaki (Terminalia bellirica)', 'Haritaki (Terminalia chebula)', 'Curcumin (Curcuma longa)'],
          ingredientSource: 'Traditional community',
          noveltyElements: ['Extraction', 'Formulation', 'Therapeutic use'],
          targetMarkets: ['India', 'USA'],
        },
        result: mockResult2 as AnalysisResult,
      },
    ],
  },
]

export function getSavedInnovations(): SavedInnovation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (err) {
    console.error('Failed to load saved innovations:', err)
  }
  saveAllInnovations(initialMockInnovations)
  return initialMockInnovations
}

export function saveAllInnovations(innovations: SavedInnovation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(innovations))
  } catch (err) {
    console.error('Failed to save innovations:', err)
  }
}

export function getInnovationById(id: string): SavedInnovation | undefined {
  const all = getSavedInnovations()
  return all.find((inv) => inv.id === id)
}

export function saveOrUpdateInnovation(
  formData: InnovationFormData,
  result: AnalysisResult,
  existingId?: string
): SavedInnovation {
  const currentList = getSavedInnovations()
  const name = formData.productName?.trim() || `Ayurvedic Innovation #${currentList.length + 1}`

  if (existingId) {
    const idx = currentList.findIndex((i) => i.id === existingId)
    if (idx !== -1) {
      const existing = currentList[idx]
      const updatedVersion = existing.currentVersion + 1

      const newSnapshot: AnalysisVersionSnapshot = {
        version: updatedVersion,
        createdAt: new Date().toISOString(),
        summary: `Re-analyzed formulation with ${formData.ingredients.length} active(s) and ${formData.noveltyElements.length} novel feature(s).`,
        readinessScore: result.ipPassport?.overallReadiness || 75,
        riskLevel: result.traditionalKnowledgeRisk?.level || 'MEDIUM',
        confidenceScore: result.confidenceExplanation?.overallScore || 85,
        formData: { ...formData },
        result: { ...result },
      }

      existing.name = name
      existing.productType = (formData.productType as any) || 'New formulation'
      existing.ingredients = [...formData.ingredients]
      existing.targetMarkets = [...formData.targetMarkets]
      existing.currentVersion = updatedVersion
      existing.isStale = false
      existing.lastAnalyzedAt = new Date().toISOString()
      existing.currentFormData = { ...formData }
      existing.currentResult = { ...result }
      existing.versions.unshift(newSnapshot)

      saveAllInnovations(currentList)
      return existing
    }
  }

  // Create brand new
  const randomId = `INV-2026-${Math.floor(100 + Math.random() * 900)}`
  const newSnapshot: AnalysisVersionSnapshot = {
    version: 1,
    createdAt: new Date().toISOString(),
    summary: `Initial baseline analysis across ${formData.targetMarkets.join(', ')} markets.`,
    readinessScore: result.ipPassport?.overallReadiness || 75,
    riskLevel: result.traditionalKnowledgeRisk?.level || 'MEDIUM',
    confidenceScore: result.confidenceExplanation?.overallScore || 85,
    formData: { ...formData },
    result: { ...result },
  }

  const newInv: SavedInnovation = {
    id: randomId,
    name,
    productType: (formData.productType as any) || 'New formulation',
    ingredients: [...formData.ingredients],
    targetMarkets: [...formData.targetMarkets],
    currentVersion: 1,
    isStale: false,
    lastAnalyzedAt: new Date().toISOString(),
    currentFormData: { ...formData },
    currentResult: { ...result },
    versions: [newSnapshot],
  }

  const updated = [newInv, ...currentList]
  saveAllInnovations(updated)
  return newInv
}

export function markInnovationStale(id: string): void {
  const currentList = getSavedInnovations()
  const inv = currentList.find((i) => i.id === id)
  if (inv) {
    inv.isStale = true
    saveAllInnovations(currentList)
  }
}

export function deleteInnovation(id: string): void {
  const currentList = getSavedInnovations()
  const updated = currentList.filter((i) => i.id !== id)
  saveAllInnovations(updated)
}
