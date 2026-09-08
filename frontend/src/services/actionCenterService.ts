import type { ActionCenterResult, ActionTask, InnovationFormData } from '../types/analyzer'


export class ActionCenterService {
  public static generateActionCenter(formData: InnovationFormData): ActionCenterResult {
    const hasUS = formData.targetMarkets.includes('USA')
    const hasEU = formData.targetMarkets.includes('EU')


    const tasks: ActionTask[] = [
      // High Priority
      {
        id: 'act-001',
        title: 'File NBA Form III Prior Approval before Indian Patent Grant',
        priority: 'High Priority',
        status: 'Pending',
        sourceFeature: 'Biodiversity & ABS Checker',
        reason: 'Section 6 of the Biological Diversity Act 2002 mandates prior approval of NBA before obtaining any IPR in India based on Indian biological resources.',
        dueDate: 'Within 30 days',
        suggestedAction: 'Draft NBA Form III with exact source geo-coordinates and state vendor details.',
        evidence: [
          {
            sourceTitle: 'Biological Diversity Act, 2002 - Section 6',
            sourceType: 'Biodiversity Law',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'NBA India',
            reference: 'Sec 6(1)',
            authority: 'National Biodiversity Authority',
            authorityLevel: 'Statutory',
            excerpt: 'Application for IPR not to be granted without prior approval of NBA.',
            whyRelevant: 'Mandatory legal requirement to prevent patent revocation under Section 64(1)(p).',
            relevance: 0.99
          }
        ]
      },
      {
        id: 'act-002',
        title: 'Draft Comparative Synergy Proof for Section 3(d) & 3(p) Overcoming',
        priority: 'High Priority',
        status: 'In Progress',
        sourceFeature: 'IP Protection Strategy',
        reason: 'Patent examiners at the Indian Patent Office routinely cite classical Ayurvedic texts (Charaka/TKDL) under Section 3(p) unless synergistic therapeutic efficacy is experimentally proven.',
        dueDate: 'Prior to Complete Specification filing',
        suggestedAction: 'Include combination index (CI < 1) graphs and comparative in-vitro / clinical assay tables in the patent description.',
        evidence: [
          {
            sourceTitle: 'Indian Patents Act, 1970 - Section 3(d) & 3(p)',
            sourceType: 'Patent Law / Statute',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'CGPDTM Manual',
            reference: 'Section 3(p)',
            authority: 'Indian Patent Office',
            authorityLevel: 'Statutory',
            excerpt: 'Aggregation of known properties of traditionally known components is non-patentable.',
            whyRelevant: 'Crucial for passing inventive step and non-obviousness tests.',
            relevance: 0.98
          }
        ]
      },

      // Medium Priority
      {
        id: 'act-003',
        title: 'Initiate Accelerated Stability Testing (Rule 161-B)',
        priority: 'Medium Priority',
        status: 'In Progress',
        sourceFeature: 'Regulatory Navigator',
        reason: 'Rule 161-B of Drugs and Cosmetics Rules mandates accelerated stability data (40°C ± 2°C / 75% RH ± 5% RH) to support claimed shelf life.',
        dueDate: '6 Months duration',
        suggestedAction: 'Place 3 commercial test batches into stability chambers and record 0, 1, 3, and 6-month assay degradation curves.',
        evidence: [
          {
            sourceTitle: 'Drugs and Cosmetics Rules, 1945 - Rule 161-B',
            sourceType: 'Regulatory Rule',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Ministry of AYUSH',
            reference: 'Rule 161-B',
            authority: 'State Licensing Authority',
            authorityLevel: 'Statutory',
            excerpt: 'Mandatory stability testing parameters for shelf life claims on Ayurvedic formulations.',
            whyRelevant: 'Required for Form 24-D manufacturing license dossier.',
            relevance: 0.94
          }
        ]
      },
      {
        id: 'act-004',
        title: 'Conduct Trademark Clearance Search in Class 5 & Class 30',
        priority: 'Medium Priority',
        status: 'Pending',
        sourceFeature: 'IP Protection Strategy',
        reason: 'Ensure proposed brand name does not conflict with existing registered Ayurvedic or pharmaceutical marks under Trademark Class 5.',
        dueDate: 'Before public branding launch',
        suggestedAction: 'Run phonetics and wordmark search on IP India Public Search portal (ipindiaservices.gov.in).',
        evidence: [
          {
            sourceTitle: 'Trade Marks Act, 1999 - Section 9 & 11',
            sourceType: 'Patent Law / Statute',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Controller General of Patents, Designs and Trade Marks',
            reference: 'Act No. 47 of 1999',
            authority: 'Trade Marks Registry',
            authorityLevel: 'Statutory',
            excerpt: 'Relative and absolute grounds for refusal of trademark registration.',
            whyRelevant: 'Ensures exclusivity over brand identity and packaging visual elements.',
            relevance: 0.91
          }
        ]
      },

      // International / Upcoming
      ...(hasUS
        ? [
            {
              id: 'act-005',
              title: 'US FDA DSHEA & California Prop 65 Heavy Metal Audit',
              priority: 'High Priority' as const,
              status: 'Pending' as const,
              sourceFeature: 'Global Market Simulator (USA)',
              reason: 'California Proposition 65 has extremely strict daily limits on Lead (0.5 µg/day) which traditional Ayurvedic preparations frequently exceed unless purified.',
              dueDate: 'Prior to US export shipment',
              suggestedAction: 'Send batch samples to ISO 17025 accredited laboratory for ICP-MS heavy metal quantification.',
              evidence: [
                {
                  sourceTitle: 'California Proposition 65 Safe Harbor Levels',
                  sourceType: 'Regulatory Rule' as const,
                  jurisdiction: 'USA (USPTO/FDA)' as const,
                  publication: 'OEHHA California',
                  reference: 'OEHHA Prop 65 List',
                  authority: 'OEHHA',
                  authorityLevel: 'Statutory' as const,
                  excerpt: 'Maximum allowable dose levels (MADLs) for reproductive toxins and NSRLs for carcinogens.',
                  whyRelevant: 'Primary cause of civil litigation against Ayurvedic dietary supplement importers.',
                  relevance: 0.96
                }
              ]
            }
          ]
        : []),

      ...(hasEU
        ? [
            {
              id: 'act-006',
              title: 'EU Botanical Classification & Novel Food Catalog Check',
              priority: 'Medium Priority' as const,
              status: 'Pending' as const,
              sourceFeature: 'Global Market Simulator (EU)',
              reason: 'Check whether all formulation herbs have confirmed history of consumption in the EU prior to 15 May 1997 under Regulation (EU) 2015/2283.',
              dueDate: 'Prior to EU distribution',
              suggestedAction: 'Query EU Novel Food Status Catalogue for each botanical extract.',
              evidence: [
                {
                  sourceTitle: 'EU Novel Food Regulation (EU) 2015/2283',
                  sourceType: 'International Material' as const,
                  jurisdiction: 'EU (EPO/EMA)' as const,
                  publication: 'European Commission',
                  reference: 'Regulation (EU) 2015/2283',
                  authority: 'EFSA / European Commission',
                  authorityLevel: 'Statutory' as const,
                  excerpt: 'Requires authorization for foods that were not used for human consumption to a significant degree within the Union before 15 May 1997.',
                  whyRelevant: 'Avoids port border seizures and marketing bans in the European Union.',
                  relevance: 0.93
                }
              ]
            }
          ]
        : []),

      // Upcoming
      {
        id: 'act-007',
        title: 'Setup Schedule T GMP Batch Manufacturing Records',
        priority: 'Upcoming',
        status: 'Pending',
        sourceFeature: 'Regulatory Navigator',
        reason: 'AYUSH manufacturing facility must maintain detailed Master Formula Records and Batch Manufacturing Records as per Schedule T.',
        dueDate: 'Before commercial production',
        suggestedAction: 'Deploy standardized BMR log templates and validate water purification and air handling systems.',
        evidence: [
          {
            sourceTitle: 'Drugs and Cosmetics Rules, 1945 - Schedule T',
            sourceType: 'Regulatory Rule',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'Ministry of AYUSH',
            reference: 'Schedule T Part I',
            authority: 'CDSCO',
            authorityLevel: 'Authoritative',
            excerpt: 'Factory premises, hygienic conditions and equipment specifications for ASU drug production.',
            whyRelevant: 'Mandatory standard for grant and renewal of manufacturing license.',
            relevance: 0.95
          }
        ]
      },

      // Completed
      {
        id: 'act-008',
        title: 'Initial Classical TKDL & Pharmacopoeial Prior Art Screening',
        priority: 'Completed',
        status: 'Done',
        sourceFeature: 'Traditional Knowledge Detector',
        reason: 'Identified classical formulations and mapped botanical references in ancient literature.',
        dueDate: 'Completed',
        suggestedAction: 'Keep report archived in Evidence Locker for patent examiner responses.',
        evidence: [
          {
            sourceTitle: 'CSIR-TKDL Database Prior Art Screening',
            sourceType: 'TKDL Database',
            jurisdiction: 'India (IPO/AYUSH/NBA)',
            publication: 'AYU-RAKSHA RAG Engine',
            reference: 'RAG-TK-ANALYSIS-2026',
            authority: 'AYU-RAKSHA AI',
            authorityLevel: 'Defensive Prior Art',
            excerpt: 'Screening concluded with classical literature match score and boundary recommendations.',
            whyRelevant: 'Completed baseline assessment.',
            relevance: 0.94
          }
        ]
      }
    ]

    const highCount = tasks.filter((t) => t.priority === 'High Priority' && t.status !== 'Done').length
    const mediumCount = tasks.filter((t) => t.priority === 'Medium Priority' && t.status !== 'Done').length
    const upcomingCount = tasks.filter((t) => t.priority === 'Upcoming' && t.status !== 'Done').length
    const completedCount = tasks.filter((t) => t.status === 'Done' || t.priority === 'Completed').length

    return {
      tasks,
      summary: {
        highCount,
        mediumCount,
        upcomingCount,
        completedCount
      }
    }
  }
}
