import './App.css'

function App() {
  return (
    <main className="design-demo">
      <div className="demo-card">
        <span className="demo-badge">AYU</span>

        <h1>
          Ancient wisdom.
          <br />
          <span>Modern care.</span>
        </h1>

        <p>
          A smarter way to understand your health through the wisdom of
          Ayurveda.
        </p>

        <div className="demo-actions">
          <button className="btn btn-primary">
            Get Started
          </button>

          <button className="btn btn-secondary">
            Learn More
          </button>
        </div>
      </div>
    </main>
  )
}

export default App