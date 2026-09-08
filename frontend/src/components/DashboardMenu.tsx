import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { DashboardNavSection } from '../types/navigation'
import { defaultDashboardSections } from '../data/dashboardNav'

interface DashboardMenuProps {
  sections?: DashboardNavSection[]
  className?: string
}

function DashboardMenu({
  sections = defaultDashboardSections,
  className = '',
}: DashboardMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <div className={`dashboard-menu-wrapper ${className}`}>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        className={`dashboard-menu-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open Dashboard Menu"
        aria-expanded={isOpen}
        title="Dashboard & Modules"
      >
        <svg
          className="dashboard-menu-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      </button>

      {/* BACKDROP OVERLAY */}
      {isOpen && (
        <div
          className="dashboard-menu-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* FLYOUT DRAWER PANEL */}
      <div
        ref={panelRef}
        className={`dashboard-menu-panel ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
      >
        {/* PANEL HEADER */}
        <div className="dashboard-menu-header">
          <div className="dashboard-menu-header-info">
            <div className="dashboard-menu-logo-badge">
              <span className="brand-mark">✦</span>
              <div>
                <span className="dashboard-menu-title">AYU Platform</span>
                <span className="dashboard-menu-subtitle">Wellness Modules</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="dashboard-menu-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* QUICK LINK TO MAIN DASHBOARD */}
        <div className="dashboard-menu-quicklink">
          <Link
            to="/dashboard"
            className="dashboard-quicklink-button"
            onClick={() => setIsOpen(false)}
          >
            <span>Open Main Dashboard</span>
            <span>→</span>
          </Link>
        </div>

        {/* SCROLLABLE SECTIONS LIST */}
        <div className="dashboard-menu-content">
          {sections.map((section) => (
            <div key={section.id} className="dashboard-menu-section">
              {section.title && (
                <div className="dashboard-menu-section-title">
                  {section.title}
                </div>
              )}

              <div className="dashboard-menu-items">
                {section.items.map((item) => (
                  <Link
                    key={item.id}
                    to={item.to}
                    className="dashboard-menu-item"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon && (
                      <span className="dashboard-menu-item-icon">
                        {item.icon}
                      </span>
                    )}

                    <div className="dashboard-menu-item-text">
                      <div className="dashboard-menu-item-name">
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="dashboard-menu-item-badge">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <span className="dashboard-menu-item-desc">
                          {item.description}
                        </span>
                      )}
                    </div>

                    <span className="dashboard-menu-item-arrow">›</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* PANEL FOOTER */}
        <div className="dashboard-menu-footer">
          <span>🌿 Ancient wisdom. Modern care.</span>
        </div>
      </div>
    </div>
  )
}

export default DashboardMenu
