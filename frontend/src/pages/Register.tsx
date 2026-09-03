import { Link } from 'react-router-dom'

function Register() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark">✦</span>
          <span>AYU</span>
        </div>

        <div className="auth-heading">
          <span className="section-label">START YOUR JOURNEY</span>

          <h1>Create your account.</h1>

          <p>
            Begin building a healthier relationship with yourself.
          </p>
        </div>

        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full name</label>

            <input
              id="name"
              type="text"
              placeholder="Your name"
            />
          </div>

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
              placeholder="Create a password"
            />
          </div>

          <button type="submit" className="auth-button">
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">
            Sign in
          </Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to AYU
        </Link>
      </div>
    </main>
  )
}

export default Register