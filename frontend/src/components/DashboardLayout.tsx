import { NavLink, Outlet } from 'react-router-dom'
import Logo from './Logo'

function DashboardLayout() {
  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">

        <div className="sidebar-header">
          <NavLink to="/">
            <Logo />
          </NavLink>
        </div>

        <nav className="sidebar-nav">

          {/* DASHBOARD */}
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <span>⌂</span>
            Dashboard
          </NavLink>

          {/* INNOVATION ANALYZER */}
          <NavLink
            to="/analyzer"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <span>⚗️</span>
            Analyzer
          </NavLink>

          {/* MY HEALTH */}
          <NavLink
            to="/dashboard/health"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <span>♡</span>
            My Health
          </NavLink>

          {/* ASSESSMENT */}
          <NavLink
            to="/dashboard/assessment"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <span>✦</span>
            Assessment
          </NavLink>

          {/* INSIGHTS */}
          <NavLink
            to="/dashboard/insights"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <span>◈</span>
            Insights
          </NavLink>

          {/* HISTORY */}
          <NavLink
            to="/dashboard/history"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <span>◷</span>
            History
          </NavLink>

        </nav>

        <div className="sidebar-bottom">

          {/* SETTINGS */}
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <span>⚙</span>
            Settings
          </NavLink>

          {/* LOG OUT */}
          <NavLink
            to="/"
            className="sidebar-link logout-link"
          >
            <span>↪</span>
            Log out
          </NavLink>

        </div>

      </aside>

      {/* MAIN */}
      <div className="dashboard-main">

        <header className="dashboard-header">

          <div>
            <span className="dashboard-header-label">
              AYU WELLNESS
            </span>
          </div>

          <div className="dashboard-user">

            <button className="notification-button">
              ♧
            </button>

            <div className="user-avatar">
              A
            </div>

            <span className="user-name">
              User
            </span>

          </div>

        </header>

        <main className="dashboard-content-area">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default DashboardLayout