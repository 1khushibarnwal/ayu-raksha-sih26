interface AssessmentProgressProps {
  current: number
  total: number
}

function AssessmentProgress({
  current,
  total,
}: AssessmentProgressProps) {
  const percentage =
    (current / total) * 100

  return (
    <div className="assessment-progress">

      <div className="assessment-progress-top">
        <span>
          Step {current} of {total}
        </span>

        <span>
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="assessment-progress-track">
        <div
          className="assessment-progress-fill"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

    </div>
  )
}

export default AssessmentProgress