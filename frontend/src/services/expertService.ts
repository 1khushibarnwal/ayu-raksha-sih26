import type {
  ExpertRequest,
  ExpertRequestStatus,
} from '../types/analyzer'

const STORAGE_KEY = 'ayuraksha_expert_requests_v1'

const initialMockRequests: ExpertRequest[] = [
  {
    id: 'EXP-2026-8901',
    innovationId: 'INV-SAMPLE-01',
    productName: 'AyurSnooze Stress Relief Matrix',
    requesterName: 'Dr. Ananya Sharma',
    requesterEmail: 'ananya.sharma@ayurvedalabs.in',
    requesterRole: 'Pharma / Biotech Researcher',
    issueCategory: 'Section 3(p) Patent Eligibility',
    urgency: 'Urgent',
    description:
      'We have observed enhanced bio-availability (>3.8x) of withanolides when combined with standardized bacosides. We need expert opinion on framing patent claims under Section 3(e) to overcome mere admixture objections from the Indian Patent Office.',
    extractedContext:
      'Innovation: Classical Withania somnifera + Bacopa monnieri combination with liposomal lipid nano-carrier delivery system. Target Markets: India, USA, EU.',
    missingInformation: [
      'Comparative isobologram analysis (Chou-Talalay CI index values)',
      'Specific lipid-to-botanical stoichiometric ratio ranges',
    ],
    attachedEvidenceCount: 6,
    status: 'In Review',
    assignedExpert: {
      name: 'Adv. Rajeshwar Sen',
      title: 'Senior Patent Attorney & Ayush IP Specialist',
      organization: 'National IP Law Chamber, New Delhi',
      specialization: 'Ayurvedic Patenting & Section 3(p) Rebuttals',
    },
    expertNotes:
      'Preliminary examination shows strong inventive step potential in the lipid entrapment method. Draft claim set to focus on method of formulation rather than biological synergy alone.',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'EXP-2026-8902',
    innovationId: 'INV-SAMPLE-02',
    productName: 'Triphala-Curcumin Bioenhancer Gel',
    requesterName: 'Vikramaditya Vaidya',
    requesterEmail: 'vikram@vedichealth.org',
    requesterRole: 'Ayurvedic Practitioner (Vaidya)',
    issueCategory: 'NBA / Biological Diversity ABS',
    urgency: 'Standard',
    description:
      'Requesting verification of NBA Form I vs Form III requirements for wild-harvested Terminalia chebula procured through certified tribal collectors in Western Ghats for export to USA.',
    extractedContext:
      'Procurement: Wild sourced tribal community supply chain. Target Markets: India, USA.',
    missingInformation: [
      'State Biodiversity Board (SBB) intimation slip number',
      'Local Biodiversity Management Committee (BMC) prior informed consent documentation',
    ],
    attachedEvidenceCount: 4,
    status: 'Assigned',
    assignedExpert: {
      name: 'Dr. Meenakshi Sundaram',
      title: 'Biodiversity Law & ABS Compliance Advisor',
      organization: 'Centre for Traditional Knowledge & Biodiversity Policy',
      specialization: 'Biological Diversity Act 2002 & Nagoya Protocol',
    },
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
]

export function getExpertRequests(): ExpertRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (err) {
    console.error('Failed to load expert requests from storage:', err)
  }
  // Initialize with mocks if empty
  saveExpertRequests(initialMockRequests)
  return initialMockRequests
}

export function saveExpertRequests(requests: ExpertRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
  } catch (err) {
    console.error('Failed to save expert requests:', err)
  }
}

export function createExpertRequest(
  data: Omit<ExpertRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): ExpertRequest {
  const current = getExpertRequests()
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  const newReq: ExpertRequest = {
    ...data,
    id: `EXP-${new Date().getFullYear()}-${randomNum}`,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const updated = [newReq, ...current]
  saveExpertRequests(updated)
  return newReq
}

export function getExpertRequestById(id: string): ExpertRequest | undefined {
  const all = getExpertRequests()
  return all.find((r) => r.id === id)
}

export function updateExpertRequestStatus(
  id: string,
  status: ExpertRequestStatus,
  notes?: string
): ExpertRequest | undefined {
  const all = getExpertRequests()
  const item = all.find((r) => r.id === id)
  if (!item) return undefined

  item.status = status
  item.updatedAt = new Date().toISOString()
  if (notes) {
    item.expertNotes = notes
  }

  saveExpertRequests(all)
  return item
}
