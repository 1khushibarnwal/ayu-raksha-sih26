interface FeatureCardProps {
  icon: string
  title: string
  description: string
  featured?: boolean
}

function FeatureCard({
  icon,
  title,
  description,
  featured = false,
}: FeatureCardProps) {
  return (
    <article
      className={`feature-card ${
        featured ? 'featured-card' : ''
      }`}
    >
      <div className="feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>
    </article>
  )
}

export default FeatureCard