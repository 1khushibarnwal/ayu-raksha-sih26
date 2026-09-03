import './App.css'
import ayuLogo from './assets/ayu-logo.png'

function App() {
  return (
    <div className="app">
      {/* NAVBAR */}
      <header className="navbar">
        <a href="#" className="brand">
          <span className="brand-mark">✦</span>
          <span>AYU</span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>
        </nav>

        <button className="nav-button">
          Get Started
        </button>
      </header>

      {/* HERO */}
      <main>
        <section className="hero-section" id="home">
          <div className="hero-content">
            <span className="eyebrow">
              <span>✦</span> Ancient wisdom. Modern care.
            </span>

            <h1>
              Your health,
              <br />
              rooted in <span>nature.</span>
            </h1>

            <p className="hero-description">
              Discover a smarter approach to wellness inspired by
              the timeless principles of Ayurveda and designed for
              modern life.
            </p>

            <div className="hero-actions">
              <button className="primary-button">
                Begin Your Journey
                <span>→</span>
              </button>

              <a href="#about" className="text-button">
                Learn more <span>↓</span>
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="organic-shape"></div>

            <div className="logo-container">
              <img
                src={ayuLogo}
                alt="AYU Ayurvedic wellness"
                className="ayu-logo"
              />
            </div>

            <span className="floating-leaf leaf-one">✦</span>
            <span className="floating-leaf leaf-two">✦</span>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="trust-strip">
          <p>WELLNESS INSPIRED BY AYURVEDIC PRINCIPLES</p>

          <div className="trust-items">
            <span>🌿 Natural</span>
            <span>•</span>
            <span>🧘 Holistic</span>
            <span>•</span>
            <span>✨ Personalized</span>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about-section" id="about">
          <div className="section-heading">
            <span className="section-label">WHY AYU?</span>

            <h2>
              Wellness that understands
              <br />
              <span>the whole you.</span>
            </h2>

            <p>
              AYU brings together traditional wellness wisdom and
              modern technology to help you make better decisions
              about your everyday health.
            </p>
          </div>

          <div className="feature-grid" id="features">
            <article className="feature-card">
              <div className="feature-icon">🌿</div>

              <h3>Personalized Wellness</h3>

              <p>
                Recommendations designed around your unique
                lifestyle, habits, and wellness goals.
              </p>
            </article>

            <article className="feature-card featured-card">
              <div className="feature-icon">🩺</div>

              <h3>Holistic Approach</h3>

              <p>
                Look beyond individual symptoms and understand
                wellness as a balance of mind, body, and lifestyle.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">✨</div>

              <h3>Intelligent Insights</h3>

              <p>
                Technology helps turn your health information into
                simple, meaningful insights you can understand.
              </p>
            </article>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">
          <span className="brand-mark">✦</span>
          <strong>AYU</strong>
        </div>

        <p>
          Rooted in tradition. Designed for tomorrow.
        </p>

        <span className="footer-copy">
          © 2026 AYU
        </span>
      </footer>
    </div>
  )
}

export default App