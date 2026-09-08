import { useState, useEffect } from 'react'

const loadingSteps = [
  { text: 'Analyzing your innovation...', icon: '🌿' },
  { text: 'Checking formulation characteristics...', icon: '⚗️' },
  { text: 'Assessing traditional knowledge overlap...', icon: '📜' },
  { text: 'Cross-referencing TKDL & classical Samhitas...', icon: '🔍' },
  { text: 'Preparing Innovation Profile & Risk Report...', icon: '✨' },
]

export default function AnalysisLoading() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev))
    }, 280)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="analysis-loading-wrapper">
      <div className="analysis-loading-card">
        <div className="analysis-loading-pulse">
          <span className="pulse-brand-mark">✦</span>
          <div className="pulse-ring ring-1" />
          <div className="pulse-ring ring-2" />
        </div>

        <h3 className="analysis-loading-title">Analyzing Innovation Profile</h3>
        <p className="analysis-loading-subtitle">
          AYU-RAKSHA AI is parsing ingredients, classical indications, and novelty vectors.
        </p>

        <div className="analysis-steps-list">
          {loadingSteps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex
            const isCurrent = idx === currentStepIndex
            return (
              <div
                key={step.text}
                className={`analysis-step-item ${
                  isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'
                }`}
              >
                <div className="step-indicator">
                  {isCompleted ? (
                    <span className="step-done-check">✓</span>
                  ) : isCurrent ? (
                    <span className="step-spinner-dot" />
                  ) : (
                    <span className="step-bullet">•</span>
                  )}
                </div>
                <span className="step-icon">{step.icon}</span>
                <span className="step-text">{step.text}</span>
              </div>
            )
          })}
        </div>

        <div className="analysis-progress-bar">
          <div
            className="analysis-progress-fill"
            style={{ width: `${((currentStepIndex + 1) / loadingSteps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
