import type { ChatMessage, EvidenceItem, InnovationFormData } from '../types/analyzer'


export interface ChatServiceOptions {
  language?: string
  uploadedDocName?: string
  currentFormData?: InnovationFormData
}

export const PRESET_SUGGESTED_PROMPTS = [
  'Can I patent my Ashwagandha + Brahmi formulation in India under Section 3(p)?',
  'What FDA regulatory pathway should I choose for an Ayurvedic dietary supplement in the US?',
  'Do I need National Biodiversity Authority (NBA) approval before filing a foreign patent?',
  'What are the mandatory stability testing requirements under Drugs & Cosmetics Rules, Rule 158-B?',
  'How does the EU Traditional Herbal Medicinal Products Directive (THMPD 2004/24/EC) apply to classical herbs?'
]

const MOCK_KNOWLEDGE_BASE: Array<{
  keywords: string[]
  response: string
  reasoning: string
  confidence: number
  sources: EvidenceItem[]
  nextStep: string
}> = [
  {
    keywords: ['section 3(p)', 'patent', 'classical', 'ashwagandha', 'brahmi', 'traditional knowledge'],
    response:
      'Under the Indian Patents Act, 1970, Section 3(p) explicitly bars the patenting of an invention which in effect is traditional knowledge or an aggregation/duplication of known properties of traditionally known components. \n\nHowever, if your formulation demonstrates a synergistic effect beyond additive results (supported by comparative clinical or pharmacological data) or involves a novel delivery mechanism (e.g., nano-carrier / liposomal extraction), the specific composition or extraction process may be patentable.',
    reasoning:
      'Checked Indian Patents Act, 1970 (Section 3(p) & Section 3(d)) against classical citations in Charaka Samhita & Bhavaprakasha Nighantu. TKDL defensive prior art poses a direct barrier to simple admixture claims.',
    confidence: 94,
    sources: [
      {
        sourceTitle: 'Indian Patents Act, 1970 - Section 3(p)',
        sourceType: 'Patent Law / Statute',
        jurisdiction: 'India (IPO/AYUSH/NBA)',
        publication: 'Ministry of Law and Justice, Govt. of India',
        reference: 'Act No. 39 of 1970, Sec 3(p)',
        authority: 'Indian Patent Office (CGPDTM)',
        authorityLevel: 'Statutory',
        effectiveDate: '1972-04-20',
        version: 'As amended by Patents (Amendment) Act, 2005',
        provision: 'Section 3(p)',
        url: 'https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_31_1_patent-act-1970-11march2015.pdf',
        excerpt: 'The following are not inventions within the meaning of this Act: an invention which in effect is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components.',
        whyRelevant: 'Direct statutory ground for rejection of simple botanical combinations.',
        status: 'Current',
        relevance: 0.98
      },
      {
        sourceTitle: 'Traditional Knowledge Digital Library (TKDL)',
        sourceType: 'TKDL Database',
        jurisdiction: 'India (IPO/AYUSH/NBA)',
        publication: 'CSIR & Ministry of AYUSH',
        reference: 'TKDL Accession ID: RS/1402 & AK/489',
        authority: 'CSIR-AYUSH',
        authorityLevel: 'Defensive Prior Art',
        effectiveDate: '2001-01-01',
        excerpt: 'Standard medhya rasayana formulations combining Withania somnifera (Ashwagandha) and Bacopa monnieri (Brahmi) for mental cognition and fatigue alleviation.',
        whyRelevant: 'Acts as documented prior art across global patent offices.',
        status: 'Current',
        relevance: 0.92
      }
    ],
    nextStep: 'Draft comparative synergy data tables and consider filing for the novel extraction method rather than the broad composition of matter.'
  },
  {
    keywords: ['fda', 'dietary supplement', 'usa', 'united states', 'us market', 'dshea'],
    response:
      'In the United States, Ayurvedic formulations are generally marketed under the Dietary Supplement Health and Education Act of 1994 (DSHEA) / 21 U.S.C. § 321(ff). \n\nKey requirements include:\n1. If ingredients were not marketed in the US prior to October 15, 1994, an NDI (New Dietary Ingredient) 75-day notification under 21 CFR § 190.6 is mandatory.\n2. Strict adherence to 21 CFR Part 111 (c-GMP for Dietary Supplements).\n3. Structure/Function claims require standard FDA disclaimer ("These statements have not been evaluated by the FDA..."). No disease prevention/treatment claims are allowed without full IND/NDA drug approval.',
    reasoning:
      'Cross-referenced FDA 21 CFR 111, 21 CFR 190.6, and DSHEA statutory boundaries. High risk of FDA Warning Letters if disease claims (anti-diabetic, anti-cancer) are made.',
    confidence: 91,
    sources: [
      {
        sourceTitle: 'Dietary Supplement Health and Education Act of 1994 (DSHEA)',
        sourceType: 'Regulatory Rule',
        jurisdiction: 'USA (USPTO/FDA)',
        publication: 'US Food and Drug Administration (FDA)',
        reference: 'Public Law 103-417; 21 U.S.C. § 321(ff)',
        authority: 'US FDA CFSAN',
        authorityLevel: 'Statutory',
        effectiveDate: '1994-10-25',
        provision: '21 U.S.C. 350b / 21 CFR 190.6',
        url: 'https://www.fda.gov/food/dietary-supplements',
        excerpt: 'Requires 75-day premarket safety notification for New Dietary Ingredients (NDIs) not marketed in the US prior to October 15, 1994.',
        whyRelevant: 'Determines whether premarket safety filings are required for rare Ayurvedic botanicals in the US.',
        status: 'Current',
        relevance: 0.95
      }
    ],
    nextStep: 'Conduct an NDI determination audit and prepare heavy metal testing protocols compliant with USP <2232> / California Prop 65.'
  },
  {
    keywords: ['nba', 'biodiversity', 'abs', 'approval', 'foreign patent', 'section 6', 'section 3'],
    response:
      'Under Section 6 of the Biological Diversity Act, 2002 (as amended in 2023), no person or entity shall apply for any Intellectual Property right (patent or other protection) in or outside India for any invention based on any research or information on a biological resource obtained from India without obtaining the prior approval of the National Biodiversity Authority (NBA).\n\nUnder Section 6(1A), for patents filed in India, permission must be obtained before the grant of the patent (via Form III). For foreign patent filings, prior permission is required before filing.',
    reasoning:
      'Statutory compliance check under Biological Diversity Act 2002 and Biological Diversity (Amendment) Act 2023. Non-compliance can lead to patent revocation under Indian Patents Act Section 64(1)(p).',
    confidence: 96,
    sources: [
      {
        sourceTitle: 'Biological Diversity Act, 2002 - Section 6',
        sourceType: 'Biodiversity Law',
        jurisdiction: 'India (IPO/AYUSH/NBA)',
        publication: 'National Biodiversity Authority (NBA)',
        reference: 'Act No. 18 of 2003, Section 6',
        authority: 'National Biodiversity Authority, Chennai',
        authorityLevel: 'Authoritative',
        effectiveDate: '2003-02-05',
        version: 'BD (Amendment) Act, 2023',
        provision: 'Section 6(1) & 6(1A)',
        url: 'http://nbaindia.org/',
        excerpt: 'Application for intellectual property rights not to be made without approval of National Biodiversity Authority. Approval mandatory prior to grant of patent in India.',
        whyRelevant: 'Mandatory statutory prerequisite for patent validity in India.',
        status: 'Current',
        relevance: 0.99
      }
    ],
    nextStep: 'Prepare NBA Form III application with exact botanical sourcing geo-coordinates and state if cultivated on private land for benefit-sharing tiering.'
  },
  {
    keywords: ['stability', 'rule 158-b', 'drugs and cosmetics', 'ayush license', 'shelf life'],
    response:
      'Under Rule 158-B of the Drugs and Cosmetics Rules, 1945, proprietary Ayurvedic medicines must provide:\n1. Proof of effectiveness based on textual references in Schedule I texts (for classical formulations) or safety/efficacy trial data (for novel proprietary medicines).\n2. Real-time or accelerated stability study data confirming shelf-life under Rule 161-B.\n3. Heavy metal (Lead, Cadmium, Mercury, Arsenic) and microbial load testing compliant with the Ayurvedic Pharmacopoeia of India (API).',
    reasoning:
      'Regulatory audit against Drugs and Cosmetics Rules 1945, Part XVI & Rule 158-B requirements for AYUSH state licensing.',
    confidence: 92,
    sources: [
      {
        sourceTitle: 'Drugs and Cosmetics Rules, 1945 - Rule 158-B',
        sourceType: 'Regulatory Rule',
        jurisdiction: 'India (IPO/AYUSH/NBA)',
        publication: 'Ministry of Health and Family Welfare / Ministry of AYUSH',
        reference: 'GSR 560(E), Rule 158-B',
        authority: 'State Licensing Authority (SLA) & Ministry of AYUSH',
        authorityLevel: 'Statutory',
        effectiveDate: '2010-08-10',
        provision: 'Rule 158-B (Guidelines for Issue of License with respect to ASU drugs)',
        url: 'https://ayush.gov.in/',
        excerpt: 'Provides the evidence framework required for licensing Patent or Proprietary Ayurvedic medicines, distinguishing between classical texts and new modified formulations.',
        whyRelevant: 'Governs the manufacturing license grant for ASU formulations.',
        status: 'Current',
        relevance: 0.97
      }
    ],
    nextStep: 'Finalize 3-batch stability testing reports according to API standards before submitting Form 24-D to the State Licensing Authority.'
  },
  {
    keywords: ['thmpd', 'europe', 'eu', 'ema', 'traditional herbal'],
    response:
      'Under the European Union’s Traditional Herbal Medicinal Products Directive (THMPD 2004/24/EC):\n1. To qualify for simplified registration, the herbal medicinal product must demonstrate 30 years of documented medicinal use, of which at least 15 years must have occurred within the European Union.\n2. Since many classical Ayurvedic botanicals struggle to document 15-year continuous EU clinical history, most companies enter Europe either under EU Food Supplement Regulations (Directive 2002/46/EC) or seek full Well-Established Use Marketing Authorisation (WEU) with bibliographic safety dossiers.',
    reasoning:
      'Evaluated Directive 2004/24/EC and EFSA botanical food supplement framework. 15-year EU usage threshold is the single most common stumbling block for direct herbal drug registration.',
    confidence: 93,
    sources: [
      {
        sourceTitle: 'Directive 2004/24/EC (Traditional Herbal Medicinal Products Directive - THMPD)',
        sourceType: 'International Material',
        jurisdiction: 'EU (EPO/EMA)',
        publication: 'Official Journal of the European Union',
        reference: 'Directive 2004/24/EC amending Directive 2001/83/EC',
        authority: 'European Medicines Agency (EMA) / HMPC',
        authorityLevel: 'Statutory',
        effectiveDate: '2004-04-30',
        provision: 'Article 16c(1)(c)',
        url: 'https://www.ema.europa.eu/en/human-regulatory/herbal-medicinal-products',
        excerpt: 'The applicant shall provide bibliographic or expert evidence to the effect that the medicinal product has been in medicinal use throughout a period of at least 30 years, including at least 15 years within the Community.',
        whyRelevant: 'Defines the legal bottleneck for registering Ayurvedic products as medicines in Europe.',
        status: 'Current',
        relevance: 0.96
      }
    ],
    nextStep: 'Evaluate entry as a Food Supplement compliant with Regulation (EC) 1924/2006 on nutrition and health claims.'
  }
]

export class ChatService {
  public static async queryBot(
    userText: string,
    options?: ChatServiceOptions
  ): Promise<ChatMessage> {
    const textLower = userText.toLowerCase()
    
    // Simulate brief processing delay
    await new Promise((resolve) => setTimeout(resolve, 450))

    let matched = MOCK_KNOWLEDGE_BASE.find((kb) =>
      kb.keywords.some((k) => textLower.includes(k))
    )

    if (!matched) {
      // General Ayurvedic IP guidance fallback
      matched = {
        keywords: [],
        response: `Based on current Ayurvedic IP jurisprudence and regulatory guidelines:\n\n1. **IP Angle:** If your query relates to classical botanical combinations, Section 3(p) of the Indian Patents Act prohibits broad patents on known traditional knowledge unless synergistic therapeutic efficacy or novel formulation technology is proven.\n2. **Biodiversity & ABS:** Sourcing Indian biological materials triggers NBA compliance under Section 3 / 6 of the Biological Diversity Act 2002.\n3. **Regulatory Route:** In India, choose between Classical (Form 25-D), Proprietary (Form 24-D / Rule 158-B), or Ayurveda Aahar (FSSAI 2022). For international markets (US/EU), food supplement pathways generally provide faster market access than herbal drug registration.\n\n*Note: Please provide more specific ingredient names or target markets for tailored statutory citations.*`,
        reasoning: 'Applied general statutory heuristic across Indian Patents Act 1970, Drugs & Cosmetics Rules 1945, and BD Act 2002.',
        confidence: 82,
        sources: [
          {
            sourceTitle: 'Guidelines for Processing of Patent Applications Relating to Traditional Knowledge and Biological Material',
            sourceType: 'Patent Law / Statute',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Office of the CGPDTM, India',
            reference: 'CGPDTM Guidelines, Chapter 3',
            authority: 'Indian Patent Office',
            authorityLevel: 'Regulatory',
            effectiveDate: '2012-12-18',
            provision: 'Guidelines 3.1 - 3.4',
            url: 'https://ipindia.gov.in/writereaddata/Portal/IPOGuidelines/1_37_1_guidelines-traditional-knowledge-biological-material.pdf',
            excerpt: 'Guidelines to Indian patent examiners for examining inventions relating to traditional knowledge and biological material.',
            whyRelevant: 'Official manual for assessing novelty and non-obviousness of ASU inventions.',
            status: 'Current',
            relevance: 0.88
          }
        ],
        nextStep: 'Check specific ingredients against the Traditional Knowledge Digital Library (TKDL) and Pharmacopoeia database.'
      }
    }

    let responseText = matched.response
    let reasoningText = matched.reasoning

    // If Hindi or Bengali requested
    if (options?.language === 'hi') {
      responseText = `[अनुवाद - हिन्दी]\n${responseText}\n\n(यह विश्लेषण भारतीय पेटेंट अधिनियम 1970 और आयुष विनियामक दिशा-निर्देशों के आधार पर तैयार किया गया है।)`
      reasoningText = `[तर्क]: ${reasoningText}`
    } else if (options?.language === 'bn') {
      responseText = `[অনুবাদ - বাংলা]\n${responseText}\n\n(এই বিশ্লেষণটি ভারতীয় পেটেন্ট আইন ১৯৭০ এবং আয়ুশ নিয়ন্ত্রক নির্দেশিকা অনুসারে প্রস্তুত করা হয়েছে।)`
      reasoningText = `[যুক্তি]: ${reasoningText}`
    }

    return {
      id: `chat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender: 'bot',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reasoning: reasoningText,
      confidence: matched.confidence,
      sources: matched.sources,
      nextStep: matched.nextStep,
      uploadedDocName: options?.uploadedDocName,
      language: options?.language || 'en'
    }
  }
}
