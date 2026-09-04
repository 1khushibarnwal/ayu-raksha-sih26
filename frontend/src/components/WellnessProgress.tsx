interface WellnessItem {
  label: string
  value: number
  icon: string
}

interface WellnessProgressProps {
  items: WellnessItem[]
}

function WellnessProgress({
  items,
}: WellnessProgressProps) {
  return (
    <section className="wellness-card">

      <div className="card-heading">
        <div>
          <span className="section-label">
            WELLNESS OVERVIEW
          </span>

          <h2>Your wellness journey</h2>
        </div>

        <span className="card-heading-icon">
          ✦
        </span>
      </div>

      <div className="wellness-list">

        {items.map((item) => (
          <div
            className="wellness-item"
            key={item.label}
          >
            <div className="wellness-item-header">

              <div className="wellness-item-name">
                <span>{item.icon}</span>
                <strong>{item.label}</strong>
              </div>

              <span className="wellness-percentage">
                {item.value}%
              </span>

            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${item.value}%`,
                }}
              />
            </div>
          </div>
        ))}

      </div>
    </section>
  )
}

export default WellnessProgress