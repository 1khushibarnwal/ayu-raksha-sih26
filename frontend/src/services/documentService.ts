import type { UploadedDocumentMetadata, DocumentProcessingState } from '../types/analyzer'


export class DocumentService {
  private static mockDocuments: UploadedDocumentMetadata[] = [
    {
      id: 'doc-seed-001',
      documentName: 'Ashwagandha_Novel_Hydroethanolic_Extraction_SOP.pdf',
      documentType: 'Formulation',
      sizeBytes: 1024 * 840, // 840 KB
      uploadedAt: '2026-09-08 10:15 AM',
      processingStatus: 'complete',
      extractedChunksCount: 14,
      relevantSections: [
        'Extraction Parameters (Temperature 45°C, 60% Ethanol)',
        'HPLC Withanolide A/B Fingerprinting',
        'Comparative Bioavailability Data vs Crude Powder'
      ],
      jurisdiction: 'India / Global',
      evidenceGenerated: [
        {
          sourceTitle: 'SOP Document: Novel Hydroethanolic Extraction Protocol',
          sourceType: 'Research / Academic Source',
          jurisdiction: 'India (IPO/AYUSH/NBA)',
          publication: 'In-House Laboratory Dossier (Confidential)',
          reference: 'SOP-AYU-2026-009',
          authority: 'R&D Department',
          authorityLevel: 'Secondary',
          effectiveDate: '2026-01-15',
          excerpt: 'Standard operating procedure detailing the temperature-controlled ultrasonic assisted extraction of Withanolides.',
          whyRelevant: 'Supports process patent claim for non-obvious method parameters.',
          relevance: 0.94
        }
      ]
    },
    {
      id: 'doc-seed-002',
      documentName: 'Certificate_of_Analysis_Brahmi_Extract_Batch26.pdf',
      documentType: 'CoA Report',
      sizeBytes: 1024 * 320, // 320 KB
      uploadedAt: '2026-09-08 11:30 AM',
      processingStatus: 'complete',
      extractedChunksCount: 6,
      relevantSections: [
        'Heavy Metal ICP-MS Profile (Pb < 0.5 ppm, Hg < 0.1 ppm, As < 0.2 ppm)',
        'Microbial Total Viable Aerobic Count (Compliant with API)',
        'Bacoside A & B quantification (22.4% w/w)'
      ],
      jurisdiction: 'India / USA',
      evidenceGenerated: [
        {
          sourceTitle: 'Certificate of Analysis - Standardized Bacopa Monnieri',
          sourceType: 'Pharmacopoeia',
          jurisdiction: 'India (IPO/AYUSH/NBA)',
          publication: 'NABL Accredited Testing Laboratory',
          reference: 'CoA-AYUSH-2026-8812',
          authority: 'NABL / ISO 17025 Certified Lab',
          authorityLevel: 'Authoritative',
          effectiveDate: '2026-02-10',
          excerpt: 'Heavy metal screening indicates purity within strict US FDA / USP <2232> limits.',
          whyRelevant: 'Satisfies quality compliance for both AYUSH Rule 161-B and US dietary supplement import specs.',
          relevance: 0.91
        }
      ]
    }
  ]

  public static getDocuments(): UploadedDocumentMetadata[] {
    return [...this.mockDocuments]
  }

  public static async processUploadedFile(
    file: File,
    onProgress?: (state: DocumentProcessingState) => void
  ): Promise<UploadedDocumentMetadata> {
    const docId = `doc-${Date.now()}`
    
    // Simulate pipeline: uploading -> validating -> extracting -> chunking -> complete
    if (onProgress) onProgress('uploading')
    await new Promise((r) => setTimeout(r, 400))

    if (onProgress) onProgress('validating')
    await new Promise((r) => setTimeout(r, 350))

    if (onProgress) onProgress('extracting')
    await new Promise((r) => setTimeout(r, 400))

    if (onProgress) onProgress('chunking')
    await new Promise((r) => setTimeout(r, 350))

    // Determine type from filename
    let docType: UploadedDocumentMetadata['documentType'] = 'Formulation'
    const nameLower = file.name.toLowerCase()
    if (nameLower.includes('patent') || nameLower.includes('spec')) {
      docType = 'Patent Spec'
    } else if (nameLower.includes('coa') || nameLower.includes('analysis') || nameLower.includes('test')) {
      docType = 'CoA Report'
    } else if (nameLower.includes('trial') || nameLower.includes('paper') || nameLower.includes('study')) {
      docType = 'Research Paper'
    } else if (nameLower.includes('dossier') || nameLower.includes('regulatory')) {
      docType = 'Regulatory Dossier'
    }

    const newDoc: UploadedDocumentMetadata = {
      id: docId,
      documentName: file.name,
      documentType: docType,
      sizeBytes: file.size,
      uploadedAt: new Date().toLocaleString(),
      processingStatus: 'complete',
      extractedChunksCount: Math.max(4, Math.floor(file.size / 40000) + 2),
      relevantSections: [
        'Extracted Botanical Nomenclature & Part Used',
        'Chemical Characterization & Assay Markers',
        'Safety, Toxicology & Classical Reference Citations'
      ],
      jurisdiction: 'India / Multi-Jurisdiction',
      evidenceGenerated: [
        {
          sourceTitle: `Uploaded Dossier: ${file.name}`,
          sourceType: 'Government Document',
          jurisdiction: 'India (IPO/AYUSH/NBA)',
          publication: 'User Submitted Technical Specification',
          reference: `USER-DOC-${docId.substring(4, 10).toUpperCase()}`,
          authority: 'User Enterprise Submission',
          authorityLevel: 'Secondary',
          effectiveDate: new Date().toISOString().split('T')[0],
          excerpt: `Directly extracted technical text and formulation parameters from ${file.name}.`,
          whyRelevant: 'Context injected into RAG chat & multi-jurisdiction readiness evaluation.',
          relevance: 0.89
        }
      ]
    }

    this.mockDocuments.unshift(newDoc)
    if (onProgress) onProgress('complete')
    return newDoc
  }

  public static deleteDocument(docId: string): void {
    this.mockDocuments = this.mockDocuments.filter((d) => d.id !== docId)
  }
}
