import DashboardHeader from '../components/DashboardHeader'
import StatCard from '../components/StatCard'
import WellnessProgress from '../components/WellnessProgress'
import AyuInsight from '../components/AyuInsight'
import QuickAction from '../components/QuickAction'

function Dashboard() {
  const wellnessData = [
    {
      label: 'Sleep',
      value: 82,
      icon: '☾',
    },
    {
      label: 'Nutrition',
      value: 71,
      icon: '🍃',
    },
    {
      label: 'Activity',
      value: 78,
      icon: '◌',
    },
    {
      label: 'Mindfulness',
      value: 88,
      icon: '◉',
    },
  ]

  return (
    <div className="dashboard-page-content">

      <DashboardHeader />

      {/* STATS */}

      <section className="stats-grid">

        <StatCard
          label="Wellness Score"
          value="82"
          subtitle="A good foundation"
          icon="✦"
          variant="highlight"
        />

        <StatCard
          label="Current Goal"
          value="Sleep"
          subtitle="Focus area"
          icon="☾"
        />

        <StatCard
          label="Wellness Streak"
          value="7 days"
          subtitle="Keep going"
          icon="🔥"
        />

      </section>

      {/* MAIN GRID */}

      <section className="dashboard-main-grid">

        <WellnessProgress
          items={wellnessData}
        />

        <AyuInsight />

      </section>

      {/* QUICK ACTIONS */}

      <section className="quick-actions-section">

        <div className="card-heading">

          <div>
            <span className="section-label">
              QUICK ACTIONS
            </span>

            <h2>Continue your journey</h2>
          </div>

        </div>

        <div className="quick-actions-grid">

          <QuickAction
            icon="🩺"
            title="Health Assessment"
            description="Understand your wellness profile."
            to="/dashboard/assessment"
          />

          <QuickAction
            icon="♡"
            title="My Health"
            description="View your personal wellness information."
            to="/dashboard/health"
          />

          <QuickAction
            icon="◈"
            title="Insights"
            description="Discover meaningful patterns."
            to="/dashboard/insights"
          />

        </div>

      </section>

    </div>
  )
}

export default Dashboard