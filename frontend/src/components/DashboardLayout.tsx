import { Link, Outlet } from 'react-router-dom'
import Logo from './Logo'

function DashboardLayout() {
  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">

        <div className="sidebar-header">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <nav className="sidebar-nav">

          <Link
            to="/dashboard"
            className="sidebar-link active"
          >
            <span>⌂</span>
            Dashboard
          </Link>

          <Link
            to="/dashboard/health"
            className="sidebar-link"
          >
            <span>♡</span>
            My Health
          </Link>

          <Link
            to="/dashboard/assessment"
            className="sidebar-link"
          >
            <span>✦</span>
            Assessment
          </Link>

          <Link
            to="/dashboard/insights"
            className="sidebar-link"
          >
            <span>◈</span>
            Insights
          </Link>

          <Link
            to="/dashboard/history"
            className="sidebar-link"
          >
            <span>◷</span>
            History
          </Link>

        </nav>

        <div className="sidebar-bottom">

          <Link
            to="/dashboard/settings"
            className="sidebar-link"
          >
            <span>⚙</span>
            Settings
          </Link>

          <Link
            to="/"
            className="sidebar-link logout-link"
          >
            <span>↪</span>
            Log out
          </Link>

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