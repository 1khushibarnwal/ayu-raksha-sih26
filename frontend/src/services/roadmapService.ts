import type { CommercializationRoadmapResult, RoadmapStage, InnovationFormData } from '../types/analyzer'


export class RoadmapService {
  public static generateRoadmap(formData: InnovationFormData): CommercializationRoadmapResult {
    const isClassical = formData.productType === 'Classical'
    const isProprietary = formData.productType === 'Proprietary' || formData.productType === 'New formulation'
    const hasGlobal = formData.targetMarkets.some((m) => m !== 'India')

    const stages: RoadmapStage[] = [
      {
        id: 'innovation',
        stageNumber: 1,
        title: 'Innovation Definition',
        subtitle: 'Formulation, ingredients & botanical sourcing identification',
        icon: '💡',
        status: 'Completed',
        tasks: [
          { id: 'task-1-1', title: 'Document botanical binomial names & parts used', completed: true },
          { id: 'task-1-2', title: 'Determine sourcing mechanism (Cultivated vs Wild)', completed: true },
          { id: 'task-1-3', title: 'Define proposed finished delivery format', completed: true }
        ],
        dependencies: [],
        recommendedAction: 'Lock product specification and compile batch analytical certificate.',
        relevantDocuments: ['Product Formulation Sheet', 'Botanical Sourcing Traceability Record'],
        evidence: [
          {
            sourceTitle: 'Ayurvedic Pharmacopoeia of India (API) - Monograph Guidelines',
            sourceType: 'Pharmacopoeia',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Pharmacopoeia Commission for Indian Medicine & Homoeopathy',
            reference: 'API Part I, Vol. I-IX',
            authority: 'PCIM&H, Ministry of AYUSH',
            authorityLevel: 'Authoritative',
            excerpt: 'Standard monograph parameters for raw botanical authentication.',
            whyRelevant: 'Establishes botanical nomenclature and quality benchmark.',
            relevance: 0.96
          }
        ]
      },
      {
        id: 'classification',
        stageNumber: 2,
        title: 'Regulatory Classification',
        subtitle: 'Classify as Classical, Proprietary, Ayurveda-Aahar, or Cosmetic',
        icon: '🏷️',
        status: 'Completed',
        tasks: [
          { id: 'task-2-1', title: 'Verify if formulation is listed verbatim in Schedule I texts', completed: isClassical },
          { id: 'task-2-2', title: 'Determine applicable regulatory authority (AYUSH vs FSSAI)', completed: true }
        ],
        dependencies: ['innovation'],
        recommendedAction: isClassical
          ? 'Proceed under classical licensing route (Form 25-D).'
          : 'Prepare proprietary safety dossier under Drugs & Cosmetics Rule 158-B.',
        relevantDocuments: ['Schedule I Text Citation Proof', 'Regulatory Pathway Memo'],
        evidence: [
          {
            sourceTitle: 'Drugs and Cosmetics Act, 1940 - Section 3(a)',
            sourceType: 'Regulatory Rule',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Ministry of Law and Justice',
            reference: 'Section 3(a) & Schedule I',
            authority: 'Central Drugs Standard Control Organisation (CDSCO)',
            authorityLevel: 'Statutory',
            excerpt: 'Defines Ayurvedic, Siddha or Unani drugs manufactured exclusively in accordance with the formulae described in the authoritative books.',
            whyRelevant: 'Governs classification threshold between classical and proprietary medicines.',
            relevance: 0.98
          }
        ]
      },
      {
        id: 'tk_screening',
        stageNumber: 3,
        title: 'TK Prior Art Screening',
        subtitle: 'Screen against TKDL database and ancient Ayurvedic literature',
        icon: '📜',
        status: 'Completed',
        tasks: [
          { id: 'task-3-1', title: 'Conduct keyword scan across CSIR-TKDL repository', completed: true },
          { id: 'task-3-2', title: 'Identify classical references in Charaka & Sushruta Samhitas', completed: true }
        ],
        dependencies: ['classification'],
        recommendedAction: 'Map novel features strictly to process extraction or synergistic ratio to avoid Section 3(p) objections.',
        relevantDocuments: ['TKDL Search Report', 'Classical Prior Art Search Dossier'],
        evidence: [
          {
            sourceTitle: 'Traditional Knowledge Digital Library (TKDL) Prior Art Report',
            sourceType: 'TKDL Database',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'CSIR-TKDL',
            reference: 'TKDL-SEARCH-2026-90',
            authority: 'CSIR',
            authorityLevel: 'Defensive Prior Art',
            excerpt: 'Prior art references identified in Charaka Samhita and Bhavaprakasha.',
            whyRelevant: 'Defensive prior art check.',
            relevance: 0.94
          }
        ]
      },
      {
        id: 'ip_assessment',
        stageNumber: 4,
        title: 'IP Strategy & White Space Analysis',
        subtitle: 'Assess Patentability, Trademark, Design, and Trade Secret routes',
        icon: '🛡️',
        status: 'In Progress',
        tasks: [
          { id: 'task-4-1', title: 'Perform FTO (Freedom to Operate) and Patent Landscape Search', completed: true },
          { id: 'task-4-2', title: 'Evaluate Section 3(d) enhancement of therapeutic efficacy', completed: isProprietary },
          { id: 'task-4-3', title: 'Draft trademark clearance search report', completed: false }
        ],
        dependencies: ['tk_screening'],
        recommendedAction: 'Focus patent claims on extraction methodology and synergistic composition data; file distinctive brand trademark.',
        relevantDocuments: ['Patent Landscape Report', 'Trademark Search Analysis'],
        evidence: [
          {
            sourceTitle: 'Indian Patents Act, 1970 - Section 3(d) & 3(p)',
            sourceType: 'Patent Law / Statute',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Patent Office Journal',
            reference: 'Section 3(d), (p)',
            authority: 'CGPDTM',
            authorityLevel: 'Statutory',
            excerpt: 'Requires experimental proof of synergistic therapeutic efficacy for combination claims.',
            whyRelevant: 'Core patentability standard.',
            relevance: 0.97
          }
        ]
      },
      {
        id: 'abs_assessment',
        stageNumber: 5,
        title: 'Biodiversity & ABS Clearance',
        subtitle: 'National Biodiversity Authority (NBA) approval and SBB intimation',
        icon: '🌿',
        status: 'Review Required',
        tasks: [
          { id: 'task-5-1', title: 'Verify biological resource sourcing certificates', completed: true },
          { id: 'task-5-2', title: 'Determine NBA Form III requirement for patent filing', completed: false },
          { id: 'task-5-3', title: 'Check SBB commercial utilization intimation status', completed: false }
        ],
        dependencies: ['innovation'],
        recommendedAction: 'Submit Form III application to NBA prior to grant of patent; ensure source cultivation agreements are executed.',
        relevantDocuments: ['NBA Form III Application Draft', 'Farmer Cultivation Agreement'],
        evidence: [
          {
            sourceTitle: 'Biological Diversity Act, 2002 - Section 6',
            sourceType: 'Biodiversity Law',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'National Biodiversity Authority',
            reference: 'Section 6(1)',
            authority: 'NBA',
            authorityLevel: 'Statutory',
            excerpt: 'Prior approval of NBA mandatory before patent grant.',
            whyRelevant: 'Statutory compliance prerequisite.',
            relevance: 0.99
          }
        ]
      },
      {
        id: 'regulatory_classification',
        stageNumber: 6,
        title: 'Dossier Preparation (Safety & Quality)',
        subtitle: 'Pharmacopoeial compliance, heavy metals, stability & toxicity data',
        icon: '📋',
        status: 'In Progress',
        tasks: [
          { id: 'task-6-1', title: 'Conduct 3-batch heavy metal & microbial testing', completed: true },
          { id: 'task-6-2', title: 'Initiate 6-month accelerated stability testing (Rule 161-B)', completed: false },
          { id: 'task-6-3', title: 'Compile Master Formula Record (MFR)', completed: true }
        ],
        dependencies: ['classification'],
        recommendedAction: 'Finalize real-time and accelerated stability protocol to substantiate product shelf life on packaging.',
        relevantDocuments: ['3-Batch CoA Reports', 'Accelerated Stability Study Protocol', 'Standard Operating Procedures'],
        evidence: [
          {
            sourceTitle: 'Drugs and Cosmetics Rules, 1945 - Rule 161-B',
            sourceType: 'Regulatory Rule',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Ministry of AYUSH',
            reference: 'Rule 161-B',
            authority: 'Ministry of AYUSH',
            authorityLevel: 'Statutory',
            excerpt: 'Mandatory shelf-life and stability testing guidelines for ASU drugs.',
            whyRelevant: 'Dossier prerequisite for licensing.',
            relevance: 0.95
          }
        ]
      },
      {
        id: 'ip_protection',
        stageNumber: 7,
        title: 'IP Filings Execution',
        subtitle: 'File Provisional/Complete Patent, Trademarks, and Design Applications',
        icon: '📑',
        status: 'Not Started',
        tasks: [
          { id: 'task-7-1', title: 'File Indian Patent Application (Form 1, 2, 3, 5)', completed: false },
          { id: 'task-7-2', title: 'File Trademark Application in Class 5 (Medicinal) & Class 30', completed: false },
          { id: 'task-7-3', title: 'File PCT International Application (within 12-month priority)', completed: false }
        ],
        dependencies: ['ip_assessment', 'abs_assessment'],
        recommendedAction: 'File provisional specification immediately to secure priority date prior to any public disclosure.',
        relevantDocuments: ['Form 1 & 2 Patent Draft', 'TM-A Trademark Application'],
        evidence: [
          {
            sourceTitle: 'Patents Rules, 2003 (as amended 2024)',
            sourceType: 'Patent Law / Statute',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'CGPDTM',
            reference: 'Rules 12 - 24',
            authority: 'Indian Patent Office',
            authorityLevel: 'Statutory',
            excerpt: 'Procedural filing framework.',
            whyRelevant: 'Execution guidelines.',
            relevance: 0.91
          }
        ]
      },
      {
        id: 'compliance',
        stageNumber: 8,
        title: 'Licensing & Good Manufacturing Practice',
        subtitle: 'AYUSH State Licensing Authority application & GMP inspection',
        icon: '🏭',
        status: 'Not Started',
        tasks: [
          { id: 'task-8-1', title: 'Submit Form 24-D application on e-Aushadhi portal', completed: false },
          { id: 'task-8-2', title: 'Obtain Schedule T GMP certification for facility', completed: false },
          { id: 'task-8-3', title: 'Review label artwork against Rule 161 compliance', completed: false }
        ],
        dependencies: ['regulatory_classification'],
        recommendedAction: 'Complete Schedule T pre-audit and verify label claims match approved indications.',
        relevantDocuments: ['Form 24-D Application', 'Schedule T Compliance Certificate', 'Label Packaging Artwork'],
        evidence: [
          {
            sourceTitle: 'Drugs and Cosmetics Rules, 1945 - Schedule T (Good Manufacturing Practices)',
            sourceType: 'Regulatory Rule',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Ministry of AYUSH',
            reference: 'Schedule T',
            authority: 'CDSCO / AYUSH',
            authorityLevel: 'Authoritative',
            excerpt: 'GMP standards for manufacture of Ayurveda, Siddha and Unani drugs.',
            whyRelevant: 'Mandatory for factory operation.',
            relevance: 0.98
          }
        ]
      },
      {
        id: 'market_authorization',
        stageNumber: 9,
        title: 'Domestic Commercial Launch',
        subtitle: 'Product release, batch release testing, and post-market pharmacovigilance',
        icon: '🚀',
        status: 'Not Started',
        tasks: [
          { id: 'task-9-1', title: 'Commercial batch manufacturing & QA release', completed: false },
          { id: 'task-9-2', title: 'Setup Pharmacovigilance reporting system with National AYUSH PvPI center', completed: false }
        ],
        dependencies: ['compliance', 'ip_protection'],
        recommendedAction: 'Implement batch testing protocol and establish consumer adverse event tracking mechanism.',
        relevantDocuments: ['Commercial Batch Release Dossier', 'Pharmacovigilance SOP'],
        evidence: [
          {
            sourceTitle: 'National Pharmacovigilance Programme for ASU Drugs',
            sourceType: 'Government Document',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'All India Institute of Ayurveda (AIIA) / Ministry of AYUSH',
            reference: 'NPvP-ASU Guidelines',
            authority: 'National Coordination Centre (AIIA)',
            authorityLevel: 'Regulatory',
            excerpt: 'Adverse drug reaction monitoring for Ayurvedic medicines.',
            whyRelevant: 'Post-market safety compliance.',
            relevance: 0.89
          }
        ]
      },
      {
        id: 'global_expansion',
        stageNumber: 10,
        title: 'International Market Entry (US/EU/JP/AU)',
        subtitle: 'Target jurisdiction compliance (FDA DSHEA, EU THMPD, TGA AUST L)',
        icon: '🌐',
        status: hasGlobal ? 'In Progress' : 'Not Started',
        tasks: [
          { id: 'task-10-1', title: 'US FDA 21 CFR 111 cGMP audit & NDI evaluation', completed: false },
          { id: 'task-10-2', title: 'California Prop 65 heavy metal compliance testing', completed: false },
          { id: 'task-10-3', title: 'EU Food Supplement / THMPD dossier submission', completed: false }
        ],
        dependencies: ['market_authorization'],
        recommendedAction: 'Engage US FDA regulatory agent and execute Prop 65 third-party lab testing before overseas shipment.',
        relevantDocuments: ['US FDA DSHEA Dossier', 'Prop 65 Compliance Report', 'EU THMPD Bibliographic Dossier'],
        evidence: [
          {
            sourceTitle: 'US FDA 21 CFR Part 111 - Current Good Manufacturing Practice for Dietary Supplements',
            sourceType: 'Regulatory Rule',
            jurisdiction: 'USA (USPTO/FDA)',
            publication: 'US FDA CFSAN',
            reference: '21 CFR Part 111',
            authority: 'US FDA',
            authorityLevel: 'Statutory',
            excerpt: 'Regulations for manufacturing, packaging, labeling, or holding dietary supplements.',
            whyRelevant: 'Mandatory standard for entering the US dietary supplement market.',
            relevance: 0.96
          }
        ]
      }
    ]

    const completedCount = stages.filter((s) => s.status === 'Completed').length
    const completionPercentage = Math.round((completedCount / stages.length) * 100)

    return {
      stages,
      currentStageId: 'ip_assessment',
      completionPercentage
    }
  }
}
