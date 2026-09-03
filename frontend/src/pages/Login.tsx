import { Link } from 'react-router-dom'

function Login() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark">✦</span>
          <span>AYU</span>
        </div>

        <div className="auth-heading">
          <span className="section-label">WELCOME BACK</span>

          <h1>Good to see you.</h1>

          <p>
            Sign in to continue your wellness journey.
          </p>
        </div>

        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register">
            Create one
          </Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to AYU
        </Link>
      </div>
    </main>
  )
}

export default Login