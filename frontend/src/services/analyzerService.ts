import type {
  InnovationFormData,
  AnalysisResult,
  TraditionalKnowledgeMatch,
  RiskLevel,
  IPProtectionStrategyResult,
  IPRiskCenterResult,
  ABSAssessmentResult,
  RegulatoryNavigatorResult,
  EvidenceLockerItem,
  EvidenceLockerResult,
  MarketReadinessData,
} from '../types/analyzer'
import { MarketService } from './marketService'
import { PassportService } from './passportService'
import { RoadmapService } from './roadmapService'
import { ActionCenterService } from './actionCenterService'
import { calculateConfidence } from './confidenceService'



export async function analyzeInnovation(
  formData: InnovationFormData,
): Promise<AnalysisResult> {
  // Simulate realistic analysis time
  await new Promise((resolve) => setTimeout(resolve, 1400))

  const lowerIngredients = formData.ingredients.map((i) => i.toLowerCase())
  const hasAshwagandha = lowerIngredients.some((i) => i.includes('ashwagandha') || i.includes('withania'))
  const hasTurmeric = lowerIngredients.some((i) => i.includes('turmeric') || i.includes('haridra') || i.includes('curcum'))
  const hasNeem = lowerIngredients.some((i) => i.includes('neem') || i.includes('nimba') || i.includes('azadirachta'))
  const hasTriphala = lowerIngredients.some((i) => i.includes('triphala') || i.includes('amla') || i.includes('haritaki'))
  const hasBrahmi = lowerIngredients.some((i) => i.includes('brahmi') || i.includes('bacopa') || i.includes('shankhpushpi'))
  const hasGiloy = lowerIngredients.some((i) => i.includes('giloy') || i.includes('guduchi') || i.includes('tinospora'))
  const hasGuggulu = lowerIngredients.some((i) => i.includes('guggulu') || i.includes('commiphora'))

  // Novelty elements
  const isNovelCombination = formData.noveltyElements.includes('Combination')
  const isNovelExtraction = formData.noveltyElements.includes('Extraction')
  const isNovelManufacturing = formData.noveltyElements.includes('Manufacturing')
  const isNovelDosage = formData.noveltyElements.includes('Dosage') || formData.noveltyElements.includes('Formulation')

  // Calculate Traditional Knowledge Risk Score
  let tkScore = 72
  if (formData.productType === 'Classical') {
    tkScore = 95
  } else if (formData.productType === 'Proprietary') {
    tkScore = 82
  } else if (formData.productType === 'New formulation') {
    tkScore = 76
  } else if (formData.productType === 'Phytopharmaceutical') {
    tkScore = 64
  } else if (formData.productType === 'Ayurveda-Aahar') {
    tkScore = 88
  } else if (formData.productType === 'Cosmetic') {
    tkScore = 70
  }

  // Adjust by novelty
  if (isNovelExtraction) tkScore -= 8
  if (isNovelManufacturing) tkScore -= 6
  if (isNovelDosage) tkScore -= 5
  if (formData.ingredientSource === 'Traditional community') tkScore += 8
  if (formData.ingredientSource === 'Wild sourced') tkScore += 4
  if (formData.ingredientSource === 'Cultivated') tkScore -= 3

  // Clamp score
  tkScore = Math.min(96, Math.max(25, tkScore))

  let riskLevel: RiskLevel = 'HIGH'
  if (tkScore < 50) {
    riskLevel = 'LOW'
  } else if (tkScore < 75) {
    riskLevel = 'MEDIUM'
  } else {
    riskLevel = 'HIGH'
  }

  // AI Classification
  let classificationTitle = 'Proprietary Ayurvedic Formulation'
  let confidence = 91
  let regulatoryCategory = 'Drugs & Cosmetics Rules 1945, Rule 158B'
  let explanation = ''

  if (formData.productType === 'Classical') {
    classificationTitle = 'Classical Ayurvedic Medicine (Samhita Formula)'
    confidence = 94
    regulatoryCategory = 'First Schedule of Drugs & Cosmetics Act, 1940'
    explanation = 'The submitted formulation directly references codified authoritative texts in the First Schedule. Because the ingredients (' + formData.ingredients.slice(0, 3).join(', ') + ') are classical actives with traditional processing, this is categorized as a classical ASU formulation requiring text validation rather than full synthetic clinical trials.'
  } else if (formData.productType === 'Phytopharmaceutical') {
    classificationTitle = 'Phytopharmaceutical Drug Innovation'
    confidence = 88
    regulatoryCategory = 'Phytopharmaceutical Drugs Gazette (Schedule Y / CT Rules 2019)'
    explanation = 'The inclusion of standardized extracts and novel processing classifies this product under Phytopharmaceutical Drug regulations. It utilizes enriched fractions with quantified active markers for targeted therapeutic applications.'
  } else if (formData.productType === 'Ayurveda-Aahar') {
    classificationTitle = 'Ayurveda Aahar (Food / Nutraceutical)'
    confidence = 92
    regulatoryCategory = 'FSSAI (Ayurveda Aahar) Regulations, 2022'
    explanation = 'The formulation comprises food-grade traditional herbs (' + formData.ingredients.slice(0, 3).join(', ') + ') tailored for daily nutritional support and wellness maintenance without claims of treating severe acute pathology.'
  } else if (formData.productType === 'Cosmetic') {
    classificationTitle = 'Ayurvedic Cosmeceutical (Topical Standard)'
    confidence = 90
    regulatoryCategory = 'Bureau of Indian Standards (BIS) & ASU Cosmetic Guidelines'
    explanation = 'Formulated with dermal-enhancing traditional herbs for external application. Classified under ASU cosmetics, exempt from invasive toxicity protocols when adhering to approved classical adjuvant ratios.'
  } else {
    classificationTitle = 'Proprietary Ayurvedic Formulation'
    confidence = 91
    regulatoryCategory = 'Drugs & Cosmetics Rules 1945, Rule 158B'
    explanation = 'The formulation appears to be proprietary because the submitted innovation combines traditional Ayurvedic ingredients (' + (formData.ingredients.slice(0, 3).join(', ') || 'selected herbs') + ') in a novel ' + (formData.noveltyElements.join(' and ') || 'formulation and manufacturing approach') + '. While the ingredients possess established traditional use, the novel combination and processing make it an independent proprietary ASU formulation.'
  }

  // Generate Possible Matches
  const possibleMatches: TraditionalKnowledgeMatch[] = []

  if (hasAshwagandha || lowerIngredients.length === 0) {
    possibleMatches.push({
      id: 'match-1',
      name: 'Ashwagandhadi Lehya / Churna Classical Formulations',
      classicalContext: 'Charaka Samhita (Rasayana Adhyaya 1:2) & Sharangadhara Samhita',
      similarity: isNovelCombination ? 87 : 93,
      matchReason: 'Direct overlap in primary botanical constituent (Withania somnifera) utilized for vitality (Balya), stress-reduction (Nidrajanana), and tissue regeneration (Rasayana).',
      matchedIngredients: ['Ashwagandha (Withania somnifera)'],
      evidence: {
        sourceTitle: 'Traditional Knowledge Digital Library (TKDL) Formulation Registry',
        sourceType: 'TKDL Database',
        jurisdiction: 'India (IPO/AYUSH/NBA)',
        publication: 'TKDL India - Council of Scientific & Industrial Research (CSIR)',
        reference: 'TKDL-AY-CSIR-2018/ASW-4412',
        url: 'https://www.tkdl.res.in',
        excerpt: 'Codified classical text records Withania somnifera root processed in milk decoction (Ksheerapaka) for promoting strength, vigor, and neurological resilience.',
        relevance: isNovelCombination ? 0.87 : 0.93,
      },
    })
  }

  if (hasTurmeric || hasNeem) {
    possibleMatches.push({
      id: 'match-2',
      name: 'Nisha-Amalaki & Haridra Khanda Formulations',
      classicalContext: 'Ashtanga Hridaya (Uttara Tantra) & Sushruta Samhita (Chikitsa Sthana 11)',
      similarity: 84,
      matchReason: 'Traditional synergy between Curcuma longa and bitter detoxifying actives for metabolic balance (Pramehahara) and dermal purification (Kushtaghna).',
      matchedIngredients: ['Turmeric (Curcuma longa)', 'Neem (Azadirachta indica)'].filter((i) =>
        lowerIngredients.some((li) => i.toLowerCase().includes(li)),
      ),
      evidence: {
        sourceTitle: 'Ayurvedic Pharmacopoeia of India (API) Part II, Vol I',
        sourceType: 'Pharmacopoeia',
        jurisdiction: 'India (IPO/AYUSH/NBA)',
        publication: 'Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)',
        reference: 'API-FORM-VOL1-HK04',
        excerpt: 'Haridra combined with bitter adjuvant actives is prescribed for tissue cleansing, blood detox (Rakta Shodhana), and glycemic balance across 14 classical compendia.',
        relevance: 0.84,
      },
    })
  }

  if (hasTriphala || hasGiloy || hasBrahmi || hasGuggulu) {
    possibleMatches.push({
      id: 'match-3',
      name: 'Triphala-Guduchi Medhya Rasayana Synergy',
      classicalContext: 'Bhavaprakasha Nighantu (Haritakyadi Varga)',
      similarity: 78,
      matchReason: 'Classic bio-enhancement combination documented for enhancing cellular assimilation (Deepana-Pachana) and cognitive longevity (Medhya).',
      matchedIngredients: ['Triphala', 'Giloy (Guduchi)', 'Brahmi'].filter((i) =>
        lowerIngredients.some((li) => i.toLowerCase().includes(li)),
      ),
      evidence: {
        sourceTitle: 'Central Council for Research in Ayurvedic Sciences (CCRAS) Formulary',
        sourceType: 'Classical Text',
        jurisdiction: 'India (IPO/AYUSH/NBA)',
        publication: 'Ministry of Ayush, Government of India',
        reference: 'CCRAS-MED-2021/SYN-109',
        url: 'https://ccras.nic.in',
        excerpt: 'Synergistic polyherbal extract demonstrating antioxidant free-radical scavenging with zero reported adverse cytotoxicity in standard historical records.',
        relevance: 0.78,
      },
    })
  }

  if (possibleMatches.length === 0) {
    possibleMatches.push({
      id: 'match-default',
      name: 'Ayurvedic Classical Polyherbal Compound Matrix',
      classicalContext: 'Charaka Samhita (Sutra Sthana, Chapter 4 - Shad Virechana Shatashritiya)',
      similarity: 72,
      matchReason: 'The selected botanical ingredients have documented therapeutic properties in classical Ayurvedic pharmacopeia for metabolic and restorative balancing.',
      matchedIngredients: formData.ingredients.slice(0, 3),
      evidence: {
        sourceTitle: 'Traditional Knowledge Digital Library (TKDL) Prior Art Index',
        sourceType: 'TKDL Database',
        jurisdiction: 'India (IPO/AYUSH/NBA)',
        publication: 'National Institute of Science Communication and Policy Research (NIScPR)',
        reference: 'TKDL-GEN-2023-AY08',
        url: 'https://www.tkdl.res.in',
        excerpt: 'Polyherbal compositions incorporating native Indian medicinal plants are extensively indexed under Section 3(p) prior art references.',
        relevance: 0.72,
      },
    })
  }

  // Generate IP Protection Strategy (Feature 7)
  const isProcessNovel = isNovelExtraction || isNovelManufacturing
  const hasNovelPackaging = formData.noveltyElements.includes('Packaging')

  const ipStrategy: IPProtectionStrategyResult = {
    summary: `Strategic analysis identifies ${
      isProcessNovel ? 'Process Patent and Trademark' : 'Trademark and Trade Secret'
    } as primary routes. Composition claims face statutory hurdles under Section 3(p) unless synergistic co-action is experimentally established under Section 3(e).`,
    routes: [
      {
        id: 'route-patent',
        route: 'Patent',
        status: isProcessNovel ? 'Recommended' : 'Investigate',
        reason: isProcessNovel
          ? 'Novel extraction or manufacturing methodology qualifies for a Process/Method Patent under Section 2(1)(j), provided temperature, solvent ratios, or extraction yield parameters demonstrate non-obvious industrial application.'
          : 'Direct composition patents for traditional Ayurvedic herbs face severe Section 3(p) exclusions as traditional knowledge. You must establish synergistic bio-enhancement under Section 3(e) to overcome objections.',
        keyConsiderations: [
          'Novelty: Must not be disclosed in TKDL or public domain prior art.',
          'Inventive Step: Must produce unexpected technical effect / synergy.',
          'Section 3(p): Excludes inventions which in effect are traditional knowledge.',
          'Section 3(e): Excludes mere admixture resulting only in aggregation of properties.',
        ],
        suggestedAction: isProcessNovel
          ? 'Draft patent claims focusing strictly on the specialized extraction process and novel fraction ratios rather than the raw plant material.'
          : 'Conduct in-vitro / in-vivo synergy index testing (Chou-Talalay method) to prepare Section 3(e) comparative experimental data before filing.',
        evidence: [
          {
            sourceTitle: 'Indian Patents Act, 1970 — Section 3(p) & Section 3(e)',
            sourceType: 'Patent Law / Statute',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Office of the Controller General of Patents, Designs and Trade Marks (CGPDTM)',
            reference: 'Patents Act 1970, Sec 3(p), 3(e)',
            url: 'https://ipindia.gov.in',
            excerpt:
              'The following are not inventions within the meaning of this Act: an invention which in effect is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components [Sec 3(p)]; a substance obtained by a mere admixture resulting only in the aggregation of the properties of the components thereof [Sec 3(e)].',
            relevance: 0.98,
          },
          {
            sourceTitle: 'Guidelines for Examination of Patent Applications in the Field of Traditional Knowledge',
            sourceType: 'Patent Law / Statute',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'CGPDTM Patent Office Guidelines, 2012',
            reference: 'CGPDTM/TK-GUIDELINES/2012-P14',
            excerpt:
              'When the combination of known traditional herbs produces synergistic therapeutic efficacy which could not have been predicted from individual constituents, claims to such compositions accompanied by comparative efficacy data may be considered patentable.',
            relevance: 0.92,
          },
        ],
      },
      {
        id: 'route-trademark',
        route: 'Trademark',
        status: 'Recommended',
        reason:
          'Protect brand identity, distinctive product name, and logo under Classes 5 (Pharmaceuticals/Ayurvedic preparations) and 30/32 (Ayurveda Aahar / Dietary Supplements). Trademarks provide immediate commercial exclusivity.',
        keyConsiderations: [
          'Distinctiveness: Avoid purely descriptive Sanskrit terms (e.g. "Pure Ashwagandha Churna").',
          'Search: Conduct phonetic similarity search across registered Class 5 marks.',
          'Protection: Valid for 10 years and perpetually renewable.',
        ],
        suggestedAction: `File trademark application under Class 5 (and Class 30 if Ayurveda Aahar) for "${formData.productName || 'Your Brand Name'}" at IP India portal.`,
        evidence: [
          {
            sourceTitle: 'The Trade Marks Act, 1999 — Section 9 & 11',
            sourceType: 'Patent Law / Statute',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Trade Marks Registry, Government of India',
            reference: 'Trade Marks Act 1999, Sec 9(1)(b)',
            excerpt:
              'Trade marks which consist exclusively of marks or indications which may serve in trade to designate the kind, quality, quantity, intended purpose, values, geographical origin of the goods shall not be registered unless they have acquired a distinctive character.',
            relevance: 0.89,
          },
        ],
      },
      {
        id: 'route-design',
        route: 'Design',
        status: hasNovelPackaging ? 'Recommended' : 'Investigate',
        reason: hasNovelPackaging
          ? 'Novel aesthetic shape, applicator bottle, dual-chamber dispenser, or blister packaging can be registered under the Designs Act, 2000 to prevent competitors from copying physical appearance.'
          : 'Standard packaging formats have limited registrability. If developing custom dispenser bottles, blister arrays, or wearable delivery tools, design registration is strongly recommended.',
        keyConsiderations: [
          'Novelty: Must be new or original and not previously published in any country.',
          'Exclusion: Does not cover functional mechanism or internal chemical composition.',
          'Duration: 10 years, extendable by 5 years.',
        ],
        suggestedAction: 'Capture orthographic CAD drawings of unique delivery packaging and file Form-1 with the Kolkata Patent/Design Office.',
        evidence: [
          {
            sourceTitle: 'Designs Act, 2000 & Design Rules, 2001 (Locarno Classification)',
            sourceType: 'Patent Law / Statute',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Controller General of Patents, Designs and Trade Marks',
            reference: 'Designs Act 2000, Sec 4 & 5',
            excerpt:
              'A design which is significantly distinguishable from known designs or combination of known designs is eligible for registration under Class 09 (Packaging & Containers).',
            relevance: 0.82,
          },
        ],
      },
      {
        id: 'route-trade-secret',
        route: 'Trade Secret',
        status: 'Recommended',
        reason:
          'Proprietary extraction ratios, fermentation temperatures, bio-fractionation parameters, and blending sequences should be guarded as Trade Secrets under confidential NDA / non-compete agreements with manufacturing vendors.',
        keyConsiderations: [
          'Secrecy Measures: Strict NDAs, role-based access control, and cleanroom segregation.',
          'No Expiry: Protects proprietary manufacturing knowledge indefinitely as long as kept confidential.',
          'Contractual Remedies: Enforceable under Indian Contract Act, 1872 Section 27 jurisprudence.',
        ],
        suggestedAction: 'Implement tiered non-disclosure agreements (NDAs) with manufacturing partners and fragment extraction formula stages.',
        evidence: [
          {
            sourceTitle: 'Protection of Undisclosed Information — TRIPS Article 39',
            sourceType: 'Patent Law / Statute',
            jurisdiction: 'WIPO / International',
            publication: 'WTO Agreement on Trade-Related Aspects of Intellectual Property Rights',
            reference: 'TRIPS Art. 39(2)',
            excerpt:
              'Natural and legal persons shall have the possibility of preventing information lawfully within their control from being disclosed to, acquired by, or used by others without their consent in a manner contrary to honest commercial practices.',
            relevance: 0.86,
          },
        ],
      },
      {
        id: 'route-gi',
        route: 'Geographical Indication (GI)',
        status: formData.ingredientSource === 'Traditional community' || formData.ingredientSource === 'Wild sourced' ? 'Investigate' : 'Not applicable / uncertain',
        reason:
          formData.ingredientSource === 'Traditional community' || formData.ingredientSource === 'Wild sourced'
            ? 'If raw botanical materials are sourced from specific registered GI territories (e.g. Malabar Pepper, Naga Mircha, Kangra Tea), product labelling can leverage authorized GI user status.'
            : 'Individual entities cannot privately own a GI; GIs belong to collective community associations. Ensure sourcing authenticity to avoid deceptive origin claims.',
        keyConsiderations: [
          'Collective Right: GIs cannot be individually patented or owned by a single private corporation.',
          'Authorized User: Apply as an authorized producer if processing herbs within defined GI regions.',
        ],
        suggestedAction: 'Verify whether regional botanicals are registered under the GI Registry and apply for Authorized User status under Form GI-3.',
        evidence: [
          {
            sourceTitle: 'Geographical Indications of Goods (Registration and Protection) Act, 1999',
            sourceType: 'Patent Law / Statute',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Geographical Indications Registry, Chennai',
            reference: 'GI Act 1999, Sec 17',
            excerpt:
              'Any person claiming to be the producer of goods in respect of which a geographical indication has been registered may apply to the Registrar for registration as an authorized user.',
            relevance: 0.78,
          },
        ],
      },
    ],
  }

  // Generate IP Risk Center (Feature 8)
  const patentNoveltyScore = isProcessNovel ? 42 : isNovelCombination ? 68 : 84
  const regulatoryRiskScore = formData.productType === 'Classical' ? 32 : formData.productType === 'Phytopharmaceutical' ? 78 : 56
  const absRiskScore = formData.ingredientSource === 'Wild sourced' || formData.ingredientSource === 'Traditional community' ? 82 : formData.ingredientSource === 'Cultivated' ? 38 : 60
  const internationalScore = formData.targetMarkets.includes('USA') || formData.targetMarkets.includes('EU') ? 72 : 35

  const overallScore = Math.round(
    tkScore * 0.3 +
    patentNoveltyScore * 0.25 +
    regulatoryRiskScore * 0.2 +
    absRiskScore * 0.15 +
    internationalScore * 0.1
  )

  const overallRiskLevel: RiskLevel = overallScore > 70 ? 'HIGH' : overallScore > 40 ? 'MEDIUM' : 'LOW'

  const ipRiskCenter: IPRiskCenterResult = {
    overallScore,
    overallLevel: overallRiskLevel,
    overallSummary: `Weighted risk index of ${overallScore}/100 driven by classical TK prior-art overlap (${tkScore}/100) and ${
      absRiskScore > 50 ? 'biological resource ABS compliance' : 'patent Section 3(e) synergy requirements'
    }.`,
    dimensions: [
      {
        id: 'tk',
        name: 'Traditional Knowledge Prior Art Risk',
        shortLabel: 'TK Risk',
        score: tkScore,
        level: riskLevel,
        weight: 30,
        whyAssigned:
          riskLevel === 'HIGH'
            ? 'Ingredients directly match codified formulations in Ayurvedic Pharmacopoeia and TKDL registries.'
            : 'Formulation uses traditional herbs with modern processing modifications.',
        relevantRule: 'Indian Patents Act Section 3(p) & TKDL Prior Art Defensive Registry',
        recommendedAction: 'Execute a comprehensive TKDL prior art search before drafting composition claims.',
        factors: [
          {
            factor: 'Botanical Overlap in Samhitas',
            contribution: 45,
            description: `Primary active botanicals (${formData.ingredients.slice(0, 2).join(', ') || 'herbs'}) are cited in classical texts for equivalent therapeutic indications.`,
            evidence: [
              {
                sourceTitle: 'TKDL Prior Art Database',
                sourceType: 'TKDL Database',
                jurisdiction: 'India (IPO/AYUSH/NBA)',
                publication: 'Council of Scientific & Industrial Research (CSIR)',
                reference: 'TKDL-AY-PRIOR-ART-2024',
                excerpt: 'Classical Ayurvedic formulations containing these actives are comprehensively indexed to prevent improper patent grants.',
                relevance: 0.93,
              },
            ],
          },
          {
            factor: 'Classical Text Codification',
            contribution: 35,
            description: 'Codified in First Schedule texts of Drugs & Cosmetics Act 1940.',
            evidence: [
              {
                sourceTitle: 'Drugs & Cosmetics Act, 1940 — First Schedule',
                sourceType: 'Regulatory Rule',
                jurisdiction: 'India (IPO/AYUSH/NBA)',
                publication: 'Ministry of Health and Family Welfare',
                reference: 'D&C Act 1940, First Schedule',
                excerpt: 'Authoritative books specified in the First Schedule constitute prior art for ASU systems.',
                relevance: 0.9,
              },
            ],
          },
        ],
        evidence: [
          {
            sourceTitle: 'Indian Patents Act, 1970 — Section 3(p)',
            sourceType: 'Patent Law / Statute',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Office of CGPDTM',
            reference: 'Patents Act 1970, Sec 3(p)',
            excerpt: 'An invention which in effect is traditional knowledge or an aggregation of known properties is not patentable.',
            relevance: 0.96,
          },
        ],
      },
      {
        id: 'patent',
        name: 'Patent Novelty & Section 3(e) Synergism Risk',
        shortLabel: 'Patent Novelty',
        score: patentNoveltyScore,
        level: patentNoveltyScore > 70 ? 'HIGH' : patentNoveltyScore > 40 ? 'MEDIUM' : 'LOW',
        weight: 25,
        whyAssigned: isProcessNovel
          ? 'Process claims demonstrate technological novelty, significantly reducing Section 3(e) admixture rejection risks.'
          : 'Composition claims will trigger Section 3(e) "mere admixture" objections unless backed by experimental synergy data.',
        relevantRule: 'Indian Patents Act 1970 Section 3(e) (Admixture / Synergism)',
        recommendedAction: isProcessNovel
          ? 'File method/process claims with detailed chromatography and extraction yield parameters.'
          : 'Generate comparative experimental data measuring combination vs individual herbs (Combination Index < 1.0).',
        factors: [
          {
            factor: 'Admixture Exclusion (Sec 3(e))',
            contribution: isNovelCombination ? 30 : 60,
            description: 'Patent examiner presumption that blending known herbs is a mere additive combination.',
            evidence: [
              {
                sourceTitle: 'IPO Manual of Patent Practice and Procedure',
                sourceType: 'Patent Law / Statute',
                jurisdiction: 'India (IPO/AYUSH/NBA)',
                publication: 'Controller General of Patents, Designs and Trademarks',
                reference: 'MPPP 2019, Chapter 3.5.8',
                excerpt: 'To overcome Section 3(e), the applicant must show synergism by producing comparative data of individual ingredients versus the combination.',
                relevance: 0.95,
              },
            ],
          },
        ],
        evidence: [
          {
            sourceTitle: 'Section 3(e) Indian Patents Act, 1970',
            sourceType: 'Patent Law / Statute',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Ministry of Commerce & Industry',
            reference: 'Patents Act 1970, Sec 3(e)',
            excerpt: 'A substance obtained by a mere admixture resulting only in the aggregation of the properties of the components is not an invention.',
            relevance: 0.97,
          },
        ],
      },
      {
        id: 'regulatory',
        name: 'Ayush / FSSAI Regulatory Approval Risk',
        shortLabel: 'Regulatory Risk',
        score: regulatoryRiskScore,
        level: regulatoryRiskScore > 70 ? 'HIGH' : regulatoryRiskScore > 40 ? 'MEDIUM' : 'LOW',
        weight: 20,
        whyAssigned:
          formData.productType === 'Phytopharmaceutical'
            ? 'Phytopharmaceutical category requires formal Phase I-III clinical trial submissions and toxicology dossier.'
            : 'Rule 158B requires textual validation or safety proof depending on formulation novelty.',
        relevantRule: 'Drugs & Cosmetics Rules 1945, Rule 158B / Phytopharmaceutical Gazette Notification 2015',
        recommendedAction: 'Compile Certificate of Analysis and pilot stability testing before submitting SLA application.',
        factors: [
          {
            factor: 'Dossier Submission Complexity',
            contribution: 40,
            description: 'Proof of safety (acute/sub-acute toxicity) and textual citations required for SLA licensing.',
            evidence: [
              {
                sourceTitle: 'Drugs & Cosmetics Rules, 1945 — Rule 158B',
                sourceType: 'Regulatory Rule',
                jurisdiction: 'India (IPO/AYUSH/NBA)',
                publication: 'Ministry of Ayush / CDSCO',
                reference: 'D&C Rules 1945, Rule 158B',
                excerpt: 'Proof of effectiveness and safety data requirements for grant of license for ASU proprietary drugs.',
                relevance: 0.92,
              },
            ],
          },
        ],
        evidence: [
          {
            sourceTitle: 'Drugs & Cosmetics Rules 1945, Rule 158B',
            sourceType: 'Regulatory Rule',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Ministry of Ayush',
            reference: 'Rule 158B Table 1',
            excerpt: 'Specifies safety study protocols, textual references, and clinical requirements for ASU proprietary medicines.',
            relevance: 0.94,
          },
        ],
      },
      {
        id: 'abs',
        name: 'Biodiversity & Access & Benefit Sharing (ABS) Risk',
        shortLabel: 'ABS Risk',
        score: absRiskScore,
        level: absRiskScore > 70 ? 'HIGH' : absRiskScore > 40 ? 'MEDIUM' : 'LOW',
        weight: 15,
        whyAssigned:
          absRiskScore > 70
            ? 'Sourcing wild botanicals or from traditional tribal communities triggers mandatory Section 3/6 NBA clearance.'
            : 'Cultivated biological resources require State Biodiversity Board (SBB) intimation under Form I.',
        relevantRule: 'Biological Diversity Act, 2002 — Section 3, 6 & 19',
        recommendedAction: 'Procure formal Certificate of Origin from suppliers and submit NBA Form III before patent grant.',
        factors: [
          {
            factor: 'Botanical Provenance Disclosure',
            contribution: absRiskScore > 70 ? 60 : 30,
            description: 'Mandatory statutory disclosure of geographic source under Patents Act Section 10(4)(d)(ii).',
            evidence: [
              {
                sourceTitle: 'Biological Diversity Act, 2002 — Section 6',
                sourceType: 'Biodiversity Law',
                jurisdiction: 'India (IPO/AYUSH/NBA)',
                publication: 'National Biodiversity Authority (NBA)',
                reference: 'BD Act 2002, Sec 6(1)',
                excerpt: 'Mandatory prior approval from NBA before applying for IPR inside or outside India based on Indian biological resources.',
                relevance: 0.96,
              },
            ],
          },
        ],
        evidence: [
          {
            sourceTitle: 'Biological Diversity Act, 2002',
            sourceType: 'Biodiversity Law',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Ministry of Environment, Forest and Climate Change',
            reference: 'BD Act 2002, Sec 6 & 7',
            excerpt: 'Regulates commercial utilization and IPR filings derived from Indian biological material.',
            relevance: 0.95,
          },
        ],
      },
      {
        id: 'international',
        name: 'International Regulatory & IP Filing Risk',
        shortLabel: 'International Risk',
        score: internationalScore,
        level: internationalScore > 70 ? 'HIGH' : internationalScore > 40 ? 'MEDIUM' : 'LOW',
        weight: 10,
        whyAssigned:
          internationalScore > 70
            ? 'Targeting US/EU markets requires strict compliance with US FDA DSHEA regulations or EU Traditional Herbal Medicinal Products Directive (THMPD 2004/24/EC).'
            : 'Domestic Indian marketing avoids cross-border herbal harmonization burdens.',
        relevantRule: 'US FDA DSHEA 1994 / EU THMPD 2004/24/EC / Nagoya Protocol Cross-Border Transfer',
        recommendedAction: 'Audit product claims to ensure structure/function compliance and eliminate prohibited disease treatment statements.',
        factors: [
          {
            factor: 'Cross-Border Herbal Classification Harmonization',
            contribution: 50,
            description: 'Herbal actives classified as ASU medicine in India may be treated as Dietary Supplements (USA) or Traditional Herbal Medicines (EU).',
            evidence: [
              {
                sourceTitle: 'US Dietary Supplement Health and Education Act (DSHEA)',
                sourceType: 'Regulatory Rule',
                jurisdiction: 'USA (USPTO/FDA)',
                publication: 'US Food and Drug Administration (FDA)',
                reference: '21 U.S.C. 321(ff)',
                excerpt: 'Dietary supplements cannot make claims to diagnose, treat, cure, or prevent any disease.',
                relevance: 0.91,
              },
            ],
          },
        ],
        evidence: [
          {
            sourceTitle: 'EU Traditional Herbal Medicinal Products Directive (THMPD)',
            sourceType: 'Regulatory Rule',
            jurisdiction: 'EU (EPO/EMA)',
            publication: 'European Medicines Agency (EMA)',
            reference: 'Directive 2004/24/EC',
            excerpt: 'Requires documentation of 30 years of traditional medicinal use, including at least 15 years within the EU, for simplified registration.',
            relevance: 0.88,
          },
        ],
      },
    ],
  }

  // Generate ABS Assessment (Feature 9)
  const isWildOrComm = formData.ingredientSource === 'Wild sourced' || formData.ingredientSource === 'Traditional community'
  const absAssessment: ABSAssessmentResult = {
    involvesBiologicalResource: true,
    resource: formData.ingredients.join(', ') || 'Botanical Herbal Matrix',
    source: formData.ingredientSource || 'Cultivated',
    communityKnowledge: formData.ingredientSource === 'Traditional community',
    purpose: formData.targetMarkets.includes('USA') || formData.targetMarkets.includes('EU') ? 'Foreign patent / export' : 'Commercial utilization',
    status: isWildOrComm ? 'Review Required' : 'Potential ABS Consideration',
    reason: isWildOrComm
      ? 'The innovation accesses biological resources from forest or tribal community domains. Under Section 3 and Section 6 of the Biological Diversity Act, 2002, prior approval from the National Biodiversity Authority (Form III) is mandatory before commercialization or patent grant.'
      : 'Cultivated botanicals sourced commercially in India by Indian entities trigger prior intimation to the concerned State Biodiversity Board (SBB) under Section 7 of the Biological Diversity Act, 2002.',
    authority: isWildOrComm ? 'National Biodiversity Authority (NBA, Chennai)' : 'State Biodiversity Board (SBB)',
    nextStep: isWildOrComm
      ? 'Submit Form III to the National Biodiversity Authority prior to patent grant and negotiate Benefit Sharing Agreement.'
      : 'File Form I intimation with the State Biodiversity Board and obtain supplier GACP Certificates of Origin.',
    exemptionNotes: 'Normally Traded Commodities (NTC) under Section 40 notification may qualify for exemption if sold strictly as raw agricultural produce.',
    evidence: [
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
    ],
  }

  // Generate Regulatory Navigator (Feature 10)
  const regulatoryNavigator: RegulatoryNavigatorResult = {
    productClassification: classificationTitle,
    jurisdiction: formData.targetMarkets.length > 0 ? formData.targetMarkets.join(', ') : 'India (Ministry of Ayush)',
    pathway:
      formData.productType === 'Classical'
        ? 'Classical ASU Drug Manufacturing License (Form 25D / Rule 153)'
        : formData.productType === 'Phytopharmaceutical'
        ? 'Phytopharmaceutical Drug Investigational New Drug (IND) Pathway (Schedule Y / CT Rules 2019)'
        : formData.productType === 'Ayurveda-Aahar'
        ? 'FSSAI Ayurveda Aahar Product Approval Pathway (Regulations 2022)'
        : 'Proprietary Ayurvedic Medicine License under Rule 158B (Drugs & Cosmetics Rules 1945)',
    pathwayReason:
      formData.productType === 'Classical'
        ? 'Classical formulations with textual citations in First Schedule compendia qualify for direct manufacturing license under Form 25D without conducting synthetic clinical trials.'
        : formData.productType === 'Phytopharmaceutical'
        ? 'Standardized botanical fractions require rigorous chemistry, manufacturing, control (CMC) characterization, safety toxicology, and Phase I/II clinical trials under CDSCO.'
        : formData.productType === 'Ayurveda-Aahar'
        ? 'Food-grade Ayurvedic recipes for health promotion follow FSSAI Ayurveda Aahar standards with distinct labelling requirements and Ahara logo display.'
        : 'Combines traditional ASU botanicals in a proprietary ratio, requiring licensing under Rule 158B Table 1 with safety and pilot proof-of-concept verification.',
    pathwayEvidence: [
      {
        sourceTitle: 'Drugs & Cosmetics Rules, 1945 — Rule 158B Guidelines',
        sourceType: 'Regulatory Rule',
        jurisdiction: 'India (IPO/AYUSH/NBA)',
        publication: 'Ministry of Ayush, Gazette Notification',
        reference: 'D&C Rules 1945, Rule 158B',
        excerpt:
          'For ASU Proprietary Medicines, the applicant shall submit proof of safety and effectiveness as specified in Table 1, including textual citations and published scientific literature.',
        relevance: 0.95,
      },
      {
        sourceTitle: 'Good Manufacturing Practices (GMP) — Schedule T',
        sourceType: 'Regulatory Rule',
        jurisdiction: 'India (IPO/AYUSH/NBA)',
        publication: 'Drugs & Cosmetics Rules, 1945',
        reference: 'Schedule T (ASU GMP)',
        excerpt:
          'Factory premises, hygienic conditions, quality control laboratory, and testing of raw materials and finished products must comply with Schedule T standards.',
        relevance: 0.93,
      },
    ],
    requirements: [
      {
        id: 'req-1',
        name: 'Classical Textual Reference / Prior Art Justification',
        category: 'Classification',
        status: 'Complete',
        explanation: 'Active botanical ingredients are referenced in classical Ayurvedic pharmacopeias (API / Samhitas).',
        evidence: [
          {
            sourceTitle: 'Ayurvedic Pharmacopoeia of India (API)',
            sourceType: 'Pharmacopoeia',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'PCIM&H, Ministry of Ayush',
            reference: 'API Part I, Vol I-IX Monographs',
            excerpt: 'Provides statutory quality standards and identity tests for single herbal drugs.',
            relevance: 0.92,
          },
        ],
      },
      {
        id: 'req-2',
        name: 'Schedule T GMP Certified Manufacturing Facility',
        category: 'Manufacturing',
        status: 'Review Required',
        explanation: 'Production must take place in an Ayush-licensed facility holding a valid Schedule T GMP Certificate.',
        evidence: [
          {
            sourceTitle: 'Schedule T — Good Manufacturing Practices for ASU Drugs',
            sourceType: 'Regulatory Rule',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Drugs & Cosmetics Rules 1945',
            reference: 'Schedule T, Part I',
            excerpt: 'Mandatory standard operating procedures for batch manufacturing, sanitation, and QC testing.',
            relevance: 0.96,
          },
        ],
      },
      {
        id: 'req-3',
        name: 'Rule 161 Mandatory Labelling & Packaging Claims',
        category: 'Labelling',
        status: 'Review Required',
        explanation: 'Labels must list all botanical ingredients with classical and botanical names, batch number, license number, and dosage warnings.',
        evidence: [
          {
            sourceTitle: 'Drugs & Cosmetics Rules, 1945 — Rule 161 (Labelling of ASU Drugs)',
            sourceType: 'Regulatory Rule',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Ministry of Ayush',
            reference: 'D&C Rules 1945, Rule 161',
            excerpt: 'The container shall be labelled with true list of ingredients, manufacturing license number, and the words "Ayurvedic Medicine".',
            relevance: 0.94,
          },
        ],
      },
      {
        id: 'req-4',
        name: 'Section 3/6 Biological Diversity Act Clearance (ABS)',
        category: 'Safety / Evidence',
        status: isWildOrComm ? 'Review Required' : 'Complete',
        explanation: isWildOrComm
          ? 'Mandatory prior clearance from National Biodiversity Authority (NBA) for wild/tribal bio-resources.'
          : 'Cultivated biological resources verified with supplier origin certificates.',
        evidence: [
          {
            sourceTitle: 'Biological Diversity Act, 2002 — Section 6',
            sourceType: 'Biodiversity Law',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'MoEFCC / NBA',
            reference: 'BD Act 2002, Sec 6',
            excerpt: 'Requires NBA approval prior to patent application or commercial utilization.',
            relevance: 0.97,
          },
        ],
      },
      {
        id: 'req-5',
        name: 'Heavy Metal, Microbial & Pesticide Residue Certificate of Analysis',
        category: 'Safety / Evidence',
        status: 'Review Required',
        explanation: 'Mandatory testing for Lead, Cadmium, Mercury, Arsenic, Aflatoxins, and microbial bio-burden as per API monographs.',
        evidence: [
          {
            sourceTitle: 'Ayush Gazette Protocol for Heavy Metal Limits',
            sourceType: 'Regulatory Rule',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Department of Ayush Notification',
            reference: 'Notification No. K.11020/2/2005-DCC',
            excerpt: 'Permissible limits: Lead 10 ppm, Cadmium 0.3 ppm, Mercury 1 ppm, Arsenic 3 ppm.',
            relevance: 0.98,
          },
        ],
      },
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'Form 24D / 25D Application for Grant of Manufacturing License',
        status: 'Ready',
        reason: 'Statutory form submitted to State Licensing Authority (SLA) for ASU manufacturing license.',
        evidence: [
          {
            sourceTitle: 'Drugs & Cosmetics Rules 1945 — Form 24D',
            sourceType: 'Regulatory Rule',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'State Licensing Authority (SLA)',
            reference: 'D&C Rules Form 24D',
            excerpt: 'Application for grant or renewal of license to manufacture ASU drugs for sale.',
            relevance: 0.95,
          },
        ],
      },
      {
        id: 'doc-2',
        name: 'Finished Product Specification Monograph & Stability Study Protocol',
        status: 'Review Required',
        reason: 'Accelerated 6-month stability testing data and real-time degradation monitoring curves.',
        evidence: [
          {
            sourceTitle: 'Ayush Stability Testing Guidelines (ICH / WHO Aligned)',
            sourceType: 'Regulatory Rule',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'PCIM&H / Ministry of Ayush',
            reference: 'Ayush Stability Protocol 2018',
            excerpt: 'Establishes shelf-life parameters under Zone IVb climatic testing conditions (30°C / 75% RH).',
            relevance: 0.91,
          },
        ],
      },
      {
        id: 'doc-3',
        name: 'Certificate of Analysis (CoA) & Sourcing Declarations',
        status: 'Mandatory Prior to Filing',
        reason: 'Full analytical test report covering botanical identification, HPTLC fingerprinting, and heavy metal testing.',
        evidence: [
          {
            sourceTitle: 'API Protocol for Herbal Drug Standardization',
            sourceType: 'Pharmacopoeia',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Pharmacopoeia Commission for Indian Medicine',
            reference: 'API Appendix 2',
            excerpt: 'Methodologies for quantitative TLC fingerprinting and marker compound assay.',
            relevance: 0.93,
          },
        ],
      },
      {
        id: 'doc-4',
        name: 'Draft Product Artwork & Label Proof as per Rule 161',
        status: 'Drafting Needed',
        reason: 'Final pack carton artwork containing all mandatory statutory warnings and composition ratios.',
        evidence: [
          {
            sourceTitle: 'Rule 161 Pack Display Guidelines',
            sourceType: 'Regulatory Rule',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Ministry of Ayush',
            reference: 'Rule 161 (1)-(4)',
            excerpt: 'Specifies font size, language requirements, and red warning box criteria for Schedule E(1) ingredients.',
            relevance: 0.9,
          },
        ],
      },
    ],
    complianceSummary: {
      completedCount: 2,
      reviewRequiredCount: 3,
      pendingCount: 2,
      warnings: [
        'Do not make disease-curing claims on consumer packaging under the Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954.',
        isWildOrComm
          ? 'National Biodiversity Authority (NBA) prior approval is legally mandatory before commercial extraction or foreign patent filing.'
          : 'Maintain supplier traceability dossiers for raw herbs to satisfy State Licensing Authority audits.',
      ],
      nextSteps: [
        'Finalize Certificate of Analysis (CoA) including HPTLC fingerprinting and heavy metal testing from a NABL/Ayush-approved lab.',
        'File Form 24D application with the concerned State Licensing Authority (SLA) along with Rule 158B safety dossier.',
        'Submit Form III to National Biodiversity Authority if filing for patents or accessing wild-sourced botanical materials.',
        'Register brand trademark under Class 5 to prevent commercial misappropriation prior to market rollout.',
      ],
    },
  }

  const recommendations = [
    formData.targetMarkets.includes('USA')
      ? 'For US Market (FDA / FTC): Structure claims as dietary supplement Structure/Function claims (DSHEA 1994) and avoid disease treatment claims.'
      : 'Verify compliance with Section 3(p) of the Indian Patents Act, 1970 (Traditional Knowledge exclusion criteria).',
    isNovelExtraction
      ? 'Your novel extraction method qualifies for a Process/Method Patent if synergistic efficacy exceeds known additive effects of the raw herbs.'
      : 'Conduct a formal TKDL prior-art clearance search before filing provisional patent specifications.',
    formData.ingredientSource === 'Traditional community' || formData.ingredientSource === 'Wild sourced'
      ? 'Ensure National Biodiversity Authority (NBA) compliance under Section 3 & 6 of the Biological Diversity Act, 2002 for Access & Benefit Sharing (ABS).'
      : 'Maintain Certificates of Analysis (CoA) for pesticide residues, heavy metals, and aflatoxins as per API / USP monographs.',
  ]

  // Feature 11: Global Market Simulator
  const globalMarkets = MarketService.evaluateMarkets(formData)

  // Feature 12: Collect Evidence Locker pool
  const evidencePool: EvidenceLockerItem[] = []
  
  // From TK Matches
  possibleMatches.forEach((m) => {
    if (m.evidence) {
      evidencePool.push({
        ...m.evidence,
        id: `ev-tk-${m.id}`,
        category: 'TK',
        taggedConclusion: `Classical reference for ${m.name} under ${m.classicalContext}`,
        documentTitle: m.evidence.sourceTitle,
      })
    }
  })

  // From IP Strategy
  ipStrategy.routes.forEach((r) => {
    r.evidence.forEach((ev, idx) => {
      evidencePool.push({
        ...ev,
        id: `ev-ip-${r.id}-${idx}`,
        category: 'IP',
        taggedConclusion: `${r.route} status: ${r.status} (${r.reason.substring(0, 80)}...)`,
        documentTitle: ev.sourceTitle,
      })
    })
  })

  // From ABS
  absAssessment.evidence.forEach((ev, idx) => {
    evidencePool.push({
      ...ev,
      id: `ev-abs-${idx}`,
      category: 'ABS',
      taggedConclusion: `ABS Status: ${absAssessment.status} under ${absAssessment.authority}`,
      documentTitle: ev.sourceTitle,
    });
  });

  // From Regulatory Navigator
  regulatoryNavigator.requirements.forEach((req) => {
    req.evidence.forEach((ev, idx) => {
      evidencePool.push({
        ...ev,
        id: `ev-reg-${req.id}-${idx}`,
        category: 'Regulatory',
        taggedConclusion: `${req.name}: ${req.status}`,
        documentTitle: ev.sourceTitle,
      });
    });
  });

  // From Global Markets
  (Object.values(globalMarkets.markets) as MarketReadinessData[]).forEach((mkt: MarketReadinessData) => {
    mkt.evidence.forEach((ev, idx: number) => {
      evidencePool.push({
        ...ev,
        id: `ev-mkt-${mkt.marketCode}-${idx}`,
        category: 'Global Market',
        taggedConclusion: `${mkt.marketName} Regulatory Framework: ${mkt.regulatoryFramework}`,
        documentTitle: ev.sourceTitle,
      });
    });
  });



  const evidenceLocker: EvidenceLockerResult = {
    totalItems: evidencePool.length,
    items: evidencePool,
  }

  // Feature 15: AYU-IP Passport
  const ipPassport = PassportService.generatePassport(
    formData,
    {
      score: tkScore,
      level: riskLevel,
      summary:
        riskLevel === 'HIGH'
          ? 'High overlap with documented Ayurvedic texts & TKDL databases.'
          : 'Moderate overlap with classical literature.',
      identifiedClassicalReferencesCount: possibleMatches.length,
    },
    absAssessment,
    regulatoryNavigator,
    globalMarkets,
    evidencePool
  )

  // Feature 16: Commercialization Roadmap
  const roadmap = RoadmapService.generateRoadmap(formData)

  // Feature 17: Action Center
  const actionCenter = ActionCenterService.generateActionCenter(formData)

  return {
    id: 'ANLZ-' + Date.now().toString(36).toUpperCase(),
    profile: {
      productType: (formData.productType || 'Proprietary') as any,
      ingredients: formData.ingredients,
      ingredientSource: (formData.ingredientSource || 'Cultivated') as any,
      noveltyElements: formData.noveltyElements,
      targetMarkets: formData.targetMarkets,
      productName: formData.productName || 'Ayurvedic Wellness Innovation',
      submittedAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    },
    aiClassification: {
      classification: classificationTitle,
      confidence,
      explanation,
      regulatoryCategory,
      riskFactors: [
        'Prior art overlap in classical Samhitas',
        formData.ingredientSource === 'Wild sourced' ? 'Biodiversity clearance (NBA)' : 'Source authenticity certification',
        isNovelCombination ? 'Synergy proof required under Section 3(e)' : 'Standard ASU dossier',
      ],
    },
    traditionalKnowledgeRisk: {
      score: tkScore,
      level: riskLevel,
      summary:
        riskLevel === 'HIGH'
          ? 'High overlap with documented Ayurvedic texts & TKDL databases. Direct composition patenting may face Section 3(p) objections unless unexpected synergistic efficacy is proven.'
          : riskLevel === 'MEDIUM'
          ? 'Moderate overlap with classical literature. Novel processing or delivery mechanism creates viable IP differentiation when properly documented.'
          : 'Low traditional knowledge risk. The formulation shows distinctive modern technological adaptation with minimal direct prior-art confrontation.',
      identifiedClassicalReferencesCount: possibleMatches.length,
    },
    possibleMatches,
    ipStrategy,
    ipRiskCenter,
    absAssessment,
    regulatoryNavigator,
    globalMarkets,
    evidenceLocker,
    ipPassport,
    roadmap,
    actionCenter,
    confidenceExplanation: calculateConfidence(
      formData,
      {
        score: tkScore,
        level: riskLevel,
        summary: '',
        identifiedClassicalReferencesCount: possibleMatches.length,
      },
      evidenceLocker?.items
    ),
    recommendations,
    isMock: true,
  }
}
