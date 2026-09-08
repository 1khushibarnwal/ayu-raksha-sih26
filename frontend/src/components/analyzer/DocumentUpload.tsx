import React, { useState, useRef } from 'react'
import type { UploadedDocumentMetadata, DocumentProcessingState } from '../../types/analyzer'
import { DocumentService } from '../../services/documentService'


interface DocumentUploadProps {
  onDocumentSelectForChat?: (docName: string) => void
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onDocumentSelectForChat }) => {
  const [documents, setDocuments] = useState<UploadedDocumentMetadata[]>(DocumentService.getDocuments())
  const [processingState, setProcessingState] = useState<DocumentProcessingState>('idle')
  const [currentFileName, setCurrentFileName] = useState<string>('')
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file) return
    setCurrentFileName(file.name)

    try {
      const processedDoc = await DocumentService.processUploadedFile(file, (state) => {
        setProcessingState(state)
      })
      setDocuments(DocumentService.getDocuments())
      if (onDocumentSelectForChat) {
        onDocumentSelectForChat(processedDoc.documentName)
      }
    } catch (err) {
      console.error('File processing error:', err)
      setProcessingState('failed')
    } finally {
      setTimeout(() => {
        setProcessingState('idle')
        setCurrentFileName('')
      }, 1500)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleDelete = (id: string) => {
    DocumentService.deleteDocument(id)
    setDocuments(DocumentService.getDocuments())
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="document-upload-container">
      <div className="doc-upload-header">
        <div className="title-area">
          <div className="feature-pill">Feature 18 • Intelligent Dossier Ingestion</div>
          <h2 className="section-title">Document Upload & Analysis Engine</h2>
          <p className="section-subtitle">
            Upload formulation sheets, Certificates of Analysis (CoA), patent specifications, or regulatory dossiers for automated parsing and RAG context injection.
          </p>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        className={`upload-dropzone ${isDragOver ? 'drag-over' : ''} ${
          processingState !== 'idle' ? 'is-processing' : ''
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".pdf,.docx,.txt,.json,.csv"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileUpload(e.target.files[0])
            }
          }}
        />

        {processingState === 'idle' ? (
          <div className="dropzone-prompt">
            <div className="upload-icon-circle">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <h3>Drag & drop your formulation dossier here</h3>
            <p className="dropzone-subtext">or click to browse from your device (PDF, DOCX, TXT, JSON, CSV)</p>
            <div className="supported-types-pill">
              Supported: Formulation SOPs • CoA Test Reports • Clinical Dossiers • Patent Drafts
            </div>
          </div>
        ) : (
          <div className="processing-pipeline-status">
            <div className="pipeline-spinner">
              <div className="spinner-orbit"></div>
            </div>
            <h3>Processing: {currentFileName}</h3>

            <div className="pipeline-steps-indicator">
              <div className={`pipe-step ${['uploading', 'validating', 'extracting', 'chunking', 'complete'].includes(processingState) ? 'active-step' : ''}`}>
                <span className="step-bullet">1</span>
                <span>Upload & Validate</span>
              </div>
              <div className={`pipe-step ${['extracting', 'chunking', 'complete'].includes(processingState) ? 'active-step' : ''}`}>
                <span className="step-bullet">2</span>
                <span>Extract Text & Tables</span>
              </div>
              <div className={`pipe-step ${['chunking', 'complete'].includes(processingState) ? 'active-step' : ''}`}>
                <span className="step-bullet">3</span>
                <span>Vectorize & Chunk</span>
              </div>
              <div className={`pipe-step ${processingState === 'complete' ? 'active-step complete-step' : ''}`}>
                <span className="step-bullet">4</span>
                <span>RAG Context Ready</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Documents List */}
      <div className="uploaded-dossiers-section">
        <div className="dossiers-header">
          <h3>Parsed Documents & RAG Context Store ({documents.length})</h3>
        </div>

        <div className="dossiers-list">
          {documents.length === 0 ? (
            <div className="empty-dossiers">No documents uploaded yet.</div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="dossier-card">
                <div className="dossier-main-row">
                  <div className="dossier-icon-col">
                    <span className="file-type-badge">{doc.documentType}</span>
                  </div>

                  <div className="dossier-info-col">
                    <h4 className="doc-name">{doc.documentName}</h4>
                    <div className="doc-meta-bar">
                      <span><strong>Size:</strong> {formatFileSize(doc.sizeBytes)}</span>
                      <span><strong>Uploaded:</strong> {doc.uploadedAt}</span>
                      <span><strong>Chunks:</strong> {doc.extractedChunksCount} vector embeddings</span>
                      <span className="status-complete-tag">✓ Ready for RAG Analysis</span>
                    </div>

                    <div className="doc-sections-tag-list">
                      <span className="section-label">Identified Sections:</span>
                      {doc.relevantSections.map((sec, sIdx) => (
                        <span key={sIdx} className="sec-chip">{sec}</span>
                      ))}
                    </div>
                  </div>

                  <div className="dossier-actions-col">
                    {onDocumentSelectForChat && (
                      <button
                        type="button"
                        className="btn-chat-with-doc"
                        onClick={() => onDocumentSelectForChat(doc.documentName)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Ask AI with Doc
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn-delete-doc"
                      onClick={() => handleDelete(doc.id)}
                      title="Delete document"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
