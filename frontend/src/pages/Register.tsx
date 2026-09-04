import { Link } from 'react-router-dom'

import Logo from '../components/Logo'
import Input from '../components/Input'
import Button from '../components/Button'

function Register() {
  return (
    <main className="auth-page">
      <div className="auth-card">

        <Link to="/">
          <Logo />
        </Link>

        <div className="auth-heading">
          <span className="section-label">
            START YOUR JOURNEY
          </span>

          <h1>Create your account.</h1>

          <p>
            Begin building a healthier relationship with yourself.
          </p>
        </div>

        <form className="auth-form">

          <Input
            id="name"
            label="Full name"
            placeholder="Your name"
          />

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
            placeholder="Create a password"
          />

          <Button type="submit">
            Create Account
          </Button>

        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">
            Sign in
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

export default Register