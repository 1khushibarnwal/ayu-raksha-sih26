import type { KnowledgeSourceItem, KnowledgeSourceFilter } from '../types/analyzer'


export const MASTER_KNOWLEDGE_SOURCES: KnowledgeSourceItem[] = [
  {
    id: 'src-001',
    sourceTitle: 'Indian Patents Act, 1970 (Section 3(p))',
    sourceType: 'Patent Law / Statute',
    jurisdiction: 'India (IPO/AYUSH/NBA)',
    publication: 'Ministry of Law and Justice, Govt. of India',
    reference: 'Act No. 39 of 1970 (as amended 2005)',
    authority: 'Office of the CGPDTM, India',
    authorityLevel: 'Statutory',
    effectiveDate: '1972-04-20',
    version: '2005 Amendment',
    provision: 'Section 3(p)',
    url: 'https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_31_1_patent-act-1970-11march2015.pdf',
    excerpt: 'An invention which in effect is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components is non-patentable.',
    fullTextSnippet: 'Section 3. What are not inventions.—The following are not inventions within the meaning of this Act,— ...(p) an invention which in effect is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components.',
    whyRelevant: 'Fundamental statutory barrier preventing frivolous patent claims on traditional Ayurvedic remedies.',
    status: 'Current',
    relevance: 0.99,
    lastUpdated: '2025-01-10',
    citationsCount: 1420
  },
  {
    id: 'src-002',
    sourceTitle: 'Indian Patents Act, 1970 (Section 3(d))',
    sourceType: 'Patent Law / Statute',
    jurisdiction: 'India (IPO/AYUSH/NBA)',
    publication: 'Ministry of Law and Justice, Govt. of India',
    reference: 'Act No. 39 of 1970 (as amended 2005)',
    authority: 'Office of the CGPDTM, India',
    authorityLevel: 'Statutory',
    effectiveDate: '2005-01-01',
    version: '2005 Amendment',
    provision: 'Section 3(d)',
    url: 'https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_31_1_patent-act-1970-11march2015.pdf',
    excerpt: 'The mere discovery of a new form of a known substance which does not result in the enhancement of the known efficacy of that substance is non-patentable.',
    fullTextSnippet: 'Explanation.—For the purposes of this clause, salts, esters, ethers, polymorphs, metabolites, pure form, particle size, isomers, mixtures of isomers, complexes, combinations and other derivatives of known substance shall be considered to be the same substance, unless they differ significantly in properties with regard to efficacy.',
    whyRelevant: 'Requires novel formulations or extracts to demonstrate statistically significant enhanced therapeutic efficacy over crude classical powders.',
    status: 'Current',
    relevance: 0.95,
    lastUpdated: '2025-01-10',
    citationsCount: 2310
  },
  {
    id: 'src-003',
    sourceTitle: 'Biological Diversity Act, 2002 & BD (Amendment) Act, 2023',
    sourceType: 'Biodiversity Law',
    jurisdiction: 'India (IPO/AYUSH/NBA)',
    publication: 'National Biodiversity Authority, Govt. of India',
    reference: 'Act No. 18 of 2003 & Act No. 10 of 2023',
    authority: 'National Biodiversity Authority (NBA)',
    authorityLevel: 'Statutory',
    effectiveDate: '2023-08-03',
    version: '2023 Amendment Act',
    provision: 'Section 3, Section 4, Section 6',
    url: 'http://nbaindia.org/',
    excerpt: 'Prior approval of NBA required before applying for IPR on inventions based on Indian biological resources. Registered AYUSH practitioners and codified traditional knowledge exempted from certain commercial ABS fees under the 2023 amendment.',
    fullTextSnippet: 'Section 6(1): No person shall apply for any intellectual property right, by whatever name called, in or outside India for any invention based on any research or information on a biological resource obtained from India without obtaining the previous approval of National Biodiversity Authority before grant of such intellectual property right.',
    whyRelevant: 'Governs all Access & Benefit Sharing (ABS) obligations and foreign patent filings utilizing Indian botanicals.',
    status: 'Current',
    relevance: 0.98,
    lastUpdated: '2025-06-15',
    citationsCount: 890
  },
  {
    id: 'src-004',
    sourceTitle: 'Drugs and Cosmetics Rules, 1945 (Rule 158-B)',
    sourceType: 'Regulatory Rule',
    jurisdiction: 'India (IPO/AYUSH/NBA)',
    publication: 'Ministry of Health and Family Welfare / Ministry of AYUSH',
    reference: 'GSR 560(E), Schedule I & Rule 158-B',
    authority: 'Ministry of AYUSH & State Licensing Authorities (SLA)',
    authorityLevel: 'Authoritative',
    effectiveDate: '2010-08-10',
    version: 'Current Consolidated',
    provision: 'Rule 158-B',
    url: 'https://ayush.gov.in/',
    excerpt: 'Guidelines for issue of license with respect to Ayurvedic, Siddha or Unani drugs under Patent or Proprietary categories.',
    fullTextSnippet: 'Rule 158-B: (I) For patent or proprietary Ayurveda, Siddha and Unani medicines, safety study and proof of effectiveness shall be submitted along with the application in accordance with the specified guidelines.',
    whyRelevant: 'Mandates specific evidence thresholds, safety trials, and classical text citations for manufacturing licenses.',
    status: 'Current',
    relevance: 0.97,
    lastUpdated: '2024-11-20',
    citationsCount: 3100
  },
  {
    id: 'src-005',
    sourceTitle: 'FSSAI (Ayurveda Aahar) Regulations, 2022',
    sourceType: 'Regulatory Rule',
    jurisdiction: 'India (IPO/AYUSH/NBA)',
    publication: 'Food Safety and Standards Authority of India',
    reference: 'F. No. Stds/SP(Nutraceuticals)/Ayur-Aahar/FSSAI-2021',
    authority: 'FSSAI & Ministry of AYUSH Expert Committee',
    authorityLevel: 'Statutory',
    effectiveDate: '2022-05-05',
    version: 'Notification 2022',
    provision: 'Regulation 3 & Schedule A',
    url: 'https://www.fssai.gov.in/',
    excerpt: 'Defines food prepared in accordance with recipes or ingredients specified in authoritative books of Ayurveda listed in Schedule A of the regulations.',
    fullTextSnippet: 'Ayurveda Aahar shall not include Ayurvedic drugs or medicines. No synthetic vitamins or minerals may be added unless naturally occurring. Special Ayurveda Aahar logo is mandatory on packaging.',
    whyRelevant: 'Enables quick-to-market consumer wellness and food formats without pharmaceutical drug manufacturing constraints.',
    status: 'Current',
    relevance: 0.92,
    lastUpdated: '2024-08-12',
    citationsCount: 540
  },
  {
    id: 'src-006',
    sourceTitle: 'Traditional Knowledge Digital Library (TKDL)',
    sourceType: 'TKDL Database',
    jurisdiction: 'India (IPO/AYUSH/NBA)',
    publication: 'Council of Scientific and Industrial Research (CSIR) & Ministry of AYUSH',
    reference: 'TKDL Master Database Repository',
    authority: 'CSIR-TKDL',
    authorityLevel: 'Defensive Prior Art',
    effectiveDate: '2001-01-01',
    version: 'Public & Examiner Portal',
    url: 'https://www.tkdl.res.in/',
    excerpt: 'Over 400,000 formulations from classical texts (Ayurveda, Unani, Siddha, Sowa-Rigpa) transcribed in patent classification languages (IPC).',
    fullTextSnippet: 'The TKDL is a pioneer Indian initiative to prevent misappropriation of country’s traditional medicinal knowledge at International Patent Offices on non-original inventions.',
    whyRelevant: 'Primary prior art source consulted by USPTO, EPO, JPO, and Indian Patent Office.',
    status: 'Current',
    relevance: 0.96,
    lastUpdated: '2025-02-01',
    citationsCount: 4200
  },
  {
    id: 'src-007',
    sourceTitle: 'US Dietary Supplement Health and Education Act of 1994 (DSHEA)',
    sourceType: 'Regulatory Rule',
    jurisdiction: 'USA (USPTO/FDA)',
    publication: 'US Food and Drug Administration (FDA)',
    reference: 'Public Law 103-417; 21 U.S.C. § 321(ff)',
    authority: 'US FDA CFSAN',
    authorityLevel: 'Statutory',
    effectiveDate: '1994-10-25',
    version: '21 CFR Part 111 & Part 190',
    provision: '21 U.S.C. 321(ff) / 21 CFR 190.6',
    url: 'https://www.fda.gov/food/dietary-supplements',
    excerpt: 'Regulates dietary ingredients and supplements. Requires 75-day premarket NDI notification for ingredients introduced after Oct 15, 1994.',
    whyRelevant: 'Governs the import, labeling, cGMP compliance, and permissible claims of Ayurvedic botanicals in the United States.',
    status: 'Current',
    relevance: 0.94,
    lastUpdated: '2024-04-10',
    citationsCount: 1890
  },
  {
    id: 'src-008',
    sourceTitle: 'EU Traditional Herbal Medicinal Products Directive (THMPD 2004/24/EC)',
    sourceType: 'International Material',
    jurisdiction: 'EU (EPO/EMA)',
    publication: 'European Medicines Agency (EMA)',
    reference: 'Directive 2004/24/EC',
    authority: 'Committee on Herbal Medicinal Products (HMPC) / EMA',
    authorityLevel: 'Statutory',
    effectiveDate: '2004-04-30',
    version: 'Official Journal L 136',
    provision: 'Article 16a - 16i',
    url: 'https://www.ema.europa.eu/en/human-regulatory/herbal-medicinal-products',
    excerpt: 'Establishes simplified registration for traditional herbal medicinal products with 30 years documented use (including 15 years within the EU).',
    whyRelevant: 'Key legal standard for placing Ayurvedic herbal remedies on the market in EU member states.',
    status: 'Current',
    relevance: 0.93,
    lastUpdated: '2023-12-05',
    citationsCount: 970
  }
]

export class SourceExplorerService {
  public static searchSources(filter: KnowledgeSourceFilter): KnowledgeSourceItem[] {
    return MASTER_KNOWLEDGE_SOURCES.filter((item) => {
      if (filter.query) {
        const q = filter.query.toLowerCase()
        const matchTitle = item.sourceTitle.toLowerCase().includes(q)
        const matchExcerpt = item.excerpt.toLowerCase().includes(q)
        const matchProv = item.provision?.toLowerCase().includes(q) || false
        const matchAuth = item.authority?.toLowerCase().includes(q) || false
        const matchRef = item.reference.toLowerCase().includes(q)
        if (!matchTitle && !matchExcerpt && !matchProv && !matchAuth && !matchRef) {
          return false
        }
      }
      if (filter.sourceType && item.sourceType !== filter.sourceType) {
        return false
      }
      if (filter.jurisdiction && !item.jurisdiction.includes(filter.jurisdiction)) {
        return false
      }
      if (filter.authorityLevel && item.authorityLevel !== filter.authorityLevel) {
        return false
      }
      if (filter.status && item.status !== filter.status) {
        return false
      }
      return true
    })
  }

  public static getSourceById(id: string): KnowledgeSourceItem | undefined {
    return MASTER_KNOWLEDGE_SOURCES.find((s) => s.id === id)
  }
}
