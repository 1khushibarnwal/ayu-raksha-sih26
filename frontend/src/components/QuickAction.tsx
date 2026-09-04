import { Link } from 'react-router-dom'

interface QuickActionProps {
  icon: string
  title: string
  description: string
  to: string
}

function QuickAction({
  icon,
  title,
  description,
  to,
}: QuickActionProps) {
  return (
    <Link
      to={to}
      className="quick-action"
    >
      <div className="quick-action-icon">
        {icon}
      </div>

      <div>
        <h3>{title}</h3>

        <p>{description}</p>
      </div>

      <span className="quick-action-arrow">
        →
      </span>
    </Link>
  )
}

export default QuickAction