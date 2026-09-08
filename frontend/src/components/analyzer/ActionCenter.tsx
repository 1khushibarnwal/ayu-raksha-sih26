import React, { useState } from 'react'
import type { ActionCenterResult, ActionTask, ActionTaskPriority } from '../../types/analyzer'
import EvidencePanel from './EvidencePanel'


interface ActionCenterProps {
  actionCenterData: ActionCenterResult
}

export const ActionCenter: React.FC<ActionCenterProps> = ({ actionCenterData }) => {
  const [tasks, setTasks] = useState<ActionTask[]>(actionCenterData?.tasks || [])
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL')
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)

  const handleToggleStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t
        const newStatus = t.status === 'Done' ? 'Pending' : t.status === 'Pending' ? 'In Progress' : 'Done'
        return {
          ...t,
          status: newStatus
        }
      })
    )
  }

  const getPriorityBadgeClass = (priority: ActionTaskPriority) => {
    switch (priority) {
      case 'High Priority':
        return 'prio-badge-high'
      case 'Medium Priority':
        return 'prio-badge-medium'
      case 'Upcoming':
        return 'prio-badge-upcoming'
      case 'Completed':
        return 'prio-badge-completed'
      default:
        return 'prio-badge-neutral'
    }
  }

  const filteredTasks = tasks.filter((t) => {
    if (selectedFilter === 'ALL') return true
    if (selectedFilter === 'HIGH') return t.priority === 'High Priority'
    if (selectedFilter === 'MEDIUM') return t.priority === 'Medium Priority'
    if (selectedFilter === 'UPCOMING') return t.priority === 'Upcoming'
    if (selectedFilter === 'DONE') return t.status === 'Done' || t.priority === 'Completed'
    return true
  })

  const highCount = tasks.filter((t) => t.priority === 'High Priority' && t.status !== 'Done').length
  const mediumCount = tasks.filter((t) => t.priority === 'Medium Priority' && t.status !== 'Done').length
  const upcomingCount = tasks.filter((t) => t.priority === 'Upcoming' && t.status !== 'Done').length
  const doneCount = tasks.filter((t) => t.status === 'Done' || t.priority === 'Completed').length

  return (
    <div className="action-center-container">
      <div className="action-center-header">
        <div className="header-title-area">
          <div className="feature-pill">Feature 17 • Execution Action Board</div>
          <h2 className="section-title">Action Center</h2>
          <p className="section-subtitle">
            Dynamic statutory task queue organized by risk priority and regulatory milestones.
          </p>
        </div>

        <div className="summary-chips-row">
          <div className="summary-chip prio-high">
            <span className="chip-count">{highCount}</span>
            <span className="chip-label">High Priority</span>
          </div>
          <div className="summary-chip prio-med">
            <span className="chip-count">{mediumCount}</span>
            <span className="chip-label">Medium Priority</span>
          </div>
          <div className="summary-chip prio-up">
            <span className="chip-count">{upcomingCount}</span>
            <span className="chip-label">Upcoming</span>
          </div>
          <div className="summary-chip prio-done">
            <span className="chip-count">{doneCount}</span>
            <span className="chip-label">Done</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="action-filter-tabs">
        <button
          type="button"
          className={`filter-tab-btn ${selectedFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('ALL')}
        >
          All Tasks ({tasks.length})
        </button>
        <button
          type="button"
          className={`filter-tab-btn ${selectedFilter === 'HIGH' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('HIGH')}
        >
          High Priority ({highCount})
        </button>
        <button
          type="button"
          className={`filter-tab-btn ${selectedFilter === 'MEDIUM' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('MEDIUM')}
        >
          Medium Priority ({mediumCount})
        </button>
        <button
          type="button"
          className={`filter-tab-btn ${selectedFilter === 'UPCOMING' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('UPCOMING')}
        >
          Upcoming ({upcomingCount})
        </button>
        <button
          type="button"
          className={`filter-tab-btn ${selectedFilter === 'DONE' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('DONE')}
        >
          Completed ({doneCount})
        </button>
      </div>

      {/* Action Cards List */}
      <div className="action-tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-tasks-state">
            <p>No statutory tasks in this category.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'Done'
            const isEvidenceOpen = expandedTaskId === task.id

            return (
              <div
                key={task.id}
                className={`action-task-card ${isDone ? 'task-card-done' : ''}`}
              >
                <div className="card-top-row">
                  <div className="prio-tag-group">
                    <span className={`task-prio-badge ${getPriorityBadgeClass(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="source-feature-tag">{task.sourceFeature}</span>
                  </div>

                  <button
                    type="button"
                    className={`status-cycle-btn status-${task.status.toLowerCase().replace(' ', '-')}`}
                    onClick={() => handleToggleStatus(task.id)}
                  >
                    {task.status === 'Done' && '✓ Done'}
                    {task.status === 'In Progress' && '⏳ In Progress'}
                    {task.status === 'Pending' && '⭕ Pending'}
                  </button>
                </div>

                <h3 className="task-headline">{task.title}</h3>
                <p className="task-reason-text"><strong>Why:</strong> {task.reason}</p>

                <div className="task-action-box">
                  <span className="action-label">Suggested Next Step:</span>
                  <span className="action-text">{task.suggestedAction}</span>
                </div>

                {task.dueDate && (
                  <div className="task-due-row">
                    <span className="due-label">Target Timeline:</span>
                    <span className="due-val">{task.dueDate}</span>
                  </div>
                )}

                {/* Evidence Drawer */}
                {task.evidence && task.evidence.length > 0 && (
                  <div className="task-evidence-drawer">
                    <button
                      type="button"
                      className="task-evidence-toggle"
                      onClick={() =>
                        setExpandedTaskId(isEvidenceOpen ? null : task.id)
                      }
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      {isEvidenceOpen
                        ? 'Hide Statutory Evidence'
                        : `View Statutory Authority (${task.evidence.length})`}
                    </button>

                    {isEvidenceOpen && (
                      <div className="task-evidence-body">
                        <EvidencePanel
                          evidenceList={task.evidence}
                          title={`Statutory Authority: ${task.title}`}
                        />
                      </div>
                    )}

                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
