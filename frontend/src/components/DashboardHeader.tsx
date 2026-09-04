interface DashboardHeaderProps {
  name?: string
}

function DashboardHeader({
  name = 'there',
}: DashboardHeaderProps) {
  return (
    <div className="dashboard-welcome">
      <div>
        <span className="section-label">
          YOUR WELLNESS SPACE
        </span>

        <h1>
          Good morning, {name}. <span>🌿</span>
        </h1>

        <p>
          Here's a gentle overview of your wellness journey.
        </p>
      </div>

      <div className="dashboard-date">
        <span>Today</span>
        <strong>04 September 2026</strong>
      </div>
    </div>
  )
}

export default DashboardHeader