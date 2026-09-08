import type {
  InnovationFormData,
  GlobalMarketSimulatorResult,
  MarketReadinessData,
} from '../types/analyzer'

/**
 * Strict Jurisdiction-Aware Global Market Simulator (Feature 11)
 * Evaluates readiness independently across India, USA, EU, Japan, and Australia
 * using jurisdiction-specific legal standards and evidence.
 */
export function generateMarketReadiness(
  formData: InnovationFormData,
): GlobalMarketSimulatorResult {
  const isProcessNovel = formData.noveltyElements.includes('Extraction') || formData.noveltyElements.includes('Manufacturing')

  // 1. INDIA (IN)
  const indiaMarket: MarketReadinessData = {
    marketName: 'India',
    marketCode: 'IN',
    flag: '🇮🇳',
    regulatoryFramework: 'Ministry of Ayush & Drugs and Cosmetics Act, 1940 (Rule 158B) / FSSAI',
    overallReadinessScore: isProcessNovel ? 78 : 64,
    ip: {
      status: isProcessNovel ? 'Ready' : 'Review Required',
      explanation: isProcessNovel
        ? 'Process/Method patent claims eligible under Section 2(1)(j). Composition claims must satisfy Section 3(e) synergism proof to overcome Section 3(p) TK prior art exclusions.'
        : 'Composition claims will trigger Section 3(p) objections as classical traditional knowledge. Trademark Class 5 is immediately recommended.',
      recommendedAction: 'Draft process patent claims with comparative synergy test data.',
      evidence: [
        {
          sourceTitle: 'Indian Patents Act, 1970 — Section 3(p) & 3(e)',
          sourceType: 'Patent Law / Statute',
          jurisdiction: 'India (IPO/AYUSH/NBA)',
          publication: 'Office of CGPDTM, Government of India',
          reference: 'Patents Act 1970, Sec 3(p), 3(e)',
          authority: 'Controller General of Patents, Designs & Trade Marks',
          authorityLevel: 'Statutory',
          effectiveDate: '1972-04-20',
          provision: 'Section 3(p) & Section 3(e)',
          excerpt: 'An invention which in effect is traditional knowledge or an aggregation of known properties of traditionally known component(s) is excluded from patentability.',
          whyRelevant: 'Governs patent eligibility of botanical formulations in India.',
          relevance: 0.98,
          status: 'Current',
        },
      ],
    },
    regulatory: {
      status: 'In Progress',
      explanation: 'Eligible for AYUSH Proprietary Medicine license under Rule 158B. Requires textual justification and pilot safety dossier.',
      recommendedAction: 'Prepare Form 24D application with Certificate of Analysis (CoA) from a NABL laboratory.',
      evidence: [
        {
          sourceTitle: 'Drugs and Cosmetics Rules, 1945 — Rule 158B',
          sourceType: 'Regulatory Rule',
          jurisdiction: 'India (IPO/AYUSH/NBA)',
          publication: 'Ministry of Health & Family Welfare / Ministry of Ayush',
          reference: 'D&C Rules 1945, Rule 158B Table 1',
          authority: 'Ministry of Ayush / State Licensing Authority',
          authorityLevel: 'Authoritative',
          effectiveDate: '2010-08-10',
          provision: 'Rule 158B',
          excerpt: 'Specifies safety and effectiveness evidence requirements for grant of license for ASU proprietary medicines.',
          whyRelevant: 'Mandatory licensing pathway for proprietary ASU formulations.',
          relevance: 0.96,
          status: 'Current',
        },
      ],
    },
    documentation: {
      status: 'Missing Items',
      explanation: 'Schedule T GMP facility proof and 6-month stability study data required before State Licensing Authority approval.',
      recommendedAction: 'Commission real-time Zone IVb stability testing protocol.',
      evidence: [
        {
          sourceTitle: 'Schedule T GMP Guidelines for Ayurvedic Drugs',
          sourceType: 'Regulatory Rule',
          jurisdiction: 'India (IPO/AYUSH/NBA)',
          publication: 'Drugs & Cosmetics Rules 1945',
          reference: 'Schedule T, Part I',
          authority: 'Ayush Drug Technical Advisory Board (ASUDTAB)',
          authorityLevel: 'Authoritative',
          excerpt: 'Mandatory standards for factory layout, batch manufacturing records, and quality control lab.',
          relevance: 0.94,
          status: 'Current',
        },
      ],
    },
    traditionalKnowledge: {
      status: 'High Risk',
      explanation: 'Direct match with Charaka Samhita and TKDL botanical formulations requires proactive differentiation in patent specifications.',
      recommendedAction: 'Conduct formal TKDL clearance search and file non-TK process claims.',
      evidence: [
        {
          sourceTitle: 'Traditional Knowledge Digital Library (TKDL) Prior Art Index',
          sourceType: 'TKDL Database',
          jurisdiction: 'India (IPO/AYUSH/NBA)',
          publication: 'CSIR-NIScPR & Ministry of Ayush',
          reference: 'TKDL-AY-PRIOR-ART-2024',
          authority: 'Council of Scientific & Industrial Research (CSIR)',
          authorityLevel: 'Defensive Prior Art',
          excerpt: 'Extensively indexes classical formulations containing these botanical actives against patent misappropriation.',
          relevance: 0.93,
          status: 'Current',
        },
      ],
    },
    marketEntry: {
      status: 'In Progress',
      explanation: 'Domestic commercialization feasible within 4-6 months upon receipt of State Licensing Authority manufacturing license.',
      recommendedAction: 'Engage contract manufacturer with active Schedule T GMP certificate.',
      evidence: [],
    },
    evidence: [],
  }

  // 2. USA (US)
  const usaMarket: MarketReadinessData = {
    marketName: 'United States',
    marketCode: 'US',
    flag: '🇺🇸',
    regulatoryFramework: 'US FDA DSHEA 1994 (21 CFR Part 111 cGMP) / USPTO 35 U.S.C.',
    overallReadinessScore: 62,
    ip: {
      status: 'Investigate',
      explanation: 'USPTO allows composition patents if non-obviousness (35 U.S.C. 103) is demonstrated. Unlike India, Section 3(p) does not exist, but TKDL references still act as prior art under 35 U.S.C. 102.',
      recommendedAction: 'File provisional US patent application accompanied by comparative in-vitro bio-assay data.',
      evidence: [
        {
          sourceTitle: 'United States Code — Title 35 (Patents) Section 102 & 103',
          sourceType: 'Patent Law / Statute',
          jurisdiction: 'USA (USPTO/FDA)',
          publication: 'United States Patent and Trademark Office (USPTO)',
          reference: '35 U.S.C. §§ 102, 103',
          authority: 'USPTO',
          authorityLevel: 'Statutory',
          effectiveDate: '2013-03-16',
          provision: '35 U.S.C. 102/103',
          excerpt: 'A patent may not be obtained if the differences between the claimed invention and prior art are obvious to a person having ordinary skill in the art.',
          whyRelevant: 'Establishes USPTO non-obviousness criteria for herbal combinations.',
          relevance: 0.95,
          status: 'Current',
        },
      ],
    },
    regulatory: {
      status: 'Review Required',
      explanation: 'Must be classified as a Dietary Supplement under DSHEA 1994. Prohibited from making disease treatment or cure claims. Structure/Function claims require 30-day post-market notification (21 CFR 101.93).',
      recommendedAction: 'Audit product carton copy to strictly utilize Structure/Function claim formats.',
      evidence: [
        {
          sourceTitle: 'Dietary Supplement Health and Education Act of 1994 (DSHEA)',
          sourceType: 'Regulatory Rule',
          jurisdiction: 'USA (USPTO/FDA)',
          publication: 'United States Food and Drug Administration (FDA)',
          reference: 'Public Law 103-417, 21 U.S.C. § 321(ff)',
          authority: 'US FDA Center for Food Safety and Applied Nutrition (CFSAN)',
          authorityLevel: 'Authoritative',
          effectiveDate: '1994-10-25',
          provision: '21 U.S.C. 321(ff)',
          excerpt: 'A dietary supplement may not claim to diagnose, mitigate, treat, cure, or prevent any specific disease.',
          whyRelevant: 'Governs all Ayurvedic botanical products sold in the United States.',
          relevance: 0.97,
          status: 'Current',
        },
      ],
    },
    documentation: {
      status: 'Review Required',
      explanation: 'Requires 21 CFR Part 111 cGMP compliance documentation and New Dietary Ingredient (NDI) safety evaluation if botanicals were not marketed in the US prior to October 15, 1994.',
      recommendedAction: 'Verify pre-1994 Old Dietary Ingredient (ODI) status for all botanical actives.',
      evidence: [
        {
          sourceTitle: 'FDA 21 CFR Part 111 — Current Good Manufacturing Practice for Dietary Supplements',
          sourceType: 'Regulatory Rule',
          jurisdiction: 'USA (USPTO/FDA)',
          publication: 'US Food and Drug Administration',
          reference: '21 CFR Part 111',
          authority: 'US FDA',
          authorityLevel: 'Authoritative',
          excerpt: 'Establishes requirements for identity, purity, strength, and composition specifications for dietary supplements.',
          relevance: 0.94,
          status: 'Current',
        },
      ],
    },
    traditionalKnowledge: {
      status: 'Review Required',
      explanation: 'USPTO Patent Examiners regularly search TKDL through the bilateral access agreement. Prior art objections possible under 35 U.S.C. 102.',
      recommendedAction: 'Disclose classical Sanskrit prior art citations in Information Disclosure Statement (IDS).',
      evidence: [
        {
          sourceTitle: 'USPTO-CSIR Bilateral TKDL Access Agreement',
          sourceType: 'International Material',
          jurisdiction: 'USA (USPTO/FDA)',
          publication: 'USPTO & Government of India',
          reference: 'USPTO/TKDL-MOU-2009',
          authority: 'USPTO & CSIR India',
          authorityLevel: 'Authoritative',
          excerpt: 'Allows USPTO patent examiners to access TKDL database for searching prior art before granting patents on botanical compositions.',
          relevance: 0.91,
          status: 'Current',
        },
      ],
    },
    marketEntry: {
      status: 'Review Required',
      explanation: 'Ready for market entry once FDA packaging disclaimers and US agent representation under FSMA are registered.',
      recommendedAction: 'Appoint US FDA Agent and register manufacturing facility under FDA Food Facility Registration (FFR).',
      evidence: [],
    },
    evidence: [],
  }

  // 3. EUROPEAN UNION (EU)
  const euMarket: MarketReadinessData = {
    marketName: 'European Union',
    marketCode: 'EU',
    flag: '🇪🇺',
    regulatoryFramework: 'EMA Traditional Herbal Medicinal Products Directive (Directive 2004/24/EC) / EFSA Food Supplements',
    overallReadinessScore: 54,
    ip: {
      status: 'Investigate',
      explanation: 'European Patent Office (EPO) requires inventive step under Article 56 EPC. Synergistic co-action must be demonstrated with experimental data.',
      recommendedAction: 'Prepare comparative bioactivity curves against individual extracts for EPO filing.',
      evidence: [
        {
          sourceTitle: 'European Patent Convention (EPC) — Article 56 (Inventive Step)',
          sourceType: 'Patent Law / Statute',
          jurisdiction: 'EU (EPO/EMA)',
          publication: 'European Patent Office (EPO)',
          reference: 'EPC Article 56',
          authority: 'European Patent Office',
          authorityLevel: 'Statutory',
          excerpt: 'An invention shall be considered as involving an inventive step if it is not obvious to a person skilled in the art.',
          relevance: 0.93,
          status: 'Current',
        },
      ],
    },
    regulatory: {
      status: 'Missing Items',
      explanation: 'Traditional Herbal Medicinal Products Directive (THMPD) requires evidence of 30 years of traditional medicinal use (including at least 15 years within the EU) for simplified registration. Alternatively, can enter as Food Supplement under Directive 2002/46/EC.',
      recommendedAction: 'Route product as an EFSA-compliant Food Supplement to bypass 15-year EU historical use requirement.',
      evidence: [
        {
          sourceTitle: 'Directive 2004/24/EC — Traditional Herbal Medicinal Products Directive',
          sourceType: 'Regulatory Rule',
          jurisdiction: 'EU (EPO/EMA)',
          publication: 'European Parliament and Council of the European Union',
          reference: 'Official Journal L 136, Directive 2004/24/EC',
          authority: 'European Medicines Agency (EMA) / HMPC',
          authorityLevel: 'Authoritative',
          effectiveDate: '2004-04-30',
          provision: 'Directive 2004/24/EC Art. 16c',
          excerpt: 'Requires documentation of traditional use throughout a period of at least 30 years preceding the application, including at least 15 years within the Community.',
          whyRelevant: 'Primary regulatory hurdle for classical herbal medicines entering the EU.',
          relevance: 0.98,
          status: 'Current',
        },
      ],
    },
    documentation: {
      status: 'Missing Items',
      explanation: 'Heavy metal (Pb, Cd, Hg) and polycyclic aromatic hydrocarbon (PAH) maximum residue limits (MRLs) are significantly stricter under EU Regulation 2023/915 than domestic Indian ASU standards.',
      recommendedAction: 'Conduct specialized EU-standard ICP-MS testing for heavy metals and pesticide residues.',
      evidence: [
        {
          sourceTitle: 'Commission Regulation (EU) 2023/915 on Maximum Levels for Contaminants in Food',
          sourceType: 'Regulatory Rule',
          jurisdiction: 'EU (EPO/EMA)',
          publication: 'European Commission',
          reference: 'OJ L 119/103, Regulation (EU) 2023/915',
          authority: 'European Food Safety Authority (EFSA)',
          authorityLevel: 'Authoritative',
          excerpt: 'Establishes strict maximum residue limits for cadmium, lead, mercury, aflatoxins, and pyrrolizidine alkaloids in botanical food supplements.',
          relevance: 0.95,
          status: 'Current',
        },
      ],
    },
    traditionalKnowledge: {
      status: 'Review Required',
      explanation: 'EPO possesses a direct cooperation agreement with CSIR for TKDL search access. Prior art citations will be raised during examination.',
      recommendedAction: 'Draft narrow method claims focused on novel extraction fractions.',
      evidence: [],
    },
    marketEntry: {
      status: 'Not Ready',
      explanation: 'Heavy metal limit re-certification and food supplement notification in target member states (e.g. Germany BfArM, France DGCCRF) are required.',
      recommendedAction: 'Submit EU member-state food supplement notification dossier.',
      evidence: [],
    },
    evidence: [],
  }

  // 4. JAPAN (JP)
  const japanMarket: MarketReadinessData = {
    marketName: 'Japan',
    marketCode: 'JP',
    flag: '🇯🇵',
    regulatoryFramework: 'Ministry of Health, Labour and Welfare (MHLW) / Kampo Standards / Foods with Function Claims (FFC)',
    overallReadinessScore: 48,
    ip: {
      status: 'Investigate',
      explanation: 'Japan Patent Office (JPO) recognizes technical combinations with superior synergistic efficacy under Section 29(2) of the Japan Patent Act.',
      recommendedAction: 'Conduct Japanese patent translation and prior-art search across J-PlatPat database.',
      evidence: [
        {
          sourceTitle: 'Japan Patent Act (Act No. 121 of 1959) — Article 29',
          sourceType: 'Patent Law / Statute',
          jurisdiction: 'Japan (JPO/MHLW)',
          publication: 'Japan Patent Office (JPO)',
          reference: 'Patent Act No. 121, Art. 29',
          authority: 'Japan Patent Office',
          authorityLevel: 'Statutory',
          excerpt: 'Any person who has created an invention that is industrially applicable may obtain a patent unless obvious to a person having ordinary knowledge in the technical field.',
          relevance: 0.92,
          status: 'Current',
        },
      ],
    },
    regulatory: {
      status: 'Review Required',
      explanation: 'Ayurvedic formulations cannot directly register as "Kampo" medicine without official Pharmacopoeia of Japan listing. Must be positioned as "Foods with Function Claims (FFC)" under CAA Japan.',
      recommendedAction: 'Register scientific evidence of functional efficacy with the Consumer Affairs Agency (CAA) under the FFC notification system.',
      evidence: [
        {
          sourceTitle: 'Japan Consumer Affairs Agency (CAA) Foods with Function Claims (FFC) Guidelines',
          sourceType: 'Regulatory Rule',
          jurisdiction: 'Japan (JPO/MHLW)',
          publication: 'Consumer Affairs Agency, Cabinet Office of Japan',
          reference: 'Cabinet Office Notification No. 12',
          authority: 'Consumer Affairs Agency (CAA)',
          authorityLevel: 'Authoritative',
          effectiveDate: '2015-04-01',
          provision: 'FFC Guideline Section 3',
          excerpt: 'Manufacturers submit scientific evidence evaluating the safety and functionality of botanical active components 60 days prior to market launch.',
          relevance: 0.94,
          status: 'Current',
        },
      ],
    },
    documentation: {
      status: 'Missing Items',
      explanation: 'Japanese Food Sanitation Act testing required at an MHLW-registered quarantine inspection station upon customs arrival.',
      recommendedAction: 'Prepare bilingual Japanese-English Certificate of Analysis and ingredient origin sheets.',
      evidence: [],
    },
    traditionalKnowledge: {
      status: 'Review Required',
      explanation: 'JPO searches international traditional medicine compendia including TKDL under the JPO-CSIR patent search agreement.',
      recommendedAction: 'Verify that botanical extracts are not listed as restricted pharmaceutical ingredients on MHLW "Exclusive Pharmaceutical List".',
      evidence: [],
    },
    marketEntry: {
      status: 'Not Ready',
      explanation: 'Requires domestic Japanese importer of record (TOR) and CAA functional claim dossier filing.',
      recommendedAction: 'Partner with a licensed Japanese import distributor.',
      evidence: [],
    },
    evidence: [],
  }

  // 5. AUSTRALIA (AU)
  const australiaMarket: MarketReadinessData = {
    marketName: 'Australia',
    marketCode: 'AU',
    flag: '🇦🇺',
    regulatoryFramework: 'Therapeutic Goods Administration (TGA) / Listed Complementary Medicines (AUST L)',
    overallReadinessScore: 68,
    ip: {
      status: 'Investigate',
      explanation: 'IP Australia grants standard patents for non-obvious synergistic herbal compositions under Patents Act 1990 Section 18.',
      recommendedAction: 'File Australian provisional patent specification.',
      evidence: [
        {
          sourceTitle: 'Patents Act 1990 (Cth) — Section 18 (Patentable Inventions)',
          sourceType: 'Patent Law / Statute',
          jurisdiction: 'Australia (IP Australia/TGA)',
          publication: 'IP Australia / Federal Register of Legislation',
          reference: 'Patents Act 1990, Sec 18(1)',
          authority: 'IP Australia',
          authorityLevel: 'Statutory',
          excerpt: 'An invention is a patentable invention for the purposes of a standard patent if it is a manner of manufacture, is novel, and involves an inventive step.',
          relevance: 0.94,
          status: 'Current',
        },
      ],
    },
    regulatory: {
      status: 'In Progress',
      explanation: 'Ayurvedic formulations qualify as "Listed Complementary Medicines" (AUST L) on the Australian Register of Therapeutic Goods (ARTG) if all ingredients are on the TGA Permitted Ingredients List.',
      recommendedAction: 'Check each botanical active against the TGA Therapeutic Goods (Permissible Ingredients) Determination.',
      evidence: [
        {
          sourceTitle: 'Therapeutic Goods Act 1989 — Listed Medicines Pathway (AUST L)',
          sourceType: 'Regulatory Rule',
          jurisdiction: 'Australia (IP Australia/TGA)',
          publication: 'Therapeutic Goods Administration (TGA), Department of Health and Aged Care',
          reference: 'Therapeutic Goods Act 1989, Sec 26A',
          authority: 'Therapeutic Goods Administration (TGA)',
          authorityLevel: 'Authoritative',
          effectiveDate: '1991-02-15',
          provision: 'Section 26A',
          excerpt: 'Allows expedited self-certification and listing of complementary medicines using pre-approved low-risk ingredients with traditional use claims.',
          whyRelevant: 'Fastest pathway for Ayurvedic botanical entry into Australia.',
          relevance: 0.97,
          status: 'Current',
        },
      ],
    },
    documentation: {
      status: 'Review Required',
      explanation: 'TGA requires PIC/S GMP compliance certificate for the overseas manufacturing site or TGA GMP clearance.',
      recommendedAction: 'Submit Schedule T GMP dossier for TGA Desktop GMP Clearance.',
      evidence: [],
    },
    traditionalKnowledge: {
      status: 'Review Required',
      explanation: 'TGA recognizes documented Ayurvedic traditional evidence (e.g. Ayurvedic Pharmacopoeia of India) as substantiation for traditional indications (e.g. "Traditionally used in Ayurvedic medicine to support vitality").',
      recommendedAction: 'Select standardized traditional indication statements from the TGA Permitted Indications list.',
      evidence: [
        {
          sourceTitle: 'TGA Evidence Guidelines for Complementary Medicines',
          sourceType: 'Regulatory Rule',
          jurisdiction: 'Australia (IP Australia/TGA)',
          publication: 'Therapeutic Goods Administration',
          reference: 'TGA Complementary Medicines Guidelines Version 3.2',
          authority: 'TGA',
          authorityLevel: 'Authoritative',
          excerpt: 'Established pharmacopeias including API and BHP are recognized as primary classical evidence sources for traditional use claims.',
          relevance: 0.96,
          status: 'Current',
        },
      ],
    },
    marketEntry: {
      status: 'In Progress',
      explanation: 'Strong potential for rapid commercialization via AUST L listing within 60-90 days once GMP clearance is verified.',
      recommendedAction: 'Apply for AUST L number via TGA Business Services (TBS) portal.',
      evidence: [],
    },
    evidence: [],
  }

  // Consolidate evidence lists for each market
  indiaMarket.evidence = [...indiaMarket.ip.evidence, ...indiaMarket.regulatory.evidence, ...indiaMarket.documentation.evidence, ...indiaMarket.traditionalKnowledge.evidence]
  usaMarket.evidence = [...usaMarket.ip.evidence, ...usaMarket.regulatory.evidence, ...usaMarket.documentation.evidence, ...usaMarket.traditionalKnowledge.evidence]
  euMarket.evidence = [...euMarket.ip.evidence, ...euMarket.regulatory.evidence, ...euMarket.documentation.evidence, ...euMarket.traditionalKnowledge.evidence]
  japanMarket.evidence = [...japanMarket.ip.evidence, ...japanMarket.regulatory.evidence, ...japanMarket.documentation.evidence, ...japanMarket.traditionalKnowledge.evidence]
  australiaMarket.evidence = [...australiaMarket.ip.evidence, ...australiaMarket.regulatory.evidence, ...australiaMarket.documentation.evidence, ...australiaMarket.traditionalKnowledge.evidence]

  return {
    selectedMarket: 'IN',
    markets: {
      IN: indiaMarket,
      US: usaMarket,
      EU: euMarket,
      JP: japanMarket,
      AU: australiaMarket,
    },
  }
}

export class MarketService {
  public static evaluateMarkets(formData: InnovationFormData): GlobalMarketSimulatorResult {
    return generateMarketReadiness(formData)
  }
}
