import type { LegalTimelineAct } from '../types/analyzer'


export const MASTER_LEGAL_TIMELINES: LegalTimelineAct[] = [
  {
    actId: 'act-patents-1970',
    actName: 'Indian Patents Act, 1970 & Rules',
    category: 'Patent & Intellectual Property',
    jurisdiction: 'India',
    versions: [
      {
        id: 'ver-patents-2024',
        documentTitle: 'Patents (Amendment) Rules, 2024',
        version: 'Rules 2024',
        status: 'Current',
        effectiveDate: '2024-03-15',
        jurisdiction: 'India',
        whatChanged: {
          previous: 'Statement of Working (Form 27) required annually for every financial year.',
          current: 'Form 27 now required once every 3 financial years. Substantial fee discounts introduced for educational & startup entities.',
          changeType: 'Procedural Streamlining & Cost Reduction',
          source: 'Gazette Notification G.S.R. 200(E)'
        },
        relevantProvisions: ['Rule 131 (Form 27 Working Statement)', 'Rule 12 (Statement & Undertaking Section 8)'],
        sourceUrl: 'https://ipindia.gov.in/',
        authority: 'Office of CGPDTM, DPIIT'
      },
      {
        id: 'ver-patents-2005',
        documentTitle: 'Patents (Amendment) Act, 2005',
        version: 'Act No. 15 of 2005',
        status: 'Current',
        effectiveDate: '2005-01-01',
        jurisdiction: 'India',
        whatChanged: {
          previous: 'Only process patents were allowed for food, medicine, and drug substances under Section 5.',
          current: 'Section 5 omitted; Product patent protection introduced in pharma/chemicals with stringent safeguards (Section 3(d), Section 3(p)).',
          changeType: 'Product Patent Introduction & TRIPS Alignment',
          source: 'Patents (Amendment) Act, 2005 (Act 15 of 2005)'
        },
        relevantProvisions: ['Section 3(d) (Incremental Innovation)', 'Section 3(p) (Traditional Knowledge bar)', 'Section 2(1)(ja) (Inventive Step)'],
        sourceUrl: 'https://ipindia.gov.in/',
        authority: 'Parliament of India'
      },
      {
        id: 'ver-patents-1970',
        documentTitle: 'Original Patents Act, 1970',
        version: 'Act No. 39 of 1970',
        status: 'Historical',
        effectiveDate: '1972-04-20',
        supersededDate: '2005-01-01',
        jurisdiction: 'India',
        whatChanged: {
          previous: 'Indian Patents and Designs Act, 1911.',
          current: 'Abolished product patents on food, medicine, and chemical substances to foster domestic generic pharmaceutical industry.',
          changeType: 'Foundational Legislation',
          source: 'Ayyangar Committee Report 1959'
        },
        relevantProvisions: ['Section 5 (Process patent only for substances)', 'Section 48 (Rights of patentees)'],
        authority: 'Parliament of India'
      }
    ]
  },
  {
    actId: 'act-biodiversity-2002',
    actName: 'Biological Diversity Act, 2002 & Amendments',
    category: 'Biodiversity & ABS',
    jurisdiction: 'India',
    versions: [
      {
        id: 'ver-bd-2023',
        documentTitle: 'Biological Diversity (Amendment) Act, 2023',
        version: 'Act No. 10 of 2023',
        status: 'Current',
        effectiveDate: '2023-08-03',
        jurisdiction: 'India',
        whatChanged: {
          previous: 'All commercial users of biological resources required prior approval and ABS fee payment to NBA/SBB.',
          current: 'Exempts registered AYUSH practitioners (vaidyas/hakims) and codified traditional knowledge from ABS fees. Decriminalizes minor offences replacing jail terms with civil penalties.',
          changeType: 'AYUSH Exemption & Decriminalization',
          source: 'Gazette of India, Extraordinary, Part II, Section 1, No. 13'
        },
        relevantProvisions: ['Section 3 (Certain persons not to undertake biodiversity-related activities without approval)', 'Section 6 (IP applications)', 'Section 40 (Exemptions)'],
        sourceUrl: 'http://nbaindia.org/',
        authority: 'National Biodiversity Authority (NBA)'
      },
      {
        id: 'ver-bd-2002',
        documentTitle: 'Biological Diversity Act, 2002 (Original)',
        version: 'Act No. 18 of 2003',
        status: 'Historical',
        effectiveDate: '2003-02-05',
        supersededDate: '2023-08-03',
        jurisdiction: 'India',
        whatChanged: {
          previous: 'No national legal framework enforcing Convention on Biological Diversity (CBD) Access and Benefit Sharing.',
          current: 'Established 3-tier structure: NBA (National), SBB (State), BMC (Local). Prior approval required for foreigners (Sec 3) and patenting (Sec 6).',
          changeType: 'Foundational ABS Framework',
          source: 'Convention on Biological Diversity (CBD 1992)'
        },
        relevantProvisions: ['Section 3, 4, 6, 19, 20'],
        authority: 'Ministry of Environment, Forest and Climate Change'
      }
    ]
  },
  {
    actId: 'act-dc-1945',
    actName: 'Drugs & Cosmetics Act, 1940 & Rules 1945 (ASU Provisions)',
    category: 'Drug Licensing & Safety',
    jurisdiction: 'India',
    versions: [
      {
        id: 'ver-dc-rule158b',
        documentTitle: 'Drugs & Cosmetics (Amendment) Rules: Rule 158-B',
        version: 'GSR 560(E)',
        status: 'Current',
        effectiveDate: '2010-08-10',
        jurisdiction: 'India',
        whatChanged: {
          previous: 'Ambiguity in licensing requirements between classical pharmacopoeial formulations and proprietary ASU medicines.',
          current: 'Formulated precise safety study and proof of effectiveness guidelines for Patent/Proprietary medicines based on text history and ingredients.',
          changeType: 'Evidence Standards for Licensing',
          source: 'AYUSH Notification GSR 560(E)'
        },
        relevantProvisions: ['Rule 158-B (Guidelines for license)', 'Rule 161-B (Shelf-life and stability)', 'Schedule I (Authoritative books)'],
        sourceUrl: 'https://ayush.gov.in/',
        authority: 'Ministry of AYUSH'
      },
      {
        id: 'ver-fssai-aahar',
        documentTitle: 'FSSAI (Ayurveda Aahar) Regulations, 2022',
        version: 'FSSAI Notification 2022',
        status: 'Current',
        effectiveDate: '2022-05-05',
        jurisdiction: 'India',
        whatChanged: {
          previous: 'Ayurvedic foods fell into an ambiguous regulatory gray area between FSSAI Nutraceutical regulations and AYUSH drug licensing.',
          current: 'Created a distinct dedicated category for "Ayurveda Aahar" with designated logo, prohibiting synthetic additives and drug claims.',
          changeType: 'New Dedicated Regulatory Pathway',
          source: 'FSSAI Standards Division'
        },
        relevantProvisions: ['Regulation 3 (General Requirements)', 'Schedule A (Authoritative Books)'],
        sourceUrl: 'https://fssai.gov.in/',
        authority: 'FSSAI & Ministry of AYUSH'
      }
    ]
  }
]

export class LegalTimelineService {
  public static getAllTimelines(): LegalTimelineAct[] {
    return MASTER_LEGAL_TIMELINES
  }

  public static getActTimeline(actId: string): LegalTimelineAct | undefined {
    return MASTER_LEGAL_TIMELINES.find((a) => a.actId === actId)
  }
}
