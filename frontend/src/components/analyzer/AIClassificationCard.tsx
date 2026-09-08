import type { AIClassification } from '../../types/analyzer'

interface AIClassificationCardProps {
  classification: AIClassification
}

export default function AIClassificationCard({
  classification,
}: AIClassificationCardProps) {
  return (
    <section className="ai-classification-section">
      <div className="classification-main-card">
        <div className="classification-header">
          <div className="classification-badge-wrap">
            <span className="classification-tag">AI CLASSIFICATION RESULT</span>
            <span className="confidence-pill">
              <span className="confidence-dot" />
              {classification.confidence}% Confidence
            </span>
          </div>

          <h2 className="classification-title">{classification.classification}</h2>
          <span className="classification-regulatory">
            📋 Governed under: <strong>{classification.regulatoryCategory}</strong>
          </span>
        </div>

        {/* WHY THIS CLASSIFICATION */}
        <div className="classification-explanation-box">
          <div className="explanation-box-header">
            <span className="explanation-icon">💡</span>
            <h3>Why this classification?</h3>
          </div>
          <p className="explanation-text">{classification.explanation}</p>
        </div>

        {/* KEY REGULATORY & RISK OBSERVATIONS */}
        {classification.riskFactors && classification.riskFactors.length > 0 && (
          <div className="classification-factors">
            <span className="factors-label">Key Regulatory Vectors Identified:</span>
            <div className="factors-list">
              {classification.riskFactors.map((factor, i) => (
                <span key={i} className="factor-tag">
                  ✓ {factor}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
