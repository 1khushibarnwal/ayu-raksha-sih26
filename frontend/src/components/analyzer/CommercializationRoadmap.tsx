import React, { useState } from 'react'
import type { CommercializationRoadmapResult, RoadmapStage, RoadmapStageId } from '../../types/analyzer'
import EvidencePanel from './EvidencePanel'


interface CommercializationRoadmapProps {
  roadmapData: CommercializationRoadmapResult
}

export const CommercializationRoadmap: React.FC<CommercializationRoadmapProps> = ({ roadmapData }) => {
  const [activeStageId, setActiveStageId] = useState<RoadmapStageId>(roadmapData?.currentStageId || 'innovation')
  const [stages, setStages] = useState<RoadmapStage[]>(roadmapData?.stages || [])
  const [activeEvidenceStage, setActiveEvidenceStage] = useState<RoadmapStageId | null>(null)

  const activeStage = stages.find((s) => s.id === activeStageId) || stages[0]

  const handleToggleTask = (stageId: RoadmapStageId, taskId: string) => {
    setStages((prevStages) =>
      prevStages.map((stage) => {
        if (stage.id !== stageId) return stage
        const updatedTasks = stage.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
        const allCompleted = updatedTasks.every((t) => t.completed)
        const someCompleted = updatedTasks.some((t) => t.completed)
        const newStatus = allCompleted
          ? 'Completed'
          : someCompleted
          ? 'In Progress'
          : stage.status === 'Completed'
          ? 'In Progress'
          : stage.status

        return {
          ...stage,
          tasks: updatedTasks,
          status: newStatus as any
        }
      })
    )
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'stage-completed'
      case 'In Progress':
        return 'stage-in-progress'
      case 'Review Required':
        return 'stage-review'
      case 'Blocked':
        return 'stage-blocked'
      default:
        return 'stage-not-started'
    }
  }

  const totalTasks = stages.reduce((acc, s) => acc + s.tasks.length, 0)
  const completedTasks = stages.reduce(
    (acc, s) => acc + s.tasks.filter((t) => t.completed).length,
    0
  )
  const progressPercent = Math.round((completedTasks / (totalTasks || 1)) * 100)

  return (
    <div className="commercialization-roadmap-container">
      <div className="roadmap-header">
        <div className="roadmap-title-area">
          <div className="feature-pill">Feature 16 • Commercialization Stepper</div>
          <h2 className="section-title">Commercialization & IP Roadmap</h2>
          <p className="section-subtitle">
            10-stage end-to-end lifecycle navigation from formulation discovery to global market entry.
          </p>
        </div>

        <div className="roadmap-progress-widget">
          <div className="widget-header">
            <span className="widget-label">Overall Milestone Progress</span>
            <span className="widget-percent">{progressPercent}%</span>
          </div>
          <div className="widget-bar-bg">
            <div className="widget-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="widget-task-count">{completedTasks} of {totalTasks} milestones achieved</span>
        </div>
      </div>

      {/* Horizontal Stage Stepper Bar */}
      <div className="stepper-scroll-container">
        <div className="stepper-track">
          {stages.map((stage) => {
            const isActive = stage.id === activeStageId
            const isCompleted = stage.status === 'Completed'

            return (
              <button
                key={stage.id}
                type="button"
                className={`step-item-btn ${getStatusClass(stage.status)} ${isActive ? 'active-step' : ''}`}
                onClick={() => {
                  setActiveStageId(stage.id)
                  setActiveEvidenceStage(null)
                }}
              >
                <div className="step-circle">
                  {isCompleted ? '✓' : stage.stageNumber}
                </div>
                <div className="step-label-group">
                  <span className="step-number-tag">Stage {stage.stageNumber}</span>
                  <span className="step-title-text">{stage.title}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Stage Detailed Workspace */}
      <div className="active-stage-workspace">
        <div className="stage-hero-banner">
          <div className="hero-left">
            <span className="stage-icon-big">{activeStage.icon}</span>
            <div className="stage-title-block">
              <span className="stage-badge">Stage {activeStage.stageNumber} of 10</span>
              <h3>{activeStage.title}</h3>
              <p>{activeStage.subtitle}</p>
            </div>
          </div>

          <div className="hero-right">
            <span className={`stage-status-chip ${getStatusClass(activeStage.status)}`}>
              {activeStage.status}
            </span>
          </div>
        </div>

        <div className="stage-content-grid">
          {/* Left Column: Tasks Checklist */}
          <div className="stage-tasks-column">
            <h4 className="column-heading">
              <span>Mandatory Milestones & Action Checklist:</span>
              <span className="task-count-tag">
                {activeStage.tasks.filter((t) => t.completed).length}/{activeStage.tasks.length} Done
              </span>
            </h4>

            <div className="tasks-checklist">
              {activeStage.tasks.map((task) => (
                <label key={task.id} className={`task-checkbox-item ${task.completed ? 'task-done' : ''}`}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(activeStage.id, task.id)}
                  />
                  <span className="task-title-text">{task.title}</span>
                </label>
              ))}
            </div>

            {/* Recommended Action */}
            <div className="stage-action-card">
              <div className="card-label">Recommended Action:</div>
              <p>{activeStage.recommendedAction}</p>
            </div>
          </div>

          {/* Right Column: Relevant Documents & Evidence */}
          <div className="stage-docs-column">
            <h4 className="column-heading">Required Statutory Documents:</h4>
            <div className="stage-docs-list">
              {activeStage.relevantDocuments.map((doc, idx) => (
                <div key={idx} className="doc-pill-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>{doc}</span>
                </div>
              ))}
            </div>

            {/* Statutory Evidence Accordion */}
            {activeStage.evidence && activeStage.evidence.length > 0 && (
              <div className="stage-evidence-section">
                <button
                  type="button"
                  className="evidence-toggle-btn"
                  onClick={() =>
                    setActiveEvidenceStage(
                      activeEvidenceStage === activeStage.id ? null : activeStage.id
                    )
                  }
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  {activeEvidenceStage === activeStage.id
                    ? 'Hide Governing Statutes'
                    : `View Governing Statutes (${activeStage.evidence.length})`}
                </button>

                {activeEvidenceStage === activeStage.id && (
                  <div className="stage-evidence-list">
                    <EvidencePanel
                      evidenceList={activeStage.evidence}
                      title={`Statutory Authority: ${activeStage.title}`}
                    />
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
