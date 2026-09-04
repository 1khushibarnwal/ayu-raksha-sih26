import { Link } from 'react-router-dom'

interface AyuInsightProps {
  title?: string
  description?: string
}

function AyuInsight({
  title = 'Small habits create meaningful change.',
  description =
    'AYU helps you understand your wellness patterns and build healthier everyday routines.',
}: AyuInsightProps) {
  return (
    <section className="ayu-insight">

      <div className="insight-decoration">
        🌿
      </div>

      <div className="insight-content">

        <span className="insight-label">
          ✦ AYU INSIGHT
        </span>

        <h2>{title}</h2>

        <p>{description}</p>

        <Link
          to="/dashboard/insights"
          className="insight-link"
        >
          Explore insights
          <span>→</span>
        </Link>

      </div>

    </section>
  )
}

export default AyuInsight