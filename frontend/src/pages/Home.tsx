import { Link } from 'react-router-dom'
import '../App.css'
import ayuLogo from '../assets/ayu-logo.png'
import DashboardMenu from '../components/DashboardMenu'

function Home() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-brand-group">
          <DashboardMenu />
          <a href="/" className="brand">
            <span className="brand-mark">✦</span>
            <span>AYU</span>
          </a>
        </div>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="/analyzer">Analyzer</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>
        </nav>

        <a href="/login" className="nav-button">
          Get Started
        </a>
      </header>

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
              <a href="/register" className="primary-button">
                Begin Your Journey
                <span>→</span>
              </a>

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

        <section className="about-section" id="about">
          <div className="section-heading">
            <span className="section-label">IP-SAKTI SAHAYAK SUITE</span>

            <h2>
              Protecting innovation,
              <br />
              <span>preserving knowledge.</span>
            </h2>

            <p>
              IP-SAKTI Sahayak brings together intellectual property, traditional knowledge,
              biodiversity, and regulatory intelligence to help Ayurveda innovators make
              evidence-backed decisions across national and international regimes.
            </p>
          </div>

          <div className="home-showcase-container" id="features">
            {/* SECTION 1: CORE SCREENING & NOVELTY */}
            <div className="showcase-category-block">
              <div className="showcase-category-header">
                <span className="showcase-category-tag">SECTION 1 • SCREENING & NOVELTY EVALUATION</span>
                <h3 className="showcase-category-title">🌿 Core Innovation & Traditional Knowledge Screening</h3>
                <p className="showcase-category-desc">
                  Cross-reference formulations against classical Samhitas and TKDL prior-art indices to establish statutory novelty.
                </p>
              </div>

              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-icon">⚗️</div>
                  <h3>Innovation Questionnaire</h3>
                  <p>
                    Guided 5-point formulation evaluation capturing product category, botanical actives, extraction lineage, and novel claims.
                  </p>
                  <ul className="feature-points-list">
                    <li>Dynamic botanical ingredient auto-complete</li>
                    <li>Provenance & biodiversity source mapping</li>
                    <li>Target market jurisdiction selector</li>
                  </ul>
                  <Link to="/analyzer" className="feature-card-btn-link">
                    <span>Launch Innovation Analyzer</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="feature-card featured-card">
                  <div className="feature-icon">📜</div>
                  <h3>Traditional Knowledge Detector</h3>
                  <p>
                    Automated screening against codified classical texts (Charaka, Sushruta, Vagbhata) and TKDL prior-art databases.
                  </p>
                  <ul className="feature-points-list">
                    <li>Classical Samhita verse correspondences</li>
                    <li>Prior-art therapeutic use comparison</li>
                    <li>Section 3(p) non-patentability risk badge</li>
                  </ul>
                  <Link to="/analyzer?tab=overview" className="feature-card-btn-link">
                    <span>Detect Traditional Knowledge</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">🏷️</div>
                  <h3>AI Statutory Classification</h3>
                  <p>
                    Multi-regime categorization under Drug & Cosmetics Rule 158-B, Schedule T GMP, and Phytopharmaceutical guidelines.
                  </p>
                  <ul className="feature-points-list">
                    <li>Classical vs. Proprietary classification</li>
                    <li>Clinical trial exemption indicators</li>
                    <li>Explainable regulatory vector breakdown</li>
                  </ul>
                  <Link to="/analyzer?tab=overview" className="feature-card-btn-link">
                    <span>View Classification Engine</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* SECTION 2: IP STRATEGY, RISK & BIODIVERSITY */}
            <div className="showcase-category-block">
              <div className="showcase-category-header">
                <span className="showcase-category-tag">SECTION 2 • STATUTORY RIGHTS & COMPLIANCE</span>
                <h3 className="showcase-category-title">🛡️ IP Strategy, Risk Matrix & Biodiversity Clearance</h3>
                <p className="showcase-category-desc">
                  Formulate multi-tier IP protection while proactively navigating Section 3(p) objections and NBA statutory clearance.
                </p>
              </div>

              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-icon">🛡️</div>
                  <h3>IP Protection Strategy</h3>
                  <p>
                    Tailored IP route mapping evaluated against Indian Patent Act Section 3(p)/3(e), Trade Marks Act 1999, and Design rights.
                  </p>
                  <ul className="feature-points-list">
                    <li>Patent, Trademark, Design & Trade Secret routes</li>
                    <li>Section 3(e) synergistic data requirements</li>
                    <li>Specific claim drafting recommendations</li>
                  </ul>
                  <Link to="/analyzer?tab=overview" className="feature-card-btn-link">
                    <span>Explore IP Protection Routes</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">⚠️</div>
                  <h3>IP Risk Center (5-D Matrix)</h3>
                  <p>
                    Explainable risk indexing computed across 5 regulatory dimensions with precedent case law and factor weights.
                  </p>
                  <ul className="feature-points-list">
                    <li>Patentability & Section 3(p) risk scoring</li>
                    <li>Biodiversity & classification risk indices</li>
                    <li>Landmark High Court / IPO precedent citations</li>
                  </ul>
                  <Link to="/analyzer?tab=overview" className="feature-card-btn-link">
                    <span>Open 5-D Risk Center</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="feature-card featured-card">
                  <div className="feature-icon">🌿</div>
                  <h3>Biodiversity & ABS Checker</h3>
                  <p>
                    Evaluate Access & Benefit Sharing (ABS) obligations under the Biological Diversity Act, 2002 and NBA regulations.
                  </p>
                  <ul className="feature-points-list">
                    <li>Form I (foreign entity) vs Form III (patent) check</li>
                    <li>Section 2(c) value-added product exclusions</li>
                    <li>State Biodiversity Board (SBB) intimation rules</li>
                  </ul>
                  <Link to="/analyzer?tab=overview" className="feature-card-btn-link">
                    <span>Check NBA / ABS Compliance</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* SECTION 3: GLOBAL REGULATORY & DIGITAL PASSPORT */}
            <div className="showcase-category-block">
              <div className="showcase-category-header">
                <span className="showcase-category-tag">SECTION 3 • INTERNATIONAL EXPANSION & CERTIFICATION</span>
                <h3 className="showcase-category-title">🌐 Global Market Readiness & Digital IP Passport</h3>
                <p className="showcase-category-desc">
                  Cross-border statutory simulation across 5 major jurisdictions with official printable compliance passports.
                </p>
              </div>

              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-icon">🛣️</div>
                  <h3>Regulatory Navigator</h3>
                  <p>
                    Interactive 6-step statutory compliance wizard mapping product attributes, manufacturing standards, and market dossiers.
                  </p>
                  <ul className="feature-points-list">
                    <li>Step-by-step statutory pathway decision tree</li>
                    <li>Dossier documentation checklist & status</li>
                    <li>Schedule T & AYUSH GMP requirements</li>
                  </ul>
                  <Link to="/analyzer?tab=overview" className="feature-card-btn-link">
                    <span>Launch 6-Step Navigator</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">🌐</div>
                  <h3>Global Market Simulator</h3>
                  <p>
                    Evaluate export readiness across US FDA (DSHEA vs Botanical Drug), EU EMA (THMPD), Japan (Kampo), and Australia (TGA).
                  </p>
                  <ul className="feature-points-list">
                    <li>Cross-jurisdiction statutory feasibility comparison</li>
                    <li>NDI 75-day notification vs OTC monograph</li>
                    <li>15-year traditional use EU evidence rules</li>
                  </ul>
                  <Link to="/analyzer?tab=markets" className="feature-card-btn-link">
                    <span>Simulate Global Markets</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="feature-card featured-card">
                  <div className="feature-icon">🛂</div>
                  <h3>AYU-IP Digital Passport</h3>
                  <p>
                    Official printable statutory readiness credential consolidating IP, biodiversity, and regulatory compliance into a verifiable dossier.
                  </p>
                  <ul className="feature-points-list">
                    <li>Overall readiness score & composite dial</li>
                    <li>4-Pillar compliance summary (IP, TK, ABS, Global)</li>
                    <li>Printable official passport certificate</li>
                  </ul>
                  <Link to="/analyzer?tab=passport" className="feature-card-btn-link">
                    <span>Generate AYU-IP Passport</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* SECTION 4: COMMERCIALIZATION, ACTION CENTER & EVIDENCE */}
            <div className="showcase-category-block">
              <div className="showcase-category-header">
                <span className="showcase-category-tag">SECTION 4 • EXECUTION & AUDIT-GRADE EVIDENCE</span>
                <h3 className="showcase-category-title">🗺️ Commercialization Roadmap, Actions & Evidence Locker</h3>
                <p className="showcase-category-desc">
                  Convert legal findings into actionable commercial milestones backed by centralized statutory gazette citations.
                </p>
              </div>

              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-icon">🗺️</div>
                  <h3>10-Stage Commercial Roadmap</h3>
                  <p>
                    Interactive formulation-to-market lifecycle roadmap from concept validation to global distribution and post-market vigilance.
                  </p>
                  <ul className="feature-points-list">
                    <li>10 structured milestone stages with progress tracking</li>
                    <li>Interactive task completion checklists</li>
                    <li>Embedded evidence panels for each stage</li>
                  </ul>
                  <Link to="/analyzer?tab=roadmap" className="feature-card-btn-link">
                    <span>Explore 10-Stage Roadmap</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">⚡</div>
                  <h3>Statutory Action Center</h3>
                  <p>
                    Prioritized legal and regulatory filing tasks categorized by urgency, timeline estimates, and responsible agencies.
                  </p>
                  <ul className="feature-points-list">
                    <li>High, Medium, and Upcoming priority filters</li>
                    <li>Responsible agency tagging (IPO, NBA, CDSCO, FDA)</li>
                    <li>Live task status toggling and progress analytics</li>
                  </ul>
                  <Link to="/analyzer?tab=action_center" className="feature-card-btn-link">
                    <span>Open Action Center</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="feature-card featured-card">
                  <div className="feature-icon">🗄️</div>
                  <h3>Audit-Grade Evidence Locker</h3>
                  <p>
                    Centralized verifiable statutory repository. Every high-impact AI conclusion is indexed with exact gazette provisions and authorities.
                  </p>
                  <ul className="feature-points-list">
                    <li>Statutory, TKDL, and Regulatory citation index</li>
                    <li>Searchable excerpts with authority levels</li>
                    <li>Traceable source references for patent filings</li>
                  </ul>
                  <Link to="/analyzer?tab=evidence_locker" className="feature-card-btn-link">
                    <span>Browse Evidence Locker</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* SECTION 5: INTELLIGENCE, RESEARCH & EXPERT REVIEW */}
            <div className="showcase-category-block">
              <div className="showcase-category-header">
                <span className="showcase-category-tag">SECTION 5 • RAG INTELLIGENCE & EXPERT NETWORK</span>
                <h3 className="showcase-category-title">🤖 Multilingual AI, Document OCR & Legal Escalation</h3>
                <p className="showcase-category-desc">
                  Voice-enabled legal assistance, smart document extraction, statutory timelines, and verified patent attorney review.
                </p>
              </div>

              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-icon">🤖</div>
                  <h3>Ask AYU-RAKSHA (Voice AI)</h3>
                  <p>
                    Multilingual RAG legal assistant grounded strictly in verified Acts, Samhitas, and case law with real-time voice input/output.
                  </p>
                  <ul className="feature-points-list">
                    <li>English, हिन्दी & বাংলা voice assistance</li>
                    <li>Exact statutory citations and provision badges</li>
                    <li>Document-grounded contextual Q&A mode</li>
                  </ul>
                  <Link to="/analyzer?tab=chat_assistant" className="feature-card-btn-link">
                    <span>Talk to AYU-RAKSHA AI</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">📁</div>
                  <h3>Smart Document Upload (OCR)</h3>
                  <p>
                    Ingest lab COAs, formulation sheets, research PDFs, and patent drafts with automated entity extraction and form filling.
                  </p>
                  <ul className="feature-points-list">
                    <li>Automatic botanical & solvent extraction</li>
                    <li>Direct routing into Ask AYU-RAKSHA chat</li>
                    <li>Standardized compliance document parsing</li>
                  </ul>
                  <Link to="/analyzer?tab=doc_upload" className="feature-card-btn-link">
                    <span>Upload Formulation Docs</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="feature-card featured-card">
                  <div className="feature-icon">👨‍⚖️</div>
                  <h3>Human Expert Escalation</h3>
                  <p>
                    Direct escalation to verified Indian Patent Attorneys, National Biodiversity Authority (NBA) consultants, and herbal regulatory lawyers.
                  </p>
                  <ul className="feature-points-list">
                    <li>Auto-attaches formulation context & evidence items</li>
                    <li>Specialist routing for Section 3(p) & NBA filings</li>
                    <li>Live request tracker & specialist notes</li>
                  </ul>
                  <Link to="/analyzer?tab=expert_escalation" className="feature-card-btn-link">
                    <span>Request Expert Legal Review</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* SECTION 6: PORTFOLIO GOVERNANCE & RIGOR */}
            <div className="showcase-category-block">
              <div className="showcase-category-header">
                <span className="showcase-category-tag">SECTION 6 • ENTERPRISE PORTFOLIO GOVERNANCE</span>
                <h3 className="showcase-category-title">💼 Formulation Portfolio, Versioning & Rigor Controls</h3>
                <p className="showcase-category-desc">
                  Manage multi-version Ayurvedic formulations, historical audit trails, and customizable AI statutory reasoning rigor.
                </p>
              </div>

              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-icon">💼</div>
                  <h3>My Innovations Portfolio</h3>
                  <p>
                    Comprehensive portfolio management tracking active formulations, immutable version snapshots (v1 → v2), and readiness diffs.
                  </p>
                  <ul className="feature-points-list">
                    <li>Interactive search & multi-tag filtering</li>
                    <li>Chronological version history & diff viewer</li>
                    <li>One-click workspace restore & re-analysis</li>
                  </ul>
                  <Link to="/innovations" className="feature-card-btn-link">
                    <span>Open Portfolio Dashboard</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">📜</div>
                  <h3>Source Explorer & Timeline</h3>
                  <p>
                    Explore codified Ayurvedic classical texts and track the chronological evolution of Indian and international herbal statutes.
                  </p>
                  <ul className="feature-points-list">
                    <li>Samhita verse & pharmacopoeia repository</li>
                    <li>Gazette amendment diffs & historical milestones</li>
                    <li>Cross-referenced statutory authorities</li>
                  </ul>
                  <Link to="/analyzer?tab=source_explorer" className="feature-card-btn-link">
                    <span>Explore Classical Sources</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">⚙️</div>
                  <h3>Profile & Reasoning Rigor</h3>
                  <p>
                    Personalize your professional persona, configure AI reasoning rigor (Conservative Statutory vs. Exploratory R&D), and govern privacy.
                  </p>
                  <ul className="feature-points-list">
                    <li>Vaidya, Researcher, Attorney & Founder personas</li>
                    <li>Statutory abstention sensitivity controls</li>
                    <li>Data privacy & local storage isolation</li>
                  </ul>
                  <Link to="/settings" className="feature-card-btn-link">
                    <span>Configure Rigor & Settings</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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

export default Home