import { Link } from 'react-router-dom'

import Logo from '../components/Logo'
import Input from '../components/Input'
import Button from '../components/Button'

function Login() {
  return (
    <main className="auth-page">
      <div className="auth-card">

        <Link to="/">
          <Logo />
        </Link>

        <div className="auth-heading">
          <span className="section-label">
            WELCOME BACK
          </span>

          <h1>Good to see you.</h1>

          <p>
            Sign in to continue your wellness journey.
          </p>
        </div>

        <form className="auth-form">

          <Input
            id="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
          />

          <Button type="submit">
            Sign In
          </Button>

        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register">
            Create one
          </Link>
        </p>

        <Link
          to="/"
          className="back-home"
        >
          ← Back to AYU
        </Link>

      </div>
    </main>
  )
}

export default Login