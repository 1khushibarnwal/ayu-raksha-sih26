import { Link } from 'react-router-dom'
import Logo from './Logo'

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo-link">
        <Logo />
      </Link>

      <nav className="nav-links">
        <Link to="/">Home</Link>
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