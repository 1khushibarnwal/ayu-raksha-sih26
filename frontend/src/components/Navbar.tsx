import { Link } from 'react-router-dom'
import Logo from './Logo'
import DashboardMenu from './DashboardMenu'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand-group">
        <DashboardMenu />
        <Link to="/" className="navbar-logo-link">
          <Logo />
        </Link>
      </div>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/analyzer">Analyzer</Link>
        <a href="/#about">About</a>
        <a href="/#features">Features</a>
      </nav>

      <Link
        to="/register"
        className="nav-button"
      >
        Get Started
      </Link>
    </header>
  )
}

export default Navbar