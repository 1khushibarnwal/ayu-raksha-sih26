interface StatCardProps {
  label: string
  value: string
  subtitle: string
  icon: string
  variant?: 'default' | 'highlight'
}

function StatCard({
  label,
  value,
  subtitle,
  icon,
  variant = 'default',
}: StatCardProps) {
  return (
    <article
      className={`stat-card ${
        variant === 'highlight'
          ? 'stat-card-highlight'
          : ''
      }`}
    >
      <div className="stat-card-top">
        <span className="stat-label">
          {label}
        </span>

        <span className="stat-icon">
          {icon}
        </span>
      </div>

      <div className="stat-value">
        {value}
      </div>

      <p className="stat-subtitle">
        {subtitle}
      </p>
    </article>
  )
}

export default StatCard